package com.smartoff.parking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // Add this annotation
public class ParkingBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ParkingBackendApplication.class, args);
    }

}
