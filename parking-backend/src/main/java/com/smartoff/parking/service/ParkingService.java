package com.smartoff.parking.service;

import com.smartoff.parking.model.ParkingSlot;
import com.smartoff.parking.model.ParkingRow;
import com.smartoff.parking.model.SlotStatus;
import com.smartoff.parking.data.ParkingSlotRepository;
import com.smartoff.parking.data.ParkingRowRepository;
import com.smartoff.parking.model.VehicleType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ParkingService {
    
    @Autowired
    private ParkingSlotRepository slotRepository;
    
    @Autowired
    private ParkingRowRepository rowRepository;
    
    public List<ParkingSlot> getAvailableSlots() {
        return slotRepository.findByStatus(SlotStatus.AVAILABLE);
    }
    
    public ParkingSlot reserveSlot(Long slotId, String userName) {
        ParkingSlot slot = slotRepository.findById(slotId)
            .orElseThrow(() -> new IllegalArgumentException("Slot not found"));
        
        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new IllegalStateException("Slot is not available for reservation");
        }
        
        slot.setStatus(SlotStatus.RESERVED);
        slot.setReservedByUser(userName);
        // Set reservation to expire in 30 minutes
        slot.setReservationExpiresAt(LocalDateTime.now().plusMinutes(30));
        
        return slotRepository.save(slot);
    }

    public ParkingSlot occupyReservedSlot(Long slotId, String licensePlate, String userName) {
        ParkingSlot slot = slotRepository.findById(slotId)
            .orElseThrow(() -> new IllegalArgumentException("Slot not found"));
        
        if (slot.getStatus() != SlotStatus.RESERVED) {
            throw new IllegalStateException("Slot is not reserved");
        }
        
        // Check if reservation has expired
        if (slot.getReservationExpiresAt() != null && 
            LocalDateTime.now().isAfter(slot.getReservationExpiresAt())) {
            throw new IllegalStateException("Reservation has expired");
        }
        
        // Verify the user is the one who made the reservation (optional security check)
        if (userName != null && slot.getReservedByUser() != null && 
            !slot.getReservedByUser().equals(userName)) {
            throw new IllegalStateException("Only the user who made the reservation can occupy this slot");
        }
        
        slot.setStatus(SlotStatus.OCCUPIED);
        slot.setVehicleLicensePlate(licensePlate);
        slot.setReservationExpiresAt(null); // Clear expiration
        // Keep reservedByUser to track who is occupying the slot
        
        return slotRepository.save(slot);
    }

    public ParkingSlot occupySlotDirectly(Long slotId, String licensePlate, String userName) {
        ParkingSlot slot = slotRepository.findById(slotId)
            .orElseThrow(() -> new IllegalArgumentException("Slot not found"));
        
        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new IllegalStateException("Slot is not available");
        }
        
        slot.setStatus(SlotStatus.OCCUPIED);
        slot.setVehicleLicensePlate(licensePlate);
        slot.setReservedByUser(userName); // Track who occupied the slot
        slot.setReservationExpiresAt(null);
        
        return slotRepository.save(slot);
    }

    public ParkingSlot releaseSlot(Long slotId, String userName) {
        ParkingSlot slot = slotRepository.findById(slotId)
            .orElseThrow(() -> new IllegalArgumentException("Slot not found"));
        
        if (slot.getStatus() != SlotStatus.OCCUPIED) {
            throw new IllegalStateException("Slot is not occupied");
        }
        
        // Optional: Verify the user is the one who occupied the slot
        if (userName != null && slot.getReservedByUser() != null && 
            !slot.getReservedByUser().equals(userName)) {
            throw new IllegalStateException("Only the user who occupied the slot can release it");
        }
        
        slot.setStatus(SlotStatus.AVAILABLE);
        slot.setVehicleLicensePlate(null);
        slot.setReservedByUser(null);
        slot.setReservationExpiresAt(null);
        
        return slotRepository.save(slot);
    }

    public ParkingSlot releaseExpiredReservation(Long slotId) {
        ParkingSlot slot = slotRepository.findById(slotId)
            .orElseThrow(() -> new IllegalArgumentException("Slot not found"));
        
        if (slot.getStatus() != SlotStatus.RESERVED) {
            throw new IllegalStateException("Slot is not reserved");
        }
        
        if (slot.getReservationExpiresAt() == null || 
            LocalDateTime.now().isBefore(slot.getReservationExpiresAt())) {
            throw new IllegalStateException("Reservation has not expired yet");
        }
        
        slot.setStatus(SlotStatus.AVAILABLE);
        slot.setReservedByUser(null);
        slot.setReservationExpiresAt(null);
        
        return slotRepository.save(slot);
    }

    public List<ParkingSlot> findExpiredReservations() {
        return slotRepository.findByStatusAndReservationExpiresAtBefore(
            SlotStatus.RESERVED, LocalDateTime.now());
    }
    
    public List<ParkingRow> getAllRows() {
        return rowRepository.findAll();
    }
    
    public long getAvailableSlotCount() {
        return slotRepository.countByStatusAndVehicleType(SlotStatus.AVAILABLE, VehicleType.CAR);
    }

    public Optional<Object> statusCheckSlot(Long slotId) {
        ParkingSlot slot = slotRepository.getReferenceById(slotId);
        SlotStatus slotStatus = slot.getStatus();
        return Optional.of(slotStatus);
    }

    // Add method to get user's current reservations/occupations
    public List<ParkingSlot> getUserSlots(String userName) {
        return slotRepository.findByReservedByUser(userName);
    }

    public List<ParkingSlot> getUserSlotsByStatus(String userName, SlotStatus status) {
        return slotRepository.findByReservedByUserAndStatus(userName, status);
    }

    public ParkingRow addParkingRow(ParkingRow parkingRow) {
        // Optionally, validate parkingRow fields here
        return rowRepository.save(parkingRow);
    }
}