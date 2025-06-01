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
    
    public Optional<ParkingSlot> reserveSlot(Long slotId, String userId) {
        Optional<ParkingSlot> slotOpt = slotRepository.findById(slotId);
        if (slotOpt.isPresent() ) {
            ParkingSlot slot = slotOpt.get();
            slot.setStatus(SlotStatus.RESERVED);
//            slot.setUpdatedByUser(userId);
            return Optional.of(slotRepository.save(slot));
        }
        return Optional.empty();
    }

    public Optional<ParkingSlot> occupySlot(Long slotId, String userId) {
        Optional<ParkingSlot> slotOpt = slotRepository.findById(slotId);
        if (slotOpt.isPresent() ) {
            ParkingSlot slot = slotOpt.get();
            slot.setStatus(SlotStatus.OCCUPIED);
//            slot.setUpdatedByUser(userId);
            slot.setOccupiedSince(LocalDateTime.now());
            return Optional.of(slotRepository.save(slot));
        }
        return Optional.empty();
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
}