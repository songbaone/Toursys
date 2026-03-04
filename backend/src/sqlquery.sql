CREATE TABLE ROLES
(
    role_id CHAR(10) PRIMARY KEY,
    -- AD, PI, DP...
    role_name NVARCHAR(50) NOT NULL,
    description NVARCHAR(255),
    status NVARCHAR(20),
    created_at DATETIME2 DEFAULT SYSDATETIME()
);

CREATE TABLE USERS
(
    user_id INT IDENTITY PRIMARY KEY,
    role_id CHAR(10),
    -- AD, PI
    full_name NVARCHAR(60) NOT NULL,
    birthday DATE,
    gender BIT,
    -- 1: Nam, 0: Nữ
    phone VARCHAR(15),
    email NVARCHAR(50),
    address NVARCHAR(255),
    status NVARCHAR(20),
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2,
    CONSTRAINT FK_USERS_ROLES
        FOREIGN KEY (role_id) REFERENCES ROLES(role_id)
);

GO
CREATE TRIGGER trg_users_update_updated_at
ON USERS
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE USERS
    SET updated_at = SYSDATETIME()
    FROM USERS u
        INNER JOIN inserted i ON u.user_id = i.user_id;
END;
GO

CREATE TABLE PORTS
(
    port_id INT IDENTITY PRIMARY KEY,
    port_code NVARCHAR(20) NOT NULL,
    port_name NVARCHAR(50) NOT NULL,
    address NVARCHAR(100),
    status NVARCHAR(20),
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2
);

GO
CREATE TRIGGER trg_ports_update_updated_at
ON PORTS
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE PORTS
    SET updated_at = SYSDATETIME()
    FROM PORTS p
        INNER JOIN inserted i ON p.port_id = i.port_id;
END;    


GO
CREATE TABLE SHIPS
(
    ship_id INT IDENTITY(1,1) PRIMARY KEY,
    -- Mã tàu (tự tăng)

    ship_code VARCHAR(20) NOT NULL UNIQUE,
    -- Mã tàu (ví dụ: TS001)
    ship_name NVARCHAR(100) NOT NULL,
    -- Tên tàu
    nationality NVARCHAR(100),
    -- Quốc tịch

    length DECIMAL(10,2),
    -- Chiều dài (mét)
    draft DECIMAL(10,2),
    -- Mớn nước (mét)
    gross_tonnage DECIMAL(12,2),
    -- GT (Gross Tonnage) thể tích không gian tàu

    agency NVARCHAR(150),
    -- Đại lý
    current_port_id INT,
    -- Vị trí hiện tại

    status NVARCHAR(20),


    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2,

    CONSTRAINT FK_SHIPS_PORTS FOREIGN KEY (current_port_id) REFERENCES PORTS (port_id)

);

GO
CREATE TRIGGER trg_ships_update_updated_at
ON SHIPS
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE s
    SET updated_at = SYSDATETIME()
    FROM SHIPS s
        INNER JOIN inserted i ON s.ship_id = i.ship_id;
END;
GO