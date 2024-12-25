CREATE DATABASE QUANLYTRANGSUC CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE QUANLYTRANGSUC;

CREATE TABLE TAIKHOAN (
   ID                   INT AUTO_INCREMENT PRIMARY KEY,
   EMAIL                VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
   PASSWORD             VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
   ROLE                 TINYINT NOT NULL, -- 0: Khách hàng, 1: Admin, 2: Superadmin, 3: .....
   TINHTRANG            TINYINT NOT NULL DEFAULT 1,
   DELETED_AT           DATETIME NULL  -- Không xóa hoàn toàn, chỉ ẩn đi
);

CREATE TABLE ADMIN (
   ID                   INT PRIMARY KEY, -- Liên kết với ID từ bảng TAIKHOAN
   TENADMIN             VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
   SDT                  VARCHAR(15) NULL,
   DIACHI               VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
   IMAGEURL             LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL
);

CREATE TABLE KHACHHANG (
   ID                   INT PRIMARY KEY, -- Liên kết với ID từ bảng TAIKHOAN
   TENKH                VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
   SDT                  VARCHAR(15) NULL,
   DIACHI               VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
   LOAI                 TINYINT NULL,
   GIOITINH             TINYINT NULL, -- 1: Nam, 2: Nữ
   IMAGEURL             LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL
);

CREATE TABLE TRANGSUC (
   ID                   INT AUTO_INCREMENT PRIMARY KEY,
   MADM                 VARCHAR(10) NOT NULL,
   TENTS                VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
   GIANIEMYET           BIGINT NOT NULL,
   SLTK                 INT NOT NULL DEFAULT 0,
   MOTA                 TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
   IMAGEURL             LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
   DELETED_AT           DATETIME NULL  -- Không xóa hoàn toàn, chỉ ẩn đi
);

CREATE TABLE DANHMUCTS (
   MADM                 VARCHAR(10) NOT NULL PRIMARY KEY,
   TENDM                VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
);

CREATE TABLE HOADON (
   ID_HOADON            INT AUTO_INCREMENT PRIMARY KEY,
   ID_KHACHHANG         INT NOT NULL,
   NGAYLAPHD            DATE NOT NULL,
   TRIGIAHD             BIGINT NOT NULL,
   TIENPHAITRA          BIGINT NOT NULL,
   TRANGTHAI            TINYINT NOT NULL, -- 0: Chờ xử lý, 1: Đã xử lý, 2: Hủy
   DELETED_AT           DATETIME NULL  -- Không xóa hoàn toàn, chỉ ẩn đi
);

CREATE TABLE GIOHANG (
   ID_GIOHANG           INT AUTO_INCREMENT PRIMARY KEY,
   ID_KHACHHANG         INT NOT NULL
);

CREATE TABLE CHITIETGH (
   ID_TRANGSUC          INT NOT NULL,
   ID_GIOHANG           INT NOT NULL,
   SOLUONG              INT NOT NULL DEFAULT 1,
   PRIMARY KEY (ID_TRANGSUC, ID_GIOHANG)
);

CREATE TABLE CHITIETHD (
   ID_TRANGSUC          INT NOT NULL,
   ID_HOADON            INT NOT NULL,
   SOLUONG              INT NOT NULL DEFAULT 1,
   GIASP                BIGINT NOT NULL,
   PRIMARY KEY (ID_TRANGSUC, ID_HOADON)
);

CREATE TABLE KHUYENMAI (
   ID                   INT AUTO_INCREMENT PRIMARY KEY,
   MAKM                 VARCHAR(100) NOT NULL,
   TENKM                VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
   NGAYBD               DATE NOT NULL,
   NGAYKT               DATE NOT NULL,
   PHANTRAM             FLOAT NOT NULL DEFAULT 0
);

CREATE TABLE KM_TRANGSUC (
   ID_KHUYENMAI         INT NOT NULL,
   ID_TRANGSUC          INT NOT NULL,
   PRIMARY KEY (ID_KHUYENMAI, ID_TRANGSUC)
);

CREATE TABLE KM_DANHMUC (
   ID_KHUYENMAI         INT NOT NULL,
   MADM                 VARCHAR(10) NOT NULL,
   PRIMARY KEY (ID_KHUYENMAI, MADM)
);

ALTER TABLE ADMIN ADD CONSTRAINT FK_ADMIN_TAIKHOAN FOREIGN KEY (ID) REFERENCES TAIKHOAN(ID) ON DELETE RESTRICT;

ALTER TABLE KHACHHANG ADD CONSTRAINT FK_KHACHHANG_TAIKHOAN FOREIGN KEY (ID) REFERENCES TAIKHOAN(ID) ON DELETE RESTRICT;

ALTER TABLE TRANGSUC ADD CONSTRAINT FK_TRANGSUC_DANHMUC FOREIGN KEY (MADM) REFERENCES DANHMUCTS(MADM) ON DELETE RESTRICT;

ALTER TABLE HOADON ADD CONSTRAINT FK_HOADON_KHACHHANG FOREIGN KEY (ID_KHACHHANG) REFERENCES KHACHHANG(ID) ON DELETE RESTRICT;

ALTER TABLE GIOHANG ADD CONSTRAINT FK_GIOHANG_KHACHHANG FOREIGN KEY (ID_KHACHHANG) REFERENCES KHACHHANG(ID) ON DELETE RESTRICT;

ALTER TABLE CHITIETGH ADD CONSTRAINT FK_CHITIETGH_TRANGSUC FOREIGN KEY (ID_TRANGSUC) REFERENCES TRANGSUC(ID) ON DELETE RESTRICT;
ALTER TABLE CHITIETGH ADD CONSTRAINT FK_CHITIETGH_GIOHANG FOREIGN KEY (ID_GIOHANG) REFERENCES GIOHANG(ID_GIOHANG) ON DELETE RESTRICT;

ALTER TABLE CHITIETHD ADD CONSTRAINT FK_CHITIETHD_TRANGSUC FOREIGN KEY (ID_TRANGSUC) REFERENCES TRANGSUC(ID) ON DELETE RESTRICT;
ALTER TABLE CHITIETHD ADD CONSTRAINT FK_CHITIETHD_HOADON FOREIGN KEY (ID_HOADON) REFERENCES HOADON(ID_HOADON) ON DELETE RESTRICT;

ALTER TABLE KM_TRANGSUC ADD CONSTRAINT FK_KM_TRANGSUC_KHUYENMAI FOREIGN KEY (ID_KHUYENMAI) REFERENCES KHUYENMAI(ID) ON DELETE RESTRICT;
ALTER TABLE KM_TRANGSUC ADD CONSTRAINT FK_KM_TRANGSUC_TRANGSUC FOREIGN KEY (ID_TRANGSUC) REFERENCES TRANGSUC(ID) ON DELETE RESTRICT;

ALTER TABLE KM_DANHMUC ADD CONSTRAINT FK_KM_DANHMUC_KHUYENMAI FOREIGN KEY (ID_KHUYENMAI) REFERENCES KHUYENMAI(ID) ON DELETE RESTRICT;
ALTER TABLE KM_DANHMUC ADD CONSTRAINT FK_KM_DANHMUC_DANHMUCTS FOREIGN KEY (MADM) REFERENCES DANHMUCTS(MADM) ON DELETE RESTRICT;

-- Thêm dữ liệu

-- Tài khoản test

-- superadmin@gmail.com
-- 123456
INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('superadmin@gmail.com', '$2y$10$DPKNeF3xz/clbIKX.uTML./3pdsWJxl1l/abqpp0OnUknnHL5Wwiu', 1, 1);
SET @admin_id = LAST_INSERT_ID();
INSERT INTO ADMIN (ID, TENADMIN, SDT, DIACHI) 
VALUES (@admin_id, 'Trần Tiến P', '0123456780', '505 Đường G, HCM');


-- admin1@gmail.com
-- 123456
INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('admin1@gmail.com', '$2y$10$DPKNeF3xz/clbIKX.uTML./3pdsWJxl1l/abqpp0OnUknnHL5Wwiu', 2, 1);
SET @admin_id = LAST_INSERT_ID();
INSERT INTO ADMIN (ID, TENADMIN, SDT, DIACHI) 
VALUES (@admin_id, 'Văn A', '0123456781', '506 Đường A, HCM');

INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('admin2@gmail.com', '$2y$10$DPKNeF3xz/clbIKX.uTML./3pdsWJxl1l/abqpp0OnUknnHL5Wwiu', 2, 1);
SET @admin_id = LAST_INSERT_ID();
INSERT INTO ADMIN (ID, TENADMIN, SDT, DIACHI)
VALUES (@admin_id, 'Văn B', '0123456782', '506 Đường A, HCM');

INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('admin3@gmail.com', '$2y$10$DPKNeF3xz/clbIKX.uTML./3pdsWJxl1l/abqpp0OnUknnHL5Wwiu', 2, 1);
SET @admin_id = LAST_INSERT_ID();
INSERT INTO ADMIN (ID, TENADMIN, SDT, DIACHI) 
VALUES (@admin_id, 'Văn C', '0123456783', '506 Đường A, HCM');

INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('admin4@gmail.com', '$2y$10$DPKNeF3xz/clbIKX.uTML./3pdsWJxl1l/abqpp0OnUknnHL5Wwiu', 2, 1);
SET @admin_id = LAST_INSERT_ID();
INSERT INTO ADMIN (ID, TENADMIN, SDT, DIACHI) 
VALUES (@admin_id, 'Văn D', '0123456784', '506 Đường A, HCM');

-- test1@gmail.com
-- abcdef
INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('test1@gmail.com', '$2y$10$Sh.HPSQycPtzt7vtFWOTFuPVXU/Qwy0rBTkzEFejymFdKPrfkMisC', 0, 1);
SET @test_id = LAST_INSERT_ID();
INSERT INTO KHACHHANG (ID, TENKH, SDT, DIACHI, LOAI, GIOITINH) 
VALUES (@test_id, 'Nguyễn Văn A', '0123456789', '404 Đường F, HCM', 1, 2);

INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('test2@gmail.com', '$2y$10$Sh.HPSQycPtzt7vtFWOTFuPVXU/Qwy0rBTkzEFejymFdKPrfkMisC', 0, 1);
SET @test_id = LAST_INSERT_ID();
INSERT INTO KHACHHANG (ID, TENKH, SDT, DIACHI, LOAI, GIOITINH) 
VALUES (@test_id, 'Nguyễn Văn B', '0123456789', '404 Đường F, HCM', 1, 2);

INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('test3@gmail.com', '$2y$10$Sh.HPSQycPtzt7vtFWOTFuPVXU/Qwy0rBTkzEFejymFdKPrfkMisC', 0, 1);
SET @test_id = LAST_INSERT_ID();
INSERT INTO KHACHHANG (ID, TENKH, SDT, DIACHI, LOAI, GIOITINH) 
VALUES (@test_id, 'Nguyễn Văn C', '0123456789', '404 Đường F, HCM', 1, 2);

INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('test4@gmail.com', '$2y$10$Sh.HPSQycPtzt7vtFWOTFuPVXU/Qwy0rBTkzEFejymFdKPrfkMisC', 0, 1);
SET @test_id = LAST_INSERT_ID();
INSERT INTO KHACHHANG (ID, TENKH, SDT, DIACHI, LOAI, GIOITINH) 
VALUES (@test_id, 'Nguyễn Văn D', '0123456789', '404 Đường F, HCM', 1, 2);

INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('test5@gmail.com', '$2y$10$Sh.HPSQycPtzt7vtFWOTFuPVXU/Qwy0rBTkzEFejymFdKPrfkMisC', 0, 1);
SET @test_id = LAST_INSERT_ID();
INSERT INTO KHACHHANG (ID, TENKH, SDT, DIACHI, LOAI, GIOITINH) 
VALUES (@test_id, 'Nguyễn Văn E', '0123456789', '404 Đường F, HCM', 1, 2);

INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('test6@gmail.com', '$2y$10$Sh.HPSQycPtzt7vtFWOTFuPVXU/Qwy0rBTkzEFejymFdKPrfkMisC', 0, 1);
SET @test_id = LAST_INSERT_ID();
INSERT INTO KHACHHANG (ID, TENKH, SDT, DIACHI, LOAI, GIOITINH) 
VALUES (@test_id, 'Nguyễn Văn F', '0123456789', '404 Đường F, HCM', 1, 2);

INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('test7@gmail.com', '$2y$10$Sh.HPSQycPtzt7vtFWOTFuPVXU/Qwy0rBTkzEFejymFdKPrfkMisC', 0, 1);
SET @test_id = LAST_INSERT_ID();
INSERT INTO KHACHHANG (ID, TENKH, SDT, DIACHI, LOAI, GIOITINH) 
VALUES (@test_id, 'Nguyễn Văn G', '0123456789', '404 Đường F, HCM', 1, 2);

INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('test8@gmail.com', '$2y$10$Sh.HPSQycPtzt7vtFWOTFuPVXU/Qwy0rBTkzEFejymFdKPrfkMisC', 0, 1);
SET @test_id = LAST_INSERT_ID();
INSERT INTO KHACHHANG (ID, TENKH, SDT, DIACHI, LOAI, GIOITINH) 
VALUES (@test_id, 'Nguyễn Văn H', '0123456789', '404 Đường F, HCM', 1, 2);

INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('test9@gmail.com', '$2y$10$Sh.HPSQycPtzt7vtFWOTFuPVXU/Qwy0rBTkzEFejymFdKPrfkMisC', 0, 1);
SET @test_id = LAST_INSERT_ID();
INSERT INTO KHACHHANG (ID, TENKH, SDT, DIACHI, LOAI, GIOITINH) 
VALUES (@test_id, 'Nguyễn Văn K', '0123456789', '404 Đường F, HCM', 1, 2);

INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('test10@gmail.com', '$2y$10$Sh.HPSQycPtzt7vtFWOTFuPVXU/Qwy0rBTkzEFejymFdKPrfkMisC', 0, 1);
SET @test_id = LAST_INSERT_ID();
INSERT INTO KHACHHANG (ID, TENKH, SDT, DIACHI, LOAI, GIOITINH) 
VALUES (@test_id, 'Nguyễn Văn L', '0123456789', '404 Đường F, HCM', 1, 2);

-- Thêm danh mục ----------------------------------------------------------------
INSERT INTO DANHMUCTS (MADM, TENDM) VALUES
('DM00', 'Nhẫn'),
('DM01', 'Vòng tay'),
('DM02', 'Dây chuyền'),
('DM03', 'Khuyên tai'),
('DM04', 'Lắc');

-- Thêm dữ liệu vào bảng TRANGSUC ----------------------------------------------------------------
INSERT INTO TRANGSUC (MADM, TENTS, GIANIEMYET, SLTK, MOTA, IMAGEURL, DELETED_AT) VALUES 
('DM00', 'Nhẫn vàng 24K tinh tế', 3000000, 15, 'Nhẫn vàng 24K chế tác tinh xảo, mang lại vẻ đẹp sang trọng.', '\\storage\\images\\DM00_1.png', NULL),
('DM00', 'Nhẫn bạc ý đính đá quý', 2000000, 20, 'Nhẫn bạc cao cấp đính đá quý lấp lánh, tạo phong cách hiện đại.', '\\storage\\images\\DM00_2.png', NULL),
('DM00', 'Nhẫn đôi tình yêu khắc tên', 1500000, 30, 'Nhẫn đôi khắc tên, biểu tượng của tình yêu vĩnh cửu.', '\\storage\\images\\DM00_3.png', NULL),
('DM00', 'Nhẫn ngọc trai quý phái', 2500000, 10, 'Nhẫn ngọc trai sang trọng, phù hợp cho những buổi tiệc.', '\\storage\\images\\DM00_4.png', NULL),
('DM00', 'Nhẫn kim loại đen nam tính', 1800000, 25, 'Nhẫn kim loại đen với thiết kế mạnh mẽ dành cho phái mạnh.', '\\storage\\images\\DM00_5.png', NULL),
('DM00', 'Nhẫn hoa hồng đính ruby', 3500000, 8, 'Nhẫn thiết kế hình hoa hồng đính đá ruby tuyệt đẹp.', '\\storage\\images\\DM00_6.png', NULL),
('DM00', 'Nhẫn xoắn bạc cao cấp', 2200000, 12, 'Nhẫn bạc ý với kiểu dáng xoắn lạ mắt, thể hiện sự khác biệt.', '\\storage\\images\\DM00_7.png', NULL),
('DM00', 'Nhẫn kim cương nhân tạo siêu sáng', 5000000, 18, 'Nhẫn kim cương nhân tạo, ánh sáng lấp lánh không kém tự nhiên.', '\\storage\\images\\DM00_8.png', NULL),
('DM00', 'Nhẫn chữ cái khắc laser', 1300000, 50, 'Nhẫn cá nhân hóa với chữ cái được khắc bằng công nghệ laser.', '\\storage\\images\\DM00_9.png', NULL),
('DM00', 'Nhẫn vương miện nữ hoàng', 2800000, 10, 'Nhẫn thiết kế vương miện, tôn lên sự quyền quý.', '\\storage\\images\\DM00_10.png', NULL),
('DM01', 'Vòng tay đá phong thủy xanh ngọc', 1200000, 25, 'Vòng tay đá phong thủy màu xanh ngọc, mang lại may mắn.', '\\storage\\images\\DM01_1.png', NULL),
('DM01', 'Vòng tay ngọc bích tự nhiên', 4000000, 10, 'Vòng ngọc bích cao cấp, mang ý nghĩa bình an.', '\\storage\\images\\DM01_2.png', NULL),
('DM01', 'Vòng tay charm bạc cá tính', 1500000, 30, 'Vòng tay charm bạc thiết kế hiện đại, dễ dàng phối đồ.', '\\storage\\images\\DM01_3.png', NULL),
('DM01', 'Vòng tay vàng tết thủ công', 3500000, 12, 'Vòng tay vàng được tết thủ công tinh tế.', '\\storage\\images\\DM01_4.png', NULL),
('DM01', 'Vòng tay đá núi lửa đen mạnh mẽ', 1800000, 18, 'Vòng đá núi lửa màu đen, mang lại năng lượng tích cực.', '\\storage\\images\\DM01_5.png', NULL),
('DM01', 'Vòng tay bạc xi vàng', 2200000, 20, 'Vòng tay bạc xi vàng, kết hợp hoàn hảo giữa truyền thống và hiện đại.', '\\storage\\images\\DM01_6.png', NULL),
('DM01', 'Vòng tay ngọc trai đính charm', 2800000, 15, 'Vòng tay ngọc trai kết hợp charm, tạo phong cách độc đáo.', '\\storage\\images\\DM01_7.png', NULL),
('DM01', 'Vòng tay kim loại xoắn lạ mắt', 1000000, 35, 'Vòng tay kim loại xoắn, phù hợp cho người yêu sự khác biệt.', '\\storage\\images\\DM01_8.png', NULL),
('DM01', 'Vòng tay ruby đỏ quyền lực', 5000000, 8, 'Vòng tay đá ruby đỏ, biểu tượng của quyền lực và đam mê.', '\\storage\\images\\DM01_9.png', NULL),
('DM01', 'Vòng tay vải thêu vintage', 800000, 40, 'Vòng tay vải thêu họa tiết vintage, dành cho người yêu nét cổ điển.', '\\storage\\images\\DM01_10.png', NULL),
('DM02', 'Dây chuyền bạc đính đá Swarovski', 2500000, 20, 'Dây chuyền bạc Ý đính đá Swarovski lấp lánh.', '\\storage\\images\\DM02_1.png', NULL),
('DM02', 'Dây chuyền vàng 18K hình trái tim', 5500000, 10, 'Dây chuyền vàng 18K thiết kế hình trái tim lãng mạn.', '\\storage\\images\\DM02_2.png', NULL),
('DM02', 'Dây chuyền ngọc trai thiên nhiên', 4500000, 12, 'Dây chuyền ngọc trai cao cấp, dành cho sự kiện đặc biệt.', '\\storage\\images\\DM02_3.png', NULL),
('DM02', 'Dây chuyền hoa tuyết pha lê', 1500000, 25, 'Dây chuyền hình hoa tuyết với đá pha lê, mang phong cách nhẹ nhàng.', '\\storage\\images\\DM02_4.png', NULL),
('DM02', 'Dây chuyền chữ cái khắc riêng', 2000000, 30, 'Dây chuyền cá nhân hóa với chữ cái khắc riêng.', '\\storage\\images\\DM02_5.png', NULL),
('DM02', 'Dây chuyền bạc xi vàng hồng', 2800000, 15, 'Dây chuyền bạc xi vàng hồng, vẻ đẹp hiện đại và tinh tế.', '\\storage\\images\\DM02_6.png', NULL),
('DM02', 'Dây chuyền lồng đá ruby đỏ', 6000000, 8, 'Dây chuyền vàng 18K lồng đá ruby đỏ quý phái.', '\\storage\\images\\DM02_7.png', NULL),
('DM02', 'Dây chuyền đôi trái tim lồng ghép', 3500000, 20, 'Dây chuyền đôi trái tim, biểu tượng của tình yêu vĩnh cửu.', '\\storage\\images\\DM02_8.png', NULL),
('DM02', 'Dây chuyền đá thạch anh tím', 2000000, 18, 'Dây chuyền đá thạch anh tím, mang lại sự bình an.', '\\storage\\images\\DM02_9.png', NULL),
('DM02', 'Dây chuyền vintage họa tiết hoa', 1000000, 35, 'Dây chuyền phong cách vintage với họa tiết hoa.', '\\storage\\images\\DM02_10.png', NULL),
('DM03', 'Khuyên tai bạc đính ngọc trai', 1500000, 30, 'Khuyên tai bạc đính ngọc trai, nhẹ nhàng và thanh lịch.', '\\storage\\images\\DM03_1.png', NULL),
('DM03', 'Khuyên tai vòng tròn đá pha lê', 1200000, 40, 'Khuyên tai vòng tròn đính đá pha lê lấp lánh.', '\\storage\\images\\DM03_2.png', NULL),
('DM03', 'Khuyên tai dài thả kim loại', 1000000, 35, 'Khuyên tai dài thả, mang lại vẻ đẹp quyến rũ.', '\\storage\\images\\DM03_3.png', NULL),
('DM03', 'Khuyên tai vàng hình hoa sen', 3000000, 12, 'Khuyên tai vàng hình hoa sen, biểu tượng cho sự thanh cao.', '\\storage\\images\\DM03_4.png', NULL),
('DM03', 'Khuyên tai đá thạch anh hồng', 2000000, 25, 'Khuyên tai đá thạch anh hồng, tôn lên vẻ đẹp ngọt ngào.', '\\storage\\images\\DM03_5.png', NULL),
('DM03', 'Khuyên tai bạc xi vàng hình lá', 1500000, 20, 'Khuyên tai bạc xi vàng, thiết kế hình chiếc lá tinh xảo.', '\\storage\\images\\DM03_6.png', NULL),
('DM03', 'Khuyên tai ngọc trai vintage', 1800000, 15, 'Khuyên tai ngọc trai phong cách cổ điển.', '\\storage\\images\\DM03_7.png', NULL),
('DM03', 'Khuyên tai hình học hiện đại', 1000000, 40, 'Khuyên tai thiết kế hình học độc đáo, phù hợp phong cách hiện đại.', '\\storage\\images\\DM03_8.png', NULL),
('DM03', 'Khuyên tai vàng khối oval', 3500000, 8, 'Khuyên tai vàng khối, thiết kế oval sang trọng.', '\\storage\\images\\DM03_9.png', NULL),
('DM03', 'Khuyên tai nụ bạc ngọc trai', 1200000, 30, 'Khuyên tai nụ bạc đính ngọc trai, đơn giản nhưng tinh tế.', '\\storage\\images\\DM03_10.png', NULL),
('DM04', 'Lắc tay bạc xi vàng cao cấp', 2800000, 20, 'Lắc tay bạc xi vàng, sang trọng và hiện đại.', '\\storage\\images\\DM04_1.png', NULL),
('DM04', 'Lắc tay đá mắt hổ nâu', 1800000, 25, 'Lắc tay đá mắt hổ, mang lại sự mạnh mẽ và tự tin.', '\\storage\\images\\DM04_2.png', NULL),
('DM04', 'Lắc tay vàng 18K hình trái tim', 5000000, 12, 'Lắc tay vàng hình trái tim, biểu tượng tình yêu ngọt ngào.', '\\storage\\images\\DM04_3.png', NULL),
('DM04', 'Lắc tay dây mảnh ngọc bích', 3500000, 15, 'Lắc tay dây mảnh với ngọc bích quý phái.', '\\storage\\images\\DM04_4.png', NULL),
('DM04', 'Lắc tay charm hình hoa', 1500000, 30, 'Lắc tay bạc với charm hình hoa xinh xắn.', '\\storage\\images\\DM04_5.png', NULL),
('DM04', 'Lắc tay vintage khắc họa tiết', 1000000, 40, 'Lắc tay phong cách vintage, khắc họa tiết tinh xảo.', '\\storage\\images\\DM04_6.png', NULL),
('DM04', 'Lắc tay bạc mạ vàng hồng', 2500000, 18, 'Lắc tay bạc mạ vàng hồng, tôn lên vẻ đẹp hiện đại.', '\\storage\\images\\DM04_7.png', NULL),
('DM04', 'Lắc tay đá ruby đỏ quyền lực', 4000000, 10, 'Lắc tay đá ruby đỏ, mang lại sự quyền quý.', '\\storage\\images\\DM04_8.png', NULL),
('DM04', 'Lắc tay đơn giản tinh tế', 1200000, 35, 'Lắc tay bạc thiết kế tối giản, dễ dàng kết hợp trang phục.', '\\storage\\images\\DM04_9.png', NULL),
('DM04', 'Lắc tay hoa văn khắc laser', 1500000, 28, 'Lắc tay bạc với hoa văn được khắc bằng công nghệ laser hiện đại.', '\\storage\\images\\DM04_10.png', NULL);


-- Tạo giỏ hàng cho các khách hàng
INSERT INTO GIOHANG (ID_KHACHHANG)
VALUES
(6),(7),(8),(9),(10),(11),(12),(13),(14),(15);

-- Thêm dữ liệu CHITIETGH
INSERT INTO CHITIETGH (ID_TRANGSUC, ID_GIOHANG, SOLUONG)
VALUES
(1, 1, 2), (2, 1, 1), (3, 1, 3),
(4, 2, 1), (5, 2, 2), (6, 2, 1),
(7, 3, 2), (8, 3, 1), (9, 3, 3),
(10, 4, 1), (11, 4, 2), (12, 4, 1),
(13, 5, 2), (14, 5, 1), (15, 5, 3),
(16, 6, 1), (17, 6, 2), (18, 6, 1),
(19, 7, 2), (20, 7, 1), (21, 7, 3),
(22, 8, 1), (23, 8, 2), (24, 8, 1),
(25, 9, 2), (26, 9, 1), (27, 9, 3),
(28, 10, 1), (29, 10, 2), (30, 10, 1);

-- HOADON 1
INSERT INTO HOADON VALUES (NULL, 6, '2024-01-01', 7000000, 7000000, 1, NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(1, @hd_id, 1, 3000000), (2, @hd_id, 2, 2000000);
INSERT INTO HOADON VALUES (NULL, 7, '2024-01-02', 5500000, 5500000, 1, NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(3, @hd_id, 2, 1500000), (4, @hd_id, 1, 2500000);
INSERT INTO HOADON VALUES (NULL, 8, '2024-01-03', 5300000, 5300000, 1, NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(5, @hd_id, 1, 1800000),(6, @hd_id, 1, 3500000);
INSERT INTO HOADON VALUES (NULL,9,'2024-01-04',9400000,9400000,0,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(7, @hd_id, 2, 2200000),(8, @hd_id, 1, 5000000);
INSERT INTO HOADON VALUES (NULL,10,'2024-01-05',6700000,6700000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(9, @hd_id, 3, 1300000),(10, @hd_id, 1, 2800000);
INSERT INTO HOADON VALUES (NULL,11,'2024-01-06',6400000,6400000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(11, @hd_id, 2, 1200000),(12, @hd_id, 1, 4000000);
INSERT INTO HOADON VALUES (NULL,12,'2024-01-07',8600000,8600000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(13, @hd_id, 1, 1500000),(14, @hd_id, 1, 3500000),(15, @hd_id, 2, 1800000);
INSERT INTO HOADON VALUES (NULL,13,'2024-01-08',7800000,7800000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(16, @hd_id, 1, 2200000),(17, @hd_id, 2, 2800000);
INSERT INTO HOADON VALUES (NULL,14,'2024-01-09',8000000,8000000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(18, @hd_id, 3, 1000000),(19, @hd_id, 1, 5000000);
INSERT INTO HOADON VALUES (NULL,15,'2024-01-10',3200000,3200000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(20, @hd_id, 4, 800000);
INSERT INTO HOADON VALUES (NULL,6,'2024-01-11',6500000,6500000,2,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(21, @hd_id, 2, 1500000),(22, @hd_id, 1, 3500000);
INSERT INTO HOADON VALUES (NULL,7,'2024-01-12',6200000,6200000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(23, @hd_id, 1, 1800000),(24, @hd_id, 2, 2200000);
INSERT INTO HOADON VALUES (NULL,8,'2024-01-13',5800000,5800000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(25, @hd_id, 1, 2800000),(26, @hd_id, 3, 1000000);
INSERT INTO HOADON VALUES (NULL,9,'2024-01-14',7400000,7400000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(27, @hd_id, 1, 5000000),(28, @hd_id, 2, 1200000);
INSERT INTO HOADON VALUES (NULL,10,'2024-01-15',7300000,7300000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(29, @hd_id, 3, 1500000),(30, @hd_id, 1, 2800000);
INSERT INTO HOADON VALUES (NULL,11,'2024-01-16',8600000,8600000,0,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(1, @hd_id, 1, 3000000),(10, @hd_id, 2, 2800000);
INSERT INTO HOADON VALUES (NULL,12,'2024-01-17',6600000,6600000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(2, @hd_id, 2, 2000000),(9, @hd_id, 2, 1300000);
INSERT INTO HOADON VALUES (NULL,13,'2024-01-18',6500000,6500000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(3, @hd_id, 1, 1500000),(8, @hd_id, 1, 5000000);
INSERT INTO HOADON VALUES (NULL,14,'2024-01-19',8600000,8600000,2,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(4, @hd_id, 2, 2500000),(5, @hd_id, 2, 1800000);
INSERT INTO HOADON VALUES (NULL,15,'2024-01-20',10100000,10100000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(6, @hd_id, 1, 3500000),(7, @hd_id, 3, 2200000);
INSERT INTO HOADON VALUES (NULL,6,'2024-01-21',8000000,8000000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(8, @hd_id, 1, 5000000),(1, @hd_id, 1, 3000000);
INSERT INTO HOADON VALUES (NULL,7,'2024-01-22',5200000,5200000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(9, @hd_id, 4, 1300000);
INSERT INTO HOADON VALUES (NULL,8,'2024-01-23',7600000,7600000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(10, @hd_id, 2, 2800000),(2, @hd_id, 1, 2000000);
INSERT INTO HOADON VALUES (NULL,9,'2024-01-24',6000000,6000000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(3, @hd_id, 4, 1500000);
INSERT INTO HOADON VALUES (NULL,6,'2024-01-25',7800000,7800000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(4, @hd_id, 1, 2500000),(5, @hd_id, 1, 1800000),(6, @hd_id, 1, 3500000);
INSERT INTO HOADON VALUES (NULL,11,'2024-01-26',9400000,9400000,0,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(7, @hd_id, 2, 2200000),(8, @hd_id, 1, 5000000);
INSERT INTO HOADON VALUES (NULL,12,'2024-01-27',8600000,8600000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(9, @hd_id, 2, 1300000),(1, @hd_id, 2, 3000000);
INSERT INTO HOADON VALUES (NULL,13,'2024-01-28',6000000,6000000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(2, @hd_id, 3, 2000000);
INSERT INTO HOADON VALUES (NULL,14,'2024-01-29',8000000,8000000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(3, @hd_id, 2, 1500000),(4, @hd_id, 2, 2500000);
INSERT INTO HOADON VALUES (NULL,15,'2024-01-30',5400000,5400000,1,NULL);
SET @hd_id = LAST_INSERT_ID();
INSERT INTO CHITIETHD VALUES
(5, @hd_id, 3, 1800000);


-- Thêm dữ liệu KHUYENMAI ----------------------------------------------------------------
INSERT INTO KHUYENMAI (MAKM, TENKM, NGAYBD, NGAYKT, PHANTRAM) VALUES
('KM001', 'Khuyến mãi đặc biệt', '2024-01-01', '2024-12-31', 15),
('KM002', 'Giáng sinh', '2024-12-20', '2024-12-30', 30),
('KM003', 'Ưu đãi Quốc tế Phụ nữ', '2024-03-01', '2024-03-08', 25),
('KM004', 'Chào Hè rực rỡ', '2024-05-01', '2024-05-31', 10),
('KM005', 'Giảm giá Quốc tế Lao động', '2024-05-01', '2024-05-07', 30),
('KM006', 'Ưu đãi mùa tựu trường', '2024-08-15', '2024-08-31', 15),
('KM007', 'Khuyến mãi Trung thu', '2024-09-01', '2024-09-15', 20),
('KM008', 'Mùa lễ hội Giáng sinh', '2024-12-01', '2024-12-25', 35),
('KM009', 'Ưu đãi Black Friday', '2024-11-25', '2024-11-30', 50),
('KM010', 'Khuyến mãi chào năm mới', '2024-12-26', '2025-01-05', 40);

INSERT INTO KM_DANHMUC (ID_KHUYENMAI, MADM) VALUES
(1, 'DM00'),
(1, 'DM01'),
(1, 'DM02'),
(1, 'DM03'),
(1, 'DM04');

INSERT INTO KM_TRANGSUC (ID_KHUYENMAI, ID_TRANGSUC) VALUES
(1, 1),
(1, 3);
(2, 5),
(2, 6);
(2, 7),
(2, 8);
