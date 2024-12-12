CREATE DATABASE task_manager;
USE task_manager;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,              
    user_id INT NOT NULL,                           
    title VARCHAR(255) NOT NULL,                   
    description TEXT,                               
    status ENUM('pending', 'completed') DEFAULT 'pending', 
    keyword VARCHAR(100),                          
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--trigger