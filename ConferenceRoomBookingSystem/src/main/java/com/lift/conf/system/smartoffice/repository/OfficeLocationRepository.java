package com.lift.conf.system.smartoffice.repository;

import com.lift.conf.system.smartoffice.model.OfficeLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfficeLocationRepository extends JpaRepository<OfficeLocation, Long> {
    Optional<OfficeLocation> findByName(String name);
    List<OfficeLocation> findByCity(String city);
}