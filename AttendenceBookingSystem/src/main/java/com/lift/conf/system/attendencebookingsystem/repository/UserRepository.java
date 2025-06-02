package com.lift.conf.system.attendencebookingsystem.repository;

import com.lift.conf.system.attendencebookingsystem.model.User;
import com.lift.conf.system.attendencebookingsystem.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    List<User> findByRole(UserRole role);

    List<User> findByManagedOfficeIdAndRole(Long officeLocationId, UserRole role);
}