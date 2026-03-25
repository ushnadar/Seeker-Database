create database project
GO
use project
GO
                             ---Creating Tables---
--user table
create table users (
user_id int primary key identity(1,1),
name varchar(100) not null,
email varchar(100) unique not null,
password varchar(255) not null,
phone varchar(20),
role varchar(20) default 'user',
created_at datetime default getdate()
);

--categories table
create table categories (
category_id int primary key identity(1,1),
category_name varchar(100) unique not null
);


--locations Table
create table locations (
location_id int primary key identity(1,1),
location_name varchar(150) not null
);


--items table
create table items (
item_id int primary key identity(1,1),
user_id int,category_id int,location_id int,
item_name varchar(150) not null,description text,
item_type varchar(10),priority varchar(10),
status varchar(20) default 'pending',
image_url varchar(255),report_date date,
created_at datetime default getdate(),

foreign key (user_id) references users(user_id),
foreign key (category_id) references categories(category_id),
foreign key (location_id) references locations(location_id)
);

--claims table
create table claims (
claim_id int primary key identity(1,1),item_id int,
claimant_id int,proof_description text, proof_image varchar(255),
claim_status varchar(20) default 'pending',claim_date datetime default getdate(),

foreign key (item_id) references items(item_id),
foreign key (claimant_id) references users(user_id)
);


--matcheditem table
create table itemmatches (
match_id int primary key identity(1,1),lost_item_id int,found_item_id int,
match_score decimal(5,2),match_date datetime default getdate(),

foreign key (lost_item_id) references items(item_id),
foreign key (found_item_id) references items(item_id)
);

--notifications table
create table notifications (
notification_id int primary key identity(1,1),
user_id int,message text,
is_read bit default 0,
created_at datetime default getdate(),

foreign key (user_id) references users(user_id)
);

--auditlogs table
create table auditlogs (
log_id int primary key identity(1,1),
admin_id int,action varchar(255),
action_time datetime default getdate(),

foreign key (admin_id) references users(user_id)
);


--duplicatereports table
create table duplicatereports (
duplicate_id int primary key identity(1,1),item1_id int,item2_id int,
detected_date datetime default getdate(),

foreign key (item1_id) references items(item_id),
foreign key (item2_id) references items(item_id)
);

                                     ---Inserting data---
--Users
insert into users (name, email, password, phone, role) values
('Ushna Dar', 'ushna@gmail.com', 'pass123', '03001234567', 'user'),
('Sara Ahmed', 'sara@gmail.com', 'pass456', '03111234567', 'user'),
('Admin User', 'admin@gmail.com', 'admin123', '03221234567', 'admin'),
('Ahmed Ali', 'ahmed@gmail.com', 'pass789', '03331234567', 'user'),
('Fatima Noor', 'fatima@gmail.com', 'pass321', '03441234567', 'user'),
('Hassan Raza', 'hassan@gmail.com', 'pass654', '03011223344', 'user'),
('Ayesha Malik', 'ayesha@gmail.com', 'pass987', '03122334455', 'user'),
('Bilal Shah', 'bilal@gmail.com', 'pass741', '03233445566', 'user'),
('Zain Abbas', 'zain@gmail.com', 'pass852', '03344556677', 'user'),
('Maria Khalid', 'maria@gmail.com', 'pass963', '03455667788', 'user');

--Categories
insert into categories (category_name) values
('electronics'),
('documents'),
('bags'),
('accessories'),
('medical items');


--locations
insert into locations (location_name) values
('library'),
('cafeteria'),
('parking area'),
('lecture hall a'),
('main gate');

--items
insert into items (user_id, category_id, location_id, item_name, description, item_type, priority, status, report_date) values
(1, 1, 1, 'iPhone 12', 'Black iPhone lost in library', 'lost', 'high', 'lost', '2026-03-01'),
(2, 2, 2, 'Student ID Card', 'ID card found near cafeteria', 'found', 'high', 'found', '2026-03-02'),
(3, 3, 3, 'Blue Backpack', 'Bag lost in parking area', 'lost', 'medium', 'lost', '2026-03-03'),
(4, 4, 5, 'Car Keys', 'Set of keys found near main gate', 'found', 'medium', 'found', '2026-03-04'),
(5, 1, 1, 'Samsung Earbuds', 'White earbuds lost in library', 'lost', 'medium', 'lost', '2026-03-05'),
(6, 5, 3, 'Medical Inhaler', 'Asthma inhaler lost in parking area', 'lost', 'high', 'lost', '2026-03-05'),
(7, 3, 1, 'Black Wallet', 'Wallet found in library', 'found', 'high', 'found', '2026-03-06'),
(8, 3, 4, 'Notebook', 'Math notebook lost in lecture hall A', 'lost', 'low', 'lost', '2026-03-06'),
(9, 2, 2, 'Passport Copy', 'Document found in cafeteria', 'found', 'high', 'found', '2026-03-07'),
(10, 4, 3, 'Bike Helmet', 'Helmet lost in parking area', 'lost', 'medium', 'lost', '2026-03-07');


--claims
insert into claims (item_id, claimant_id, proof_description, claim_status) values
(2, 1, 'This ID card belongs to me and has my name on it', 'pending'),
(4, 5, 'These keys are mine, with serial number XYZ', 'pending'),
(7, 6, 'Wallet contains my ID and cash', 'approved'),
(9, 2, 'Document is mine, verified by passport copy', 'pending');


--itemmatches
insert into itemmatches (lost_item_id, found_item_id, match_score) values
(1, 2, 75.50),
(3, 7, 80.00),
(5, 4, 60.00);


--notifications
insert into notifications (user_id, message, is_read) values
(1, 'A possible match has been found for your lost item', 0),
(2, 'Your claim request is under review', 0),
(3, 'Admin approved a claim request', 1),
(5, 'Your found item claim is pending approval', 0),
(6, 'Your lost item has a potential match', 0);

--auditlogs
insert into auditlogs (admin_id, action) values
(3, 'Approved claim request for wallet'),
(3, 'Updated item status to returned'),
(3, 'Deleted duplicate report entry');

--duplicatereports
insert into duplicatereports (item1_id, item2_id) values
(1, 5),
(3, 8);

