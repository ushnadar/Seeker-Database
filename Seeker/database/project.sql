-- Create Database
CREATE DATABASE IF NOT EXISTS project;
GO
USE project;
GO

--------------------------------------
-- Users Table
--------------------------------------
CREATE TABLE users (
    user_id     INT PRIMARY KEY IDENTITY(1,1),
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(100)  UNIQUE NOT NULL,
    password    VARCHAR(255)  NOT NULL,
    phone       VARCHAR(20),
    role        VARCHAR(20)   NOT NULL DEFAULT 'user'
                              CHECK (role IN ('user', 'admin')),
    created_at  DATETIME      DEFAULT GETDATE(),

    -- password stored as bcrypt hash (always 60 chars), raw must be >= 6
    CONSTRAINT chk_email_format
        CHECK (email LIKE '%_@__%.__%'),

    CONSTRAINT chk_name_not_empty
        CHECK (LEN(LTRIM(RTRIM(name))) > 0)
);

--------------------------------------
-- Categories Table
--------------------------------------
CREATE TABLE categories (
    category_id   INT PRIMARY KEY IDENTITY(1,1),
    category_name VARCHAR(100) UNIQUE NOT NULL
);

--------------------------------------
-- Locations Table
--------------------------------------
CREATE TABLE locations (
    location_id   INT PRIMARY KEY IDENTITY(1,1),
    location_name VARCHAR(150) NOT NULL
);

--------------------------------------
-- Items Table
--------------------------------------
CREATE TABLE items (
    item_id     INT PRIMARY KEY IDENTITY(1,1),
    user_id     INT,
    category_id INT,
    location_id INT,
    item_name   VARCHAR(150) NOT NULL,
    description TEXT,
    item_type   VARCHAR(10)  CHECK (item_type IN ('lost', 'found')),
    priority    VARCHAR(10)  CHECK (priority  IN ('low', 'medium', 'high')),
    status      VARCHAR(20)  DEFAULT 'pending'
                             CHECK (status IN ('pending', 'approved', 'rejected', 'resolved')),
    image_url   VARCHAR(255),
    report_date DATE,
    created_at  DATETIME     DEFAULT GETDATE(),

    FOREIGN KEY (user_id)     REFERENCES users(user_id)      ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

--------------------------------------
-- Claims Table
--------------------------------------
CREATE TABLE claims (
    claim_id          INT PRIMARY KEY IDENTITY(1,1),
    item_id           INT,
    claimant_id       INT,
    proof_description TEXT,
    proof_image       VARCHAR(255),
    claim_status      VARCHAR(20) DEFAULT 'pending'
                                  CHECK (claim_status IN ('pending', 'approved', 'rejected')),
    claim_date        DATETIME    DEFAULT GETDATE(),

    FOREIGN KEY (item_id)     REFERENCES items(item_id)  ON DELETE CASCADE,
    FOREIGN KEY (claimant_id) REFERENCES users(user_id)  ON DELETE NO ACTION
);

--------------------------------------
-- ItemMatches Table
--------------------------------------
CREATE TABLE itemmatches (
    match_id      INT PRIMARY KEY IDENTITY(1,1),
    lost_item_id  INT,
    found_item_id INT,
    match_score   DECIMAL(5,2) CHECK (match_score BETWEEN 0 AND 100),
    match_date    DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (lost_item_id)  REFERENCES items(item_id),
    FOREIGN KEY (found_item_id) REFERENCES items(item_id)
);

--------------------------------------
-- Notifications Table
--------------------------------------
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY IDENTITY(1,1),
    user_id         INT,
    message         TEXT         NOT NULL,
    is_read         BIT          DEFAULT 0,
    created_at      DATETIME     DEFAULT GETDATE(),

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

--------------------------------------
-- AuditLogs Table
--------------------------------------
CREATE TABLE auditlogs (
    log_id      INT PRIMARY KEY IDENTITY(1,1),
    admin_id    INT,
    action      VARCHAR(255) NOT NULL,
    action_time DATETIME     DEFAULT GETDATE(),

    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE SET NULL
);

--------------------------------------
-- DuplicateReports Table
--------------------------------------
CREATE TABLE duplicatereports (
    duplicate_id  INT PRIMARY KEY IDENTITY(1,1),
    item1_id      INT,
    item2_id      INT,
    detected_date DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (item1_id) REFERENCES items(item_id),
    FOREIGN KEY (item2_id) REFERENCES items(item_id),

    CONSTRAINT chk_no_self_duplicate CHECK (item1_id <> item2_id)
);
GO

--------------------------------------
-- Stored Procedure: Signup
-- Validates: duplicate email per role,
--            required fields, role value
--------------------------------------
CREATE PROCEDURE sp_signup
    @name     VARCHAR(100),
    @email    VARCHAR(100),
    @password VARCHAR(255),
    @phone    VARCHAR(20) = NULL,
    @role     VARCHAR(20) = 'user'
AS
BEGIN
    SET NOCOUNT ON;

    -- Validate role
    IF @role NOT IN ('user', 'admin')
    BEGIN
        RAISERROR('Invalid role. Must be user or admin.', 16, 1);
        RETURN;
    END

    -- Required fields
    IF LEN(LTRIM(RTRIM(@name))) = 0 OR LEN(LTRIM(RTRIM(@email))) = 0 OR LEN(LTRIM(RTRIM(@password))) = 0
    BEGIN
        RAISERROR('Name, email and password are required.', 16, 1);
        RETURN;
    END

    -- Email format basic check
    IF @email NOT LIKE '%_@__%.__%'
    BEGIN
        RAISERROR('Invalid email format.', 16, 1);
        RETURN;
    END

    -- Duplicate email check per role
    -- Same email CAN exist for different roles (user vs admin)
    IF EXISTS (SELECT 1 FROM users WHERE email = @email AND role = @role)
    BEGIN
        RAISERROR('Email already registered for this role.', 16, 1);
        RETURN;
    END

    -- Password length check (raw password before hashing must be >= 6)
    IF LEN(@password) < 6
    BEGIN
        RAISERROR('Password must be at least 6 characters.', 16, 1);
        RETURN;
    END

    -- Insert user
    INSERT INTO users (name, email, password, phone, role)
    VALUES (
        LTRIM(RTRIM(@name)),
        LOWER(LTRIM(RTRIM(@email))),
        @password,   -- bcrypt hash passed from backend
        @phone,
        @role
    );

    SELECT SCOPE_IDENTITY() AS new_user_id;
END
GO

--------------------------------------
-- Stored Procedure: Login
-- Validates: email + role match exists
-- Password comparison done in backend (bcrypt)
--------------------------------------
CREATE PROCEDURE sp_login
    @email VARCHAR(100),
    @role  VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    -- Required fields
    IF LEN(LTRIM(RTRIM(@email))) = 0 OR LEN(LTRIM(RTRIM(@role))) = 0
    BEGIN
        RAISERROR('Email and role are required.', 16, 1);
        RETURN;
    END

    -- Validate role value
    IF @role NOT IN ('user', 'admin')
    BEGIN
        RAISERROR('Invalid role.', 16, 1);
        RETURN;
    END

    -- Return user record matching email AND role
    -- If no row returned → no account for this role
    SELECT user_id, name, email, password, role
    FROM users
    WHERE email = LOWER(LTRIM(RTRIM(@email)))
      AND role  = @role;
END
GO