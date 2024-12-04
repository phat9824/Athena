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
   ID_CHINHANH          VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL, -- Chi nhánh mà admin quản lý
   TENADMIN             VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
   SDT                  VARCHAR(15) NULL,
   DIACHI               VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL
);

CREATE TABLE KHACHHANG (
   ID                   INT PRIMARY KEY, -- Liên kết với ID từ bảng TAIKHOAN
   TENKH                VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
   SDT                  VARCHAR(15) NULL,
   DIACHI               VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
   LOAI                 TINYINT NULL,
   GIOITINH             TINYINT NULL -- 1: Nam, 2: Nữ
);

CREATE TABLE CHINHANH (
   ID                   VARCHAR(10) PRIMARY KEY,
   TENCN                VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
   DIACHI               VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
   DELETED_AT           DATETIME NULL  -- Không xóa hoàn toàn, chỉ ẩn đi
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

CREATE TABLE CHITIETKM (
   ID_KHUYENMAI         INT NOT NULL,
   ID_TRANGSUC          INT NOT NULL,
   PRIMARY KEY (ID_KHUYENMAI, ID_TRANGSUC)
);

CREATE TABLE TS_CHINHANH (
   ID_TRANGSUC          INT NOT NULL,
   ID_CHINHANH          VARCHAR(10) NOT NULL,
   SLTONKHO             INT NOT NULL DEFAULT 0,
   PRIMARY KEY (ID_TRANGSUC, ID_CHINHANH)
);

ALTER TABLE ADMIN ADD CONSTRAINT FK_ADMIN_TAIKHOAN FOREIGN KEY (ID) REFERENCES TAIKHOAN(ID) ON DELETE RESTRICT;
ALTER TABLE ADMIN ADD CONSTRAINT FK_ADMIN_CHINHANH FOREIGN KEY (ID_CHINHANH) REFERENCES CHINHANH(ID) ON DELETE RESTRICT;

ALTER TABLE KHACHHANG ADD CONSTRAINT FK_KHACHHANG_TAIKHOAN FOREIGN KEY (ID) REFERENCES TAIKHOAN(ID) ON DELETE RESTRICT;

ALTER TABLE TRANGSUC ADD CONSTRAINT FK_TRANGSUC_DANHMUC FOREIGN KEY (MADM) REFERENCES DANHMUCTS(MADM) ON DELETE RESTRICT;

ALTER TABLE HOADON ADD CONSTRAINT FK_HOADON_KHACHHANG FOREIGN KEY (ID_KHACHHANG) REFERENCES KHACHHANG(ID) ON DELETE RESTRICT;

ALTER TABLE GIOHANG ADD CONSTRAINT FK_GIOHANG_KHACHHANG FOREIGN KEY (ID_KHACHHANG) REFERENCES KHACHHANG(ID) ON DELETE RESTRICT;

ALTER TABLE CHITIETGH ADD CONSTRAINT FK_CHITIETGH_TRANGSUC FOREIGN KEY (ID_TRANGSUC) REFERENCES TRANGSUC(ID) ON DELETE RESTRICT;
ALTER TABLE CHITIETGH ADD CONSTRAINT FK_CHITIETGH_GIOHANG FOREIGN KEY (ID_GIOHANG) REFERENCES GIOHANG(ID_GIOHANG) ON DELETE RESTRICT;

ALTER TABLE CHITIETHD ADD CONSTRAINT FK_CHITIETHD_TRANGSUC FOREIGN KEY (ID_TRANGSUC) REFERENCES TRANGSUC(ID) ON DELETE RESTRICT;
ALTER TABLE CHITIETHD ADD CONSTRAINT FK_CHITIETHD_HOADON FOREIGN KEY (ID_HOADON) REFERENCES HOADON(ID_HOADON) ON DELETE RESTRICT;

ALTER TABLE CHITIETKM ADD CONSTRAINT FK_CHITIETKM_KHUYENMAI FOREIGN KEY (ID_KHUYENMAI) REFERENCES KHUYENMAI(ID) ON DELETE RESTRICT;
ALTER TABLE CHITIETKM ADD CONSTRAINT FK_CHITIETKM_TRANGSUC FOREIGN KEY (ID_TRANGSUC) REFERENCES TRANGSUC(ID) ON DELETE RESTRICT;

ALTER TABLE TS_CHINHANH ADD CONSTRAINT FK_TSCHINHANH_TRANGSUC FOREIGN KEY (ID_TRANGSUC) REFERENCES TRANGSUC(ID) ON DELETE RESTRICT;
ALTER TABLE TS_CHINHANH ADD CONSTRAINT FK_TSCHINHANH_CHINHANH FOREIGN KEY (ID_CHINHANH) REFERENCES CHINHANH(ID) ON DELETE RESTRICT;

-- Thêm dữ liệu

-- Tài khoản test

-- test@gmail.com
-- abcdef
INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('test@gmail.com', '$2y$10$Sh.HPSQycPtzt7vtFWOTFuPVXU/Qwy0rBTkzEFejymFdKPrfkMisC', 0, 1);

SET @test_id = LAST_INSERT_ID();
INSERT INTO KHACHHANG (ID, TENKH, SDT, DIACHI, LOAI, GIOITINH) 
VALUES (@test_id, 'Nguyễn Văn A', '0123456789', '404 Đường F, HCM', 1, 2);

-- superadmin@gmail.com
-- 123456
INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('superadmin@gmail.com', '$2y$10$DPKNeF3xz/clbIKX.uTML./3pdsWJxl1l/abqpp0OnUknnHL5Wwiu', 1, 1);

SET @admin_id = LAST_INSERT_ID();
INSERT INTO ADMIN (ID, ID_CHINHANH, TENADMIN, SDT, DIACHI) 
VALUES (@admin_id, NULL, 'Trần Tiến P', '0123456780', '505 Đường G, HCM');

INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) 
VALUES ('admin1@gmail.com', '$2y$10$DPKNeF3xz/clbIKX.uTML./3pdsWJxl1l/abqpp0OnUknnHL5Wwiu', 2, 1);

SET @admin_id = LAST_INSERT_ID();
INSERT INTO ADMIN (ID, ID_CHINHANH, TENADMIN, SDT, DIACHI) 
VALUES (@admin_id, NULL, 'Văn T', '0123456781', '506 Đường A, HCM');

-- Thêm danh mục
INSERT INTO DANHMUCTS (MADM, TENDM) VALUES
('DM00', 'Nhẫn'),
('DM01', 'Vòng tay'),
('DM02', 'Dây chuyền'),
('DM03', 'Khuyên tai'),
('DM04', 'Lắc')

-- Thêm trang sức
-- Thêm dữ liệu vào bảng TRANGSUC
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