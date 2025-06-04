package com.smartoff.parking.controller;

import com.smartoff.parking.model.ParkingRow;
import com.smartoff.parking.model.ParkingSlot;
import com.smartoff.parking.model.SlotStatus;
import com.smartoff.parking.service.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    public ResponseEntity<?> reserveSlot(
            @PathVariable Long slotId,
            @RequestParam(name = "userName", required = false) String userName,
            @RequestParam(name = "userId", required = false) String userId) {
        String user = userName != null ? userName : userId;
        if (user == null || user.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User name is required"));
        }
        try {
            ParkingSlot slot = parkingService.reserveSlot(slotId, user.trim());
            return ResponseEntity.ok(slot);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PutMapping("/slots/{slotId}/status")
    public ResponseEntity<Object> statusSlot(@PathVariable Long slotId) {
        return parkingService.statusCheckSlot(slotId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @GetMapping("/rows")
    public ResponseEntity<List<ParkingRow>> getAllRows() {
        List<ParkingRow> allRows = parkingService.getAllRows();
        allRows.forEach(row -> System.out.println("row:" + row));
        return ResponseEntity.ok(allRows);
    }

    @GetMapping("/stats/available-count")
    public ResponseEntity<Long> getAvailableSlotCount() {
        return ResponseEntity.ok(parkingService.getAvailableSlotCount());
    }

    @PostMapping("/slots/{slotId}/occupy-reserved")
    public ResponseEntity<?> occupyReservedSlot(@PathVariable Long slotId,
                                                @RequestParam String userName, @RequestParam String licensePlate) {
        try {
            if (licensePlate == null || licensePlate.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "License plate is required"));
            }

            ParkingSlot slot = parkingService.occupyReservedSlot(slotId, licensePlate.trim(), userName);
            return ResponseEntity.ok(slot);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/slots/{slotId}/release-expired")
    public ResponseEntity<?> releaseExpiredReservation(@PathVariable Long slotId) {
        try {
            ParkingSlot slot = parkingService.releaseExpiredReservation(slotId);
            return ResponseEntity.ok(slot);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/slots/{slotId}/occupy-direct")
    public ResponseEntity<?> occupySlotDirectly(@PathVariable Long slotId, @RequestBody Map<String, String> request) {
        try {
            String licensePlate = request.get("licensePlate");
            String userName = request.get("userName");

            if (licensePlate == null || licensePlate.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "License plate is required"));
            }

            ParkingSlot slot = parkingService.occupySlotDirectly(slotId, licensePlate.trim(), userName);
            return ResponseEntity.ok(slot);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/slots/{slotId}/release")
    public ResponseEntity<?> releaseSlot(@PathVariable Long slotId, @RequestBody Map<String, String> request) {
        try {
            String userName = request.get("userName");
            ParkingSlot slot = parkingService.releaseSlot(slotId, userName);
            return ResponseEntity.ok(slot);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/slots/user/{userName}")
    public ResponseEntity<List<ParkingSlot>> getUserSlots(@PathVariable String userName) {
        List<ParkingSlot> userSlots = parkingService.getUserSlots(userName);
        return ResponseEntity.ok(userSlots);
    }

    @GetMapping("/slots/user/{userName}/status/{status}")
    public ResponseEntity<List<ParkingSlot>> getUserSlotsByStatus(
            @PathVariable String userName,
            @PathVariable String status) {
        try {
            SlotStatus slotStatus = SlotStatus.valueOf(status.toUpperCase());
            List<ParkingSlot> userSlots = parkingService.getUserSlotsByStatus(userName, slotStatus);
            return ResponseEntity.ok(userSlots);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/rows")
    public ResponseEntity<ParkingRow> addParkingRow(@RequestBody ParkingRow parkingRow) {
        ParkingRow savedRow = parkingService.addParkingRow(parkingRow);
        return ResponseEntity.ok(savedRow);
    }
}