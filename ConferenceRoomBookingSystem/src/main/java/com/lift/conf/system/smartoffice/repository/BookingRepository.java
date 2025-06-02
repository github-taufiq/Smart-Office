package com.lift.conf.system.smartoffice.repository;

import com.lift.conf.system.smartoffice.model.Booking;
import com.lift.conf.system.smartoffice.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByRequestedByIdOrderByStartTimeDesc(Long userId);

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.status IN :statuses AND " +
            "((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findConflictingBookings(@Param("roomId") Long roomId,
                                          @Param("startTime") LocalDateTime startTime,
                                          @Param("endTime") LocalDateTime endTime,
                                          @Param("statuses") List<BookingStatus> statuses);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN TRUE ELSE FALSE END " +
            "FROM Booking b WHERE b.room.id = :roomId AND b.status = com.lift.conf.system.smartoffice.model.BookingStatus.APPROVED AND " +
            "(b.startTime < :endTime AND b.endTime > :startTime)")
    boolean existsApprovedBookingInSlot(@Param("roomId") Long roomId,
                                        @Param("startTime") LocalDateTime startTime,
                                        @Param("endTime") LocalDateTime endTime);


    @Query("SELECT b FROM Booking b WHERE b.room.officeLocation.id = :officeId AND b.status = :status ORDER BY b.requestTimestamp ASC")
    List<Booking> findPendingByOfficeLocationId(@Param("officeId") Long officeId, @Param("status") BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.room.officeLocation.id = :officeId ORDER BY b.startTime DESC")
    List<Booking> findAllByOfficeLocationId(@Param("officeId") Long officeId);

    List<Booking> findByStatusOrderByRequestTimestampAsc(BookingStatus status); // For super admin
}