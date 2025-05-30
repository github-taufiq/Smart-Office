package com.smartoff.parking.data;

import com.smartoff.parking.model.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.smartoff.parking.model.ParkingSlot;
import com.smartoff.parking.model.SlotStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
    
    // Find slots by parking row
    List<ParkingSlot> findByParkingRowId(Long parkingRowId);
    
    // Find available slots by vehicle type
    List<ParkingSlot> findByStatusAndVehicleType(SlotStatus status, VehicleType vehicleType);
    
    // Find slot by slot number and row
    Optional<ParkingSlot> findBySlotNumberAndParkingRowId(String slotNumber, Long parkingRowId);
    
    // Find available slots in a specific row
    List<ParkingSlot> findByParkingRowIdAndStatus(Long parkingRowId, SlotStatus status);
    
    // Count available slots by vehicle type
    long countByStatusAndVehicleType(SlotStatus status, VehicleType vehicleType);
    
    // Find slots by status
    List<ParkingSlot> findByStatus(SlotStatus status);
    
    // Custom query to find available slots in a parking lot
    @Query("SELECT ps FROM ParkingSlot ps JOIN ps.parkingRow pr WHERE pr.parkingLotId = :parkingLotId AND ps.status = :status")
    List<ParkingSlot> findAvailableSlotsInParkingLot(@Param("parkingLotId") Long parkingLotId, @Param("status") SlotStatus status);
    
    // Find nearest available slot
    @Query("SELECT ps FROM ParkingSlot ps WHERE ps.status = :status AND ps.vehicleType = :vehicleType ORDER BY ps.id ASC")
    Optional<ParkingSlot> findFirstAvailableSlot(@Param("status") SlotStatus status, @Param("vehicleType") VehicleType vehicleType);
}