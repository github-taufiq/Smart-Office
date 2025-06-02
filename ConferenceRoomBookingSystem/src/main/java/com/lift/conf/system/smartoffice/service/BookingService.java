package com.lift.conf.system.smartoffice.service;

import com.lift.conf.system.smartoffice.exception.UnauthorizedOperationException;
import com.lift.conf.system.smartoffice.dto.*;
import com.lift.conf.system.smartoffice.exception.ResourceNotFoundException;
import com.lift.conf.system.smartoffice.model.*;
import com.lift.conf.system.smartoffice.repository.BookingRepository;
import com.lift.conf.system.smartoffice.repository.OfficeLocationRepository;
import com.lift.conf.system.smartoffice.repository.RoomRepository;
import com.lift.conf.system.smartoffice.repository.UserRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final OfficeLocationRepository officeLocationRepository;

    public BookingService(
            BookingRepository bookingRepository,
            RoomRepository roomRepository,
            UserRepository userRepository,
            OfficeLocationRepository officeLocationRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.officeLocationRepository = officeLocationRepository;
    }

    @Transactional
    public BookingResponseDto createBookingRequest(BookingRequestDto bookingRequestDto) throws BadRequestException {
        // Rule: Can book as early as 30 mins before
        if (bookingRequestDto.getStartTime().isBefore(LocalDateTime.now().plusMinutes(30))) {
            throw new BadRequestException("Bookings must be made at least 30 minutes in advance.");
        }
        if (bookingRequestDto.getStartTime().isAfter(bookingRequestDto.getEndTime()) || bookingRequestDto.getStartTime().isEqual(bookingRequestDto.getEndTime())) {
            throw new BadRequestException("Booking start time must be before end time.");
        }

        Room room = roomRepository.findById(bookingRequestDto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + bookingRequestDto.getRoomId()));

        // Check for immediate conflicts for PENDING_APPROVAL or APPROVED bookings (optional, admin can resolve)
        // This basic check avoids obviously impossible requests. Admins make the final call.
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                room.getId(),
                bookingRequestDto.getStartTime(),
                bookingRequestDto.getEndTime(),
                List.of(BookingStatus.APPROVED, BookingStatus.PENDING_APPROVAL)
        );
        if (!conflictingBookings.isEmpty()) {
            throw new BadRequestException("The room is already requested or booked for the selected time slot. Please choose another time or await admin review of pending requests.");
        }


        User requester = getCurrentUser();

        Booking booking = new Booking(
                room,
                requester,
                bookingRequestDto.getStartTime(),
                bookingRequestDto.getEndTime(),
                bookingRequestDto.getTeamName() != null ? bookingRequestDto.getTeamName() : requester.getDefaultTeamName(),
                bookingRequestDto.getPurpose()
        );
        // Status is set to PENDING_APPROVAL by default in Booking constructor

        Booking savedBooking = bookingRepository.save(booking);
        // TODO: Implement notification to respective office admin team
        return mapToBookingResponseDto(savedBooking);
    }

    @Transactional
    public BookingResponseDto cancelUserBooking(Long bookingId) throws BadRequestException {
        User currentUser = getCurrentUser();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getRequestedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedOperationException("You are not authorized to cancel this booking.");
        }

        if (booking.getStatus() == BookingStatus.PENDING_APPROVAL || booking.getStatus() == BookingStatus.APPROVED) {
            // Users can cancel pending or approved bookings.
            // If approved, it might also notify admin.
            booking.setStatus(BookingStatus.CANCELLED_BY_USER);
            // booking.setAdminNotes((booking.getAdminNotes() == null ? "" : booking.getAdminNotes() + "\n") + "Cancelled by user.");
            Booking updatedBooking = bookingRepository.save(booking);
            return mapToBookingResponseDto(updatedBooking);
        } else {
            throw new BadRequestException("Booking cannot be cancelled as it's already " + booking.getStatus().toString().toLowerCase() + " or completed.");
        }
    }

    public List<BookingResponseDto> getMyBookings() {
        User currentUser = getCurrentUser();
        return bookingRepository.findByRequestedByIdOrderByStartTimeDesc(currentUser.getId())
                .stream()
                .map(this::mapToBookingResponseDto)
                .collect(Collectors.toList());
    }

    public List<RoomDto> findAvailableRooms(RoomAvailabilityRequestDto requestDto) throws BadRequestException {
        if (requestDto.getStartTime().isAfter(requestDto.getEndTime()) || requestDto.getStartTime().isEqual(requestDto.getEndTime())) {
            throw new BadRequestException("Start time must be before end time.");
        }
        if (requestDto.getStartTime().isBefore(LocalDateTime.now().plusMinutes(29))) { // Give 1 min buffer for processing
            throw new BadRequestException("Cannot search for rooms less than 30 minutes from now.");
        }


        OfficeLocation office = officeLocationRepository.findById(requestDto.getOfficeLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Office Location not found"));

        List<Room> roomsInOffice = roomRepository.findByOfficeLocationId(office.getId());

        // Filter by capacity and AV equipment if specified
        List<Room> filteredRooms = roomsInOffice.stream()
                .filter(room -> room.getCapacity() >= requestDto.getRequiredCapacity())
                .filter(room -> requestDto.getRequiresAVEquipment() == null || room.isHasAVEquipment() == requestDto.getRequiresAVEquipment())
                .collect(Collectors.toList());

        // For each filtered room, check if it has any APPROVED bookings in the requested time slot
        List<Room> availableRooms = filteredRooms.stream()
                .filter(room -> !bookingRepository.existsApprovedBookingInSlot(room.getId(), requestDto.getStartTime(), requestDto.getEndTime()))
                .collect(Collectors.toList());

        return availableRooms.stream().map(this::mapToRoomDto).collect(Collectors.toList());
    }


    // --- Admin facing methods ---

    @Transactional
    public BookingResponseDto processBookingApproval(Long bookingId, BookingApprovalRequestDto approvalRequestDto) throws BadRequestException {
        User adminUser = getCurrentUser();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Check if admin manages the office of this booking
        OfficeLocation bookingOffice = booking.getRoom().getOfficeLocation();
        if (adminUser.getRole() != UserRole.ROLE_OFFICE_ADMIN ||
                adminUser.getManagedOffice() == null ||
                !adminUser.getManagedOffice().getId().equals(bookingOffice.getId())) {
            // Also allow SUPER_ADMIN to approve any booking
            if(adminUser.getRole() != UserRole.ROLE_SUPER_ADMIN) {
                throw new UnauthorizedOperationException("You are not authorized to manage bookings for this office.");
            }
        }

        if (booking.getStatus() != BookingStatus.PENDING_APPROVAL) {
            throw new BadRequestException("This booking is not pending approval. Current status: " + booking.getStatus());
        }

        if (approvalRequestDto.getStatus() == BookingStatus.APPROVED) {
            // Double-check for conflicts again before approving, specifically for APPROVED bookings
            List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                    booking.getRoom().getId(),
                    booking.getStartTime(),
                    booking.getEndTime(),
                    List.of(BookingStatus.APPROVED) // Only check against already approved ones
            );
            if (!conflictingBookings.isEmpty()) {
                // Could also list the conflicting booking IDs
                throw new BadRequestException("Cannot approve: This room is already booked by another approved request for the selected time slot.");
            }
            booking.setStatus(BookingStatus.APPROVED);
            // TODO: Notify user of approval
        } else if (approvalRequestDto.getStatus() == BookingStatus.REJECTED) {
            booking.setStatus(BookingStatus.REJECTED);
            // TODO: Notify user of rejection
        } else {
            throw new BadRequestException("Invalid approval status. Must be APPROVED or REJECTED.");
        }

        booking.setApprovedBy(adminUser);
        booking.setAdminNotes(approvalRequestDto.getAdminNotes());
        booking.setDecisionTimestamp(LocalDateTime.now());

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToBookingResponseDto(updatedBooking);
    }

    public List<BookingResponseDto> getPendingBookingsForMyOffice() {
        User adminUser = getCurrentUser();
        if (adminUser.getRole() != UserRole.ROLE_OFFICE_ADMIN || adminUser.getManagedOffice() == null) {
            if(adminUser.getRole() == UserRole.ROLE_SUPER_ADMIN){ // Super admin can see all pending
                return bookingRepository.findByStatusOrderByRequestTimestampAsc(BookingStatus.PENDING_APPROVAL)
                        .stream().map(this::mapToBookingResponseDto).collect(Collectors.toList());
            }
            throw new UnauthorizedOperationException("You are not authorized to view pending bookings or do not manage an office.");
        }
        Long officeId = adminUser.getManagedOffice().getId();
        return bookingRepository.findPendingByOfficeLocationId(officeId, BookingStatus.PENDING_APPROVAL)
                .stream()
                .map(this::mapToBookingResponseDto)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDto> getAllBookingsForOffice(Long officeId) {
        User adminUser = getCurrentUser();
        // Validate admin has access to this officeId or is super_admin
        if (adminUser.getRole() == UserRole.ROLE_OFFICE_ADMIN &&
                (adminUser.getManagedOffice() == null || !adminUser.getManagedOffice().getId().equals(officeId))) {
            throw new UnauthorizedOperationException("You are not authorized to view bookings for this office.");
        }
        // If ROLE_SUPER_ADMIN, they can view any office.

        return bookingRepository.findAllByOfficeLocationId(officeId)
                .stream().map(this::mapToBookingResponseDto).collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDto adminCancelBooking(Long bookingId) throws BadRequestException {
        User adminUser = getCurrentUser();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        OfficeLocation bookingOffice = booking.getRoom().getOfficeLocation();
        if (adminUser.getRole() != UserRole.ROLE_OFFICE_ADMIN ||
                adminUser.getManagedOffice() == null ||
                !adminUser.getManagedOffice().getId().equals(bookingOffice.getId())) {
            if(adminUser.getRole() != UserRole.ROLE_SUPER_ADMIN) {
                throw new UnauthorizedOperationException("You are not authorized to cancel bookings for this office.");
            }
        }

        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CANCELLED_BY_ADMIN || booking.getStatus() == BookingStatus.CANCELLED_BY_USER) {
            throw new BadRequestException("Booking is already completed or cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED_BY_ADMIN);
        booking.setAdminNotes((booking.getAdminNotes() == null ? "" : booking.getAdminNotes() + "\n") + "Cancelled by admin: " + adminUser.getUsername());
        booking.setApprovedBy(adminUser); // Record who cancelled it
        booking.setDecisionTimestamp(LocalDateTime.now());

        Booking updatedBooking = bookingRepository.save(booking);
        // TODO: Notify user of cancellation by admin
        return mapToBookingResponseDto(updatedBooking);
    }


    // --- Helper methods ---
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedOperationException("User not authenticated.");
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username + ". User may not exist in the system."));
    }

    private BookingResponseDto mapToBookingResponseDto(Booking booking) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setId(booking.getId());
        dto.setRoomId(booking.getRoom().getId());
        dto.setRoomName(booking.getRoom().getName());
        dto.setOfficeLocationId(booking.getRoom().getOfficeLocation().getId());
        dto.setOfficeLocationName(booking.getRoom().getOfficeLocation().getName());
        dto.setRequestedByUserId(booking.getRequestedBy().getId());
        dto.setRequestedByUsername(booking.getRequestedBy().getUsername());
        dto.setTeamName(booking.getTeamName());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setStatus(booking.getStatus());
        if (booking.getApprovedBy() != null) {
            dto.setApprovedByUserId(booking.getApprovedBy().getId());
            dto.setApprovedByUsername(booking.getApprovedBy().getUsername());
        }
        dto.setRequestTimestamp(booking.getRequestTimestamp());
        dto.setDecisionTimestamp(booking.getDecisionTimestamp());
        dto.setAdminNotes(booking.getAdminNotes());
        return dto;
    }

    private RoomDto mapToRoomDto(Room room) {
        RoomDto dto = new RoomDto();
        dto.setId(room.getId());
        dto.setName(room.getName());
        dto.setCapacity(room.getCapacity());
        dto.setOfficeLocationId(room.getOfficeLocation().getId());
        dto.setOfficeLocationName(room.getOfficeLocation().getName());
        // You might want to construct a more descriptive floorInfo here
        dto.setFloorInfo(room.getOfficeLocation().getName() + " - Room: " + room.getName());
        dto.setHasAVEquipment(room.isHasAVEquipment());
        dto.setDescription(room.getDescription());
        return dto;
    }
}