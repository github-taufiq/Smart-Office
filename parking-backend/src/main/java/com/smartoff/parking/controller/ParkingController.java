package com.smartoff.parking.controller;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.smartoff.parking.model.ParkingSlot;
import com.smartoff.parking.model.ParkingRow;
import com.smartoff.parking.service.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/parking")
@CrossOrigin(origins = "*")
public class ParkingController {
    
    @Autowired
    private ParkingService parkingService;
    
    @GetMapping("/slots/available")
    public ResponseEntity<List<ParkingSlot>> getAvailableSlots() {
        return ResponseEntity.ok(parkingService.getAvailableSlots());
    }
    
    @PostMapping("/slots/{slotId}/reserve")
    public ResponseEntity<ParkingSlot> reserveSlot(@PathVariable Long slotId, 
                                                  @RequestParam String userId) {
        return parkingService.reserveSlot(slotId, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }
    
    @GetMapping("/rows")
    @JsonManagedReference
    @JsonBackReference
    public ResponseEntity<List<ParkingRow>> getAllRows() {
        List<ParkingRow> allRows = parkingService.getAllRows();
        allRows.forEach(row -> System.out.println("row:"+row));
        return ResponseEntity.ok(allRows);
    }
    
    @GetMapping("/stats/available-count")
    public ResponseEntity<Long> getAvailableSlotCount() {
        return ResponseEntity.ok(parkingService.getAvailableSlotCount());
    }
}