package com.lift.conf.system.smartoffice.repository;

import com.lift.conf.system.smartoffice.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByOfficeLocationId(Long officeLocationId);
}