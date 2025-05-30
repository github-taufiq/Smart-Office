-- Create parking_rows table
CREATE TABLE IF NOT EXISTS parking_rows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    row_number VARCHAR(50) NOT NULL,
    parking_lot_id BIGINT NOT NULL,
    total_slots INTEGER,
    available_slots INTEGER
);

-- Create parking_slots table
CREATE TABLE IF NOT EXISTS parking_slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slot_number VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(20) NOT NULL,
    parking_row_id BIGINT NOT NULL,
    occupied_since TIMESTAMP,
    vehicle_license_plate VARCHAR(20),
    FOREIGN KEY (parking_row_id) REFERENCES parking_rows(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_parking_slots_status ON parking_slots(status);
CREATE INDEX IF NOT EXISTS idx_parking_slots_vehicle_type ON parking_slots(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_parking_rows_lot_id ON parking_rows(parking_lot_id);