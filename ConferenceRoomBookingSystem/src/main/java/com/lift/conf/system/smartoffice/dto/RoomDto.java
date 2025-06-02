package com.lift.conf.system.smartoffice.dto;

import lombok.Data;

@Data // Lombok annotation for getters, setters, toString, equals, hashCode
public class RoomDto {
    private Long id;
    private String name;
    private int capacity;
    private String floorInfo; // Could combine office location + room floor
    private boolean hasAVEquipment;
    private String description;
    private Long officeLocationId;
    private String officeLocationName;
}