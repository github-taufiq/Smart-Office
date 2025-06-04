package com.lift.conf.system.smartoffice.controller;

import com.lift.conf.system.smartoffice.dto.*;
import com.lift.conf.system.smartoffice.service.BookingService;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/request")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<BookingResponseDto> requestBooking(@Valid @RequestBody BookingRequestDto bookingRequestDto) throws BadRequestException {
        BookingResponseDto bookingResponse = bookingService.createBookingRequest(bookingRequestDto);
        return new ResponseEntity<>(bookingResponse, HttpStatus.CREATED);
    }

    @DeleteMapping("/{bookingId}/cancel-my-booking")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<BookingResponseDto> cancelMyBooking(@PathVariable Long bookingId) throws BadRequestException {
        BookingResponseDto bookingResponse = bookingService.cancelUserBooking(bookingId);
        return ResponseEntity.ok(bookingResponse);
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<BookingResponseDto>> getMyBookings() {
        List<BookingResponseDto> bookings = bookingService.getMyBookings();
        return ResponseEntity.ok(bookings);
    }

    @PostMapping("/available-rooms") // Changed to POST to accept request body
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'OFFICE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<RoomDto>> getAvailableRooms(@Valid @RequestBody RoomAvailabilityRequestDto availabilityRequestDto) throws BadRequestException {
        List<RoomDto> availableRooms = bookingService.findAvailableRooms(availabilityRequestDto);
        return ResponseEntity.ok(availableRooms);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('OFFICE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getPendingBookingsForMyOffice() {
        // Service layer will determine if admin is for 'their' office or super_admin
        List<BookingResponseDto> pendingBookings = bookingService.getPendingBookingsForMyOffice();
        return ResponseEntity.ok(pendingBookings);
    }

    @PostMapping("/{bookingId}/process-approval")
    @PreAuthorize("hasAnyRole('OFFICE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<BookingResponseDto> processBookingApproval(
            @PathVariable Long bookingId,
            @Valid @RequestBody BookingApprovalRequestDto approvalRequestDto) throws BadRequestException {
        BookingResponseDto bookingResponse = bookingService.processBookingApproval(bookingId, approvalRequestDto);
        return ResponseEntity.ok(bookingResponse);
    }

    @GetMapping("/office/{officeId}")
    @PreAuthorize("hasAnyRole('OFFICE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getAllBookingsForOffice(@PathVariable Long officeId) {
        // Service layer will validate if the admin can access this officeId
        List<BookingResponseDto> bookings = bookingService.getAllBookingsForOffice(officeId);
        return ResponseEntity.ok(bookings);
    }

    @DeleteMapping("/{bookingId}/admin-cancel")
    @PreAuthorize("hasAnyRole('OFFICE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<BookingResponseDto> adminCancelBooking(@PathVariable Long bookingId) throws BadRequestException {
        BookingResponseDto bookingResponse = bookingService.adminCancelBooking(bookingId);
        return ResponseEntity.ok(bookingResponse);
    }
}