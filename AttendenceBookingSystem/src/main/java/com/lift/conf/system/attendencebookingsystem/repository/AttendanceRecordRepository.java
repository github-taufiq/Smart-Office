package com.lift.conf.system.attendencebookingsystem.repository;

import com.lift.conf.system.attendencebookingsystem.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    Optional<AttendanceRecord> findByUserIdAndAttendanceDate(String userId, LocalDate attendanceDate);

    List<AttendanceRecord> findByUserIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(String userId, LocalDate startDate, LocalDate endDate);

    List<AttendanceRecord> findByAttendanceDate(LocalDate attendanceDate); // For admin view of daily attendance
    // Add more queries as needed (e.g., by status, by date range for admin reports)
}