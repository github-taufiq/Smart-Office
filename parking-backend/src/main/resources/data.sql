-- Insert sample parking rows
INSERT INTO parking_rows (row_number, parking_lot_id, total_slots, available_slots) VALUES
('A', 1, 10, 8),
('B', 1, 10, 5),
('C', 1, 8, 8);

-- Insert sample parking slots
INSERT INTO parking_slots (slot_number, status, vehicle_type, parking_row_id) VALUES
('A1', 'OCCUPIED', 'CAR', 1),
('A2', 'OCCUPIED', 'CAR', 1),
('A3', 'AVAILABLE', 'CAR', 1),
('A4', 'AVAILABLE', 'CAR', 1),
('A5', 'AVAILABLE', 'CAR', 1),
('B1', 'OCCUPIED', 'MOTORCYCLE', 2),
('B2', 'AVAILABLE', 'MOTORCYCLE', 2),
('C1', 'AVAILABLE', 'TRUCK', 3);