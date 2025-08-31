

-- MySQL Database Schema for Dr Consultation Project

CREATE DATABASE dr_consultation;
USE dr_consultation;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    age INT,
    is_parent BOOLEAN DEFAULT FALSE,
    medical_history TEXT,
    role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE children (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    name VARCHAR(100),
    age INT,
    FOREIGN KEY (parent_id) REFERENCES users(id)
);

CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    specialty VARCHAR(100),
    location VARCHAR(255)
);

CREATE TABLE medical_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    child_id INT,
    symptoms TEXT,
    diagnosis TEXT,
    prescription TEXT,
    record_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (child_id) REFERENCES children(id)
);

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    child_id INT,
    doctor_id INT,
    appointment_date DATETIME,
    status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (child_id) REFERENCES children(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- AI Symptom Checker consultation payments (R100 per AI consult)
CREATE TABLE ai_consultation_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    symptoms TEXT,
    amount DECIMAL(10,2) NOT NULL DEFAULT 100.00, -- R100 per AI consult
    status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    transaction_ref VARCHAR(100),
    paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Payment transactions for doctor appointments (R500 per booking)
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    appointment_id INT,
    amount DECIMAL(10,2) NOT NULL DEFAULT 500.00, -- R500 per doctor booking
    status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    transaction_ref VARCHAR(100),
    paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

INSERT INTO doctors (name, specialty, location) VALUES
('Dr. Alice Smith', 'Pediatrics', 'Johannesburg'),
('Dr. John Doe', 'General Medicine', 'Cape Town'),
('Dr. Maria Garcia', 'Dermatology', 'Durban'),
('Dr. David Lee', 'Cardiology', 'Pretoria'),
('Dr. Thabo Mokoena', 'Orthopedics', 'Soweto'),
('Dr. Zanele Khumalo', 'Family Medicine', 'Port Elizabeth'),
('Dr. Sipho Ndlovu', 'ENT', 'Bloemfontein'),
('Dr. Lerato Dlamini', 'Pediatrics', 'East London'),
('Dr. Nomsa Mthembu', 'Gynecology', 'Polokwane'),
('Dr. Pieter van der Merwe', 'Urology', 'Nelspruit'),
('Dr. Fatima Patel', 'Neurology', 'Kimberley'),
('Dr. Themba Nkosi', 'Psychiatry', 'Welkom'),
('Dr. Johan Botha', 'Oncology', 'George'),
('Dr. Sibusiso Zulu', 'Ophthalmology', 'Richards Bay'),
('Dr. Precious Mokoena', 'Dentistry', 'Mthatha'),
('Dr. Bongani Dube', 'Pulmonology', 'Vereeniging'),
('Dr. Anathi Gcabashe', 'Rheumatology', 'Pietermaritzburg'),
('Dr. Elna Kruger', 'Endocrinology', 'Polokwane'),
('Dr. Musa Mhlongo', 'Gastroenterology', 'Rustenburg'),
('Dr. Lindiwe Sibanda', 'Nephrology', 'Benoni');
