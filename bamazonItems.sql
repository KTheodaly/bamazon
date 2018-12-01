CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE `Products` (
	`ItemId` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`ItemName` VARCHAR(255) NULL,
	`DepartmentName` VARCHAR(255) NULL,
	`Price` DECIMAL(10,2) NULL,
	`StockQuantity` INT NULL
);

INSERT INTO Products (ItemName, DepartmentName, Price, StockQuantity) 
VALUES 
('Hat', 'Apparel', 9.00, 10),
('Fanny Pack', 'Apparel', 13.00, 10),
('Sweatshirt', 'Apparel', 17.00, 20),
('Mascara', 'Cosmetics',8.50, 25),
('Eye Shadow Pallette', 'Cosmetics', 45.00, 10),
('Foundation', 'Cosmetics', 16.00, 8),
('Sparkles', 'Cosmetics', 4.50, 12),
('Snack', 'Pantry', 1.50, 20),
('Bike', 'Sporting Goods', 97.00, 7),
('Roller Blades', 'Sporting Goods', 35.00, 5);