package com.smartoff.parking.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.smartoff.parking.model.ParkingRow;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingRowRepository extends JpaRepository<ParkingRow, Long> {
    
    // Find rows by parking lot ID
    List<ParkingRow> findByParkingLotId(Long parkingLotId);
    
    // Find row by row number and parking lot
    Optional<ParkingRow> findByRowNumberAndParkingLotId(String rowNumber, Long parkingLotId);
    
    // Count total rows in a parking lot
    long countByParkingLotId(Long parkingLotId);
    
    // Find rows with available slots
    @Query("SELECT pr FROM ParkingRow pr WHERE pr.parkingLotId = :parkingLotId AND pr.availableSlots > 0")
    List<ParkingRow> findRowsWithAvailableSlots(@Param("parkingLotId") Long parkingLotId);


}