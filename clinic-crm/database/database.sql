-- Clinic CRM Database Schema
-- Run: mysql -u root -p < database.sql

CREATE DATABASE IF NOT EXISTS clinic_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clinic_crm;

-- Users (system login accounts)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'receptionist') NOT NULL DEFAULT 'receptionist',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Patients
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_patient_name (last_name, first_name)
) ENGINE=InnoDB;

-- Doctors
CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    specialty VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_doctor_specialty (specialty)
) ENGINE=InnoDB;

-- Appointments
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_appointment_patient (patient_id),
    INDEX idx_appointment_doctor (doctor_id)
) ENGINE=InnoDB;

-- Prescriptions
CREATE TABLE prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    medication VARCHAR(200) NOT NULL,
    dosage VARCHAR(100),
    instructions TEXT,
    prescribed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    INDEX idx_prescription_patient (patient_id),
    INDEX idx_prescription_doctor (doctor_id)
) ENGINE=InnoDB;

-- Billing
CREATE TABLE billing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    appointment_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('paid', 'pending', 'overdue') NOT NULL DEFAULT 'pending',
    description TEXT,
    billing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_billing_patient (patient_id),
    INDEX idx_billing_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Default admin account (password: admin123)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@clinic.com', '$2b$10$rOz9k8x7vY2mN4pQ1wE3uO5lM6nB7cA9dF2gH4jK6lM8nP0qR2sT', 'admin'),
('dr.smith', 'smith@clinic.com', '$2b$10$rOz9k8x7vY2mN4pQ1wE3uO5lM6nB7cA9dF2gH4jK6lM8nP0qR2sT', 'doctor'),
('reception', 'reception@clinic.com', '$2b$10$rOz9k8x7vY2mN4pQ1wE3uO5lM6nB7cA9dF2gH4jK6lM8nP0qR2sT', 'receptionist');

-- Sample patients
INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, gender, address) VALUES
('John', 'Doe', 'john.doe@email.com', '555-1001', '1985-03-15', 'male', '123 Maple Street, Springfield'),
('Jane', 'Smith', 'jane.smith@email.com', '555-1002', '1990-07-22', 'female', '456 Oak Avenue, Springfield'),
('Robert', 'Johnson', 'robert.j@email.com', '555-1003', '1978-11-05', 'male', '789 Pine Road, Springfield'),
('Emily', 'Davis', 'emily.davis@email.com', '555-1004', '2002-01-30', 'female', '321 Cedar Lane, Springfield'),
('Michael', 'Brown', 'michael.brown@email.com', '555-1005', '1965-09-12', 'male', '654 Birch Drive, Springfield');

-- Sample doctors
INSERT INTO doctors (first_name, last_name, email, phone, specialty, license_number) VALUES
('Sarah', 'Wilson', 'sarah.wilson@clinic.com', '555-2001', 'Cardiology', 'LIC-1001'),
('James', 'Miller', 'james.miller@clinic.com', '555-2002', 'Pediatrics', 'LIC-1002'),
('Linda', 'Garcia', 'linda.garcia@clinic.com', '555-2003', 'Dermatology', 'LIC-1003'),
('David', 'Martinez', 'david.martinez@clinic.com', '555-2004', 'Orthopedics', 'LIC-1004');

-- Sample appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, reason) VALUES
(1, 1, '2026-11-05', '09:00:00', 'scheduled', 'Regular heart checkup'),
(2, 2, '2026-11-05', '10:30:00', 'scheduled', 'Child vaccination'),
(3, 3, '2026-11-06', '11:00:00', 'completed', 'Skin rash consultation'),
(4, 4, '2026-11-06', '14:00:00', 'scheduled', 'Knee pain follow-up'),
(5, 1, '2026-11-07', '09:30:00', 'cancelled', 'Blood pressure review');

-- Sample prescriptions
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, medication, dosage, instructions) VALUES
(3, 3, 3, 'Hydrocortisone Cream 1%', 'Apply twice daily', 'Apply to affected area after washing. Avoid eyes.'),
(3, 3, 3, 'Cetirizine 10mg', 'One tablet daily', 'Take in the evening. May cause drowsiness.');

-- Sample billing
INSERT INTO billing (patient_id, appointment_id, amount, status, description) VALUES
(1, 1, 150.00, 'pending', 'Cardiology consultation'),
(2, 2, 120.00, 'paid', 'Pediatrics visit and vaccination'),
(3, 3, 100.00, 'paid', 'Dermatology consultation'),
(4, 4, 180.00, 'pending', 'Orthopedics follow-up');
