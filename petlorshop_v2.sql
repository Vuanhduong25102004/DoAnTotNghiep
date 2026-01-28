-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: petlorshop_v2
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bai_viet`
--

DROP TABLE IF EXISTS `bai_viet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bai_viet` (
  `bai_viet_id` int NOT NULL AUTO_INCREMENT,
  `tieu_de` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `noi_dung` longtext NOT NULL,
  `anh_bia` text,
  `ngay_dang` datetime DEFAULT CURRENT_TIMESTAMP,
  `nhan_vien_id` int NOT NULL,
  `danh_muc_bv_id` int DEFAULT NULL,
  `trang_thai` enum('NHAP','CONG_KHAI','AN') DEFAULT 'NHAP',
  `da_xoa` bit(1) DEFAULT NULL,
  PRIMARY KEY (`bai_viet_id`),
  KEY `fk_bv_dm` (`danh_muc_bv_id`),
  KEY `fk_bv_nv` (`nhan_vien_id`),
  CONSTRAINT `fk_bv_dm` FOREIGN KEY (`danh_muc_bv_id`) REFERENCES `danh_muc_bai_viet` (`danh_muc_bv_id`),
  CONSTRAINT `fk_bv_nv` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`nhan_vien_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bai_viet`
--

LOCK TABLES `bai_viet` WRITE;
/*!40000 ALTER TABLE `bai_viet` DISABLE KEYS */;
/*!40000 ALTER TABLE `bai_viet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_don_hang`
--

DROP TABLE IF EXISTS `chi_tiet_don_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_don_hang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `don_hang_id` int NOT NULL,
  `san_pham_id` int NOT NULL,
  `so_luong` int NOT NULL,
  `don_gia` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ctdh_donhang` (`don_hang_id`),
  KEY `fk_ctdh_sp` (`san_pham_id`),
  CONSTRAINT `fk_ctdh_donhang` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`don_hang_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ctdh_sp` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`san_pham_id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_don_hang`
--

LOCK TABLES `chi_tiet_don_hang` WRITE;
/*!40000 ALTER TABLE `chi_tiet_don_hang` DISABLE KEYS */;
/*!40000 ALTER TABLE `chi_tiet_don_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_don_thuoc`
--

DROP TABLE IF EXISTS `chi_tiet_don_thuoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_don_thuoc` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lieu_dung` varchar(255) DEFAULT NULL,
  `so_luong` int NOT NULL,
  `don_thuoc_id` int NOT NULL,
  `san_pham_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4e5xwwvsae5p0qafoc8cph52w` (`don_thuoc_id`),
  KEY `FKlf86gal9cc6vxrjrvk773hg2k` (`san_pham_id`),
  CONSTRAINT `FK4e5xwwvsae5p0qafoc8cph52w` FOREIGN KEY (`don_thuoc_id`) REFERENCES `don_thuoc` (`don_thuoc_id`),
  CONSTRAINT `FKlf86gal9cc6vxrjrvk773hg2k` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`san_pham_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_don_thuoc`
--

LOCK TABLES `chi_tiet_don_thuoc` WRITE;
/*!40000 ALTER TABLE `chi_tiet_don_thuoc` DISABLE KEYS */;
/*!40000 ALTER TABLE `chi_tiet_don_thuoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_gio_hang`
--

DROP TABLE IF EXISTS `chi_tiet_gio_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_gio_hang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gio_hang_id` int NOT NULL,
  `san_pham_id` int NOT NULL,
  `so_luong` int NOT NULL DEFAULT '1',
  `ngay_them` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cart_item` (`gio_hang_id`,`san_pham_id`),
  UNIQUE KEY `UKrgaichkf593qhqk7yhgr99q6m` (`gio_hang_id`,`san_pham_id`),
  KEY `fk_ctgh_sp` (`san_pham_id`),
  CONSTRAINT `fk_ctgh_giohang` FOREIGN KEY (`gio_hang_id`) REFERENCES `gio_hang` (`gio_hang_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ctgh_sp` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`san_pham_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_gio_hang`
--

LOCK TABLES `chi_tiet_gio_hang` WRITE;
/*!40000 ALTER TABLE `chi_tiet_gio_hang` DISABLE KEYS */;
/*!40000 ALTER TABLE `chi_tiet_gio_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_phieu_nhap`
--

DROP TABLE IF EXISTS `chi_tiet_phieu_nhap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_phieu_nhap` (
  `ctpn_id` int NOT NULL AUTO_INCREMENT,
  `phieu_nhap_id` int NOT NULL,
  `san_pham_id` int NOT NULL,
  `so_luong` int NOT NULL,
  `gia_nhap` decimal(38,2) NOT NULL,
  PRIMARY KEY (`ctpn_id`),
  KEY `fk_ctpn_phieu` (`phieu_nhap_id`),
  KEY `fk_ctpn_sp` (`san_pham_id`),
  CONSTRAINT `fk_ctpn_phieu` FOREIGN KEY (`phieu_nhap_id`) REFERENCES `phieu_nhap` (`phieu_nhap_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ctpn_sp` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`san_pham_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_phieu_nhap`
--

LOCK TABLES `chi_tiet_phieu_nhap` WRITE;
/*!40000 ALTER TABLE `chi_tiet_phieu_nhap` DISABLE KEYS */;
/*!40000 ALTER TABLE `chi_tiet_phieu_nhap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cua_hang`
--

DROP TABLE IF EXISTS `cua_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cua_hang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dia_chi_chi_tiet` varchar(255) DEFAULT NULL,
  `ghtk_token` varchar(255) DEFAULT NULL,
  `phuong_xa` varchar(255) DEFAULT NULL,
  `quan_huyen` varchar(255) DEFAULT NULL,
  `so_dien_thoai` varchar(255) DEFAULT NULL,
  `ten_cua_hang` varchar(255) DEFAULT NULL,
  `tinh_thanh` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cua_hang`
--

LOCK TABLES `cua_hang` WRITE;
/*!40000 ALTER TABLE `cua_hang` DISABLE KEYS */;
INSERT INTO `cua_hang` VALUES (1,NULL,NULL,NULL,'Quận Cầu Giấy',NULL,'Petlor Shop','Hà Nội');
/*!40000 ALTER TABLE `cua_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_gia`
--

DROP TABLE IF EXISTS `danh_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_gia` (
  `danh_gia_id` int NOT NULL AUTO_INCREMENT,
  `ngay_danh_gia` datetime(6) DEFAULT NULL,
  `noi_dung` text,
  `so_sao` int NOT NULL,
  `don_hang_id` int NOT NULL,
  `user_id` int NOT NULL,
  `san_pham_id` int DEFAULT NULL,
  `ngay_phan_hoi` datetime(6) DEFAULT NULL,
  `phan_hoi` text,
  PRIMARY KEY (`danh_gia_id`),
  KEY `FK6x9dbf9vytsh3dw6ibj9xa7c6` (`don_hang_id`),
  KEY `FKe92qvru6jwbl3b6ff0dl6nvnd` (`user_id`),
  KEY `FKpb5x40mo1o7n473vju2rc2luc` (`san_pham_id`),
  CONSTRAINT `FK6x9dbf9vytsh3dw6ibj9xa7c6` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`don_hang_id`),
  CONSTRAINT `FKe92qvru6jwbl3b6ff0dl6nvnd` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`user_id`),
  CONSTRAINT `FKpb5x40mo1o7n473vju2rc2luc` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`san_pham_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_gia`
--

LOCK TABLES `danh_gia` WRITE;
/*!40000 ALTER TABLE `danh_gia` DISABLE KEYS */;
/*!40000 ALTER TABLE `danh_gia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_muc_bai_viet`
--

DROP TABLE IF EXISTS `danh_muc_bai_viet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_muc_bai_viet` (
  `danh_muc_bv_id` int NOT NULL AUTO_INCREMENT,
  `ten_danh_muc` varchar(255) NOT NULL,
  `da_xoa` bit(1) DEFAULT NULL,
  `mo_ta` text,
  PRIMARY KEY (`danh_muc_bv_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_muc_bai_viet`
--

LOCK TABLES `danh_muc_bai_viet` WRITE;
/*!40000 ALTER TABLE `danh_muc_bai_viet` DISABLE KEYS */;
INSERT INTO `danh_muc_bai_viet` VALUES (1,'Kiến thức nuôi chó',_binary '\0','asdasd'),(2,'Kiến thức nuôi mèo',_binary '\0','asfaczxc'),(3,'Khuyến mãi',_binary '\0',NULL),(4,'Chăm sóc thú cưng',_binary '',NULL),(5,'Kiến thức nuôi thỏ',_binary '\0',NULL),(6,'Dinh dưỡng thú cưng',_binary '\0',NULL),(7,'Sự kiện & Khuyến mãi',_binary '\0',NULL);
/*!40000 ALTER TABLE `danh_muc_bai_viet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_muc_dich_vu`
--

DROP TABLE IF EXISTS `danh_muc_dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_muc_dich_vu` (
  `danh_muc_dv_id` int NOT NULL AUTO_INCREMENT,
  `ten_danh_muc_dv` varchar(100) NOT NULL,
  `mo_ta` text,
  PRIMARY KEY (`danh_muc_dv_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_muc_dich_vu`
--

LOCK TABLES `danh_muc_dich_vu` WRITE;
/*!40000 ALTER TABLE `danh_muc_dich_vu` DISABLE KEYS */;
INSERT INTO `danh_muc_dich_vu` VALUES (1,'Khám bệnh','Khám và chẩn đoán sức khỏe thú cưng'),(2,'Spa & Grooming','Tắm, cắt tỉa, vệ sinh'),(3,'Tiêm phòng','Tiêm vacxin định kỳ'),(4,'Tư vấn','Tư vấn sức khỏe và dinh dưỡng');
/*!40000 ALTER TABLE `danh_muc_dich_vu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_muc_san_pham`
--

DROP TABLE IF EXISTS `danh_muc_san_pham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_muc_san_pham` (
  `danh_muc_id` int NOT NULL AUTO_INCREMENT,
  `ten_danh_muc` varchar(100) NOT NULL,
  `mo_ta` text,
  PRIMARY KEY (`danh_muc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_muc_san_pham`
--

LOCK TABLES `danh_muc_san_pham` WRITE;
/*!40000 ALTER TABLE `danh_muc_san_pham` DISABLE KEYS */;
INSERT INTO `danh_muc_san_pham` VALUES (1,'Thức ăn chó','Thức ăn khô, ướt dành cho chó'),(2,'Thức ăn mèo','Thức ăn hạt, pate cho mèo'),(3,'Thuốc thú y','Thuốc điều trị, phòng bệnh cho thú cưng'),(4,'Phụ kiện','Dây dắt, vòng cổ, khay ăn'),(5,'Đồ chơi','Đồ chơi vận động cho thú cưng');
/*!40000 ALTER TABLE `danh_muc_san_pham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dich_vu`
--

DROP TABLE IF EXISTS `dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dich_vu` (
  `dich_vu_id` int NOT NULL AUTO_INCREMENT,
  `ten_dich_vu` varchar(255) NOT NULL,
  `mo_ta` text,
  `gia_dich_vu` decimal(10,2) NOT NULL,
  `thoi_luong_uoc_tinh` int DEFAULT '60',
  `danh_muc_dv_id` int DEFAULT NULL,
  `hinh_anh` text,
  PRIMARY KEY (`dich_vu_id`),
  KEY `fk_dv_danhmuc` (`danh_muc_dv_id`),
  CONSTRAINT `fk_dv_danhmuc` FOREIGN KEY (`danh_muc_dv_id`) REFERENCES `danh_muc_dich_vu` (`danh_muc_dv_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dich_vu`
--

LOCK TABLES `dich_vu` WRITE;
/*!40000 ALTER TABLE `dich_vu` DISABLE KEYS */;
INSERT INTO `dich_vu` VALUES (13,'Khám tổng quát','Khám sức khỏe tổng quát cho chó mèo',200000.00,60,1,'kham-tong-quat.jpg'),(14,'Khám chuyên sâu','Khám bệnh, xét nghiệm chuyên sâu',300000.00,90,1,'kham-chuyen-sau.jpg'),(15,'Tắm & sấy cho chó','Tắm, sấy, vệ sinh cơ bản',150000.00,60,2,'tam-cho.jpg'),(16,'Grooming mèo','Cắt tỉa lông, vệ sinh tai móng',180000.00,90,2,'grooming-meo.jpg'),(17,'Tiêm phòng 5 bệnh','Vacxin 5 bệnh cho chó',250000.00,30,3,'tiem-5-benh.jpg'),(18,'Tiêm phòng dại','Vacxin phòng bệnh dại',120000.00,20,3,'tiem-dai.jpg'),(19,'Tư vấn dinh dưỡng','Tư vấn chế độ ăn phù hợp',100000.00,30,4,'tu-van-dinh-duong.jpg');
/*!40000 ALTER TABLE `dich_vu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_hang`
--

DROP TABLE IF EXISTS `don_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_hang` (
  `don_hang_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `khuyen_mai_id` int DEFAULT NULL,
  `ngay_dat_hang` datetime DEFAULT CURRENT_TIMESTAMP,
  `tong_tien_hang` decimal(10,2) NOT NULL,
  `so_tien_giam` decimal(10,2) DEFAULT '0.00',
  `tong_thanh_toan` decimal(10,2) NOT NULL,
  `trang_thai` enum('CHO_XU_LY','DA_XAC_NHAN','DANG_GIAO','DA_GIAO','DA_HUY') DEFAULT 'CHO_XU_LY',
  `phuong_thuc_thanh_toan` enum('COD','VNPAY','MOMO') DEFAULT 'COD',
  `dia_chi_giao_hang` text NOT NULL,
  `so_dien_thoai_nhan` varchar(20) NOT NULL,
  `ly_do_huy` text,
  `email_nguoi_nhan` varchar(100) DEFAULT NULL,
  `ho_ten_nguoi_nhan` varchar(100) DEFAULT NULL,
  `phi_van_chuyen` decimal(10,2) DEFAULT NULL,
  `ma_giao_dich` varchar(255) DEFAULT NULL,
  `ngay_thanh_toan` datetime(6) DEFAULT NULL,
  `trang_thai_thanh_toan` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`don_hang_id`),
  KEY `fk_dh_user` (`user_id`),
  KEY `fk_dh_km` (`khuyen_mai_id`),
  CONSTRAINT `fk_dh_km` FOREIGN KEY (`khuyen_mai_id`) REFERENCES `khuyen_mai` (`khuyen_mai_id`),
  CONSTRAINT `fk_dh_user` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_hang`
--

LOCK TABLES `don_hang` WRITE;
/*!40000 ALTER TABLE `don_hang` DISABLE KEYS */;
/*!40000 ALTER TABLE `don_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_thuoc`
--

DROP TABLE IF EXISTS `don_thuoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_thuoc` (
  `don_thuoc_id` int NOT NULL AUTO_INCREMENT,
  `chan_doan` text,
  `loi_dan` text,
  `ngay_ke` datetime(6) DEFAULT NULL,
  `trang_thai` enum('DA_HUY','DA_THANH_TOAN','MOI_TAO') DEFAULT NULL,
  `nhan_vien_id` int DEFAULT NULL,
  `lich_hen_id` int NOT NULL,
  `thu_cung_id` int DEFAULT NULL,
  PRIMARY KEY (`don_thuoc_id`),
  UNIQUE KEY `UK95ugkldnnda2ibmdbbbikd7g7` (`lich_hen_id`),
  KEY `FKcq0l5xojnbelghmxvvtcyb46n` (`nhan_vien_id`),
  KEY `FKk0x9pfc3anly6i84edntfmhye` (`thu_cung_id`),
  CONSTRAINT `FKcq0l5xojnbelghmxvvtcyb46n` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`nhan_vien_id`),
  CONSTRAINT `FKk0x9pfc3anly6i84edntfmhye` FOREIGN KEY (`thu_cung_id`) REFERENCES `thu_cung` (`thu_cung_id`),
  CONSTRAINT `FKu2h5hrjmloafd2930x9x3von` FOREIGN KEY (`lich_hen_id`) REFERENCES `lich_hen` (`lich_hen_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_thuoc`
--

LOCK TABLES `don_thuoc` WRITE;
/*!40000 ALTER TABLE `don_thuoc` DISABLE KEYS */;
/*!40000 ALTER TABLE `don_thuoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `giao_dich_thanh_toan`
--

DROP TABLE IF EXISTS `giao_dich_thanh_toan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `giao_dich_thanh_toan` (
  `giao_dich_id` int NOT NULL AUTO_INCREMENT,
  `don_hang_id` int NOT NULL,
  `ma_giao_dich` varchar(255) DEFAULT NULL,
  `so_tien` decimal(38,2) NOT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `trang_thai` enum('THANH_CONG','THAT_BAI','CHO_XU_LY') DEFAULT 'CHO_XU_LY',
  `noi_dung_loi` text,
  PRIMARY KEY (`giao_dich_id`),
  KEY `fk_gd_donhang` (`don_hang_id`),
  CONSTRAINT `fk_gd_donhang` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`don_hang_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `giao_dich_thanh_toan`
--

LOCK TABLES `giao_dich_thanh_toan` WRITE;
/*!40000 ALTER TABLE `giao_dich_thanh_toan` DISABLE KEYS */;
/*!40000 ALTER TABLE `giao_dich_thanh_toan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gio_hang`
--

DROP TABLE IF EXISTS `gio_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gio_hang` (
  `gio_hang_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`gio_hang_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_giohang_user` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gio_hang`
--

LOCK TABLES `gio_hang` WRITE;
/*!40000 ALTER TABLE `gio_hang` DISABLE KEYS */;
INSERT INTO `gio_hang` VALUES (1,1,'2025-12-19 17:50:30'),(2,2,'2025-12-19 17:50:30'),(3,3,'2025-12-19 17:50:30'),(4,4,'2025-12-19 17:50:30'),(5,5,'2025-12-19 17:50:30'),(6,6,'2025-12-19 17:50:30'),(7,7,'2025-12-19 17:50:30'),(8,8,'2025-12-19 17:50:30'),(9,9,'2025-12-19 17:50:30'),(10,10,'2025-12-19 17:50:30'),(11,25,'2026-01-17 11:24:53'),(12,15,'2026-01-19 09:07:27'),(13,16,'2026-01-19 10:55:07');
/*!40000 ALTER TABLE `gio_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khuyen_mai`
--

DROP TABLE IF EXISTS `khuyen_mai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khuyen_mai` (
  `khuyen_mai_id` int NOT NULL AUTO_INCREMENT,
  `ma_code` varchar(50) NOT NULL,
  `mo_ta` text,
  `loai_giam_gia` enum('PHAN_TRAM','SO_TIEN') NOT NULL,
  `gia_tri_giam` decimal(10,2) NOT NULL,
  `ngay_bat_dau` datetime NOT NULL,
  `ngay_ket_thuc` datetime NOT NULL,
  `so_luong_gioi_han` int DEFAULT NULL,
  `don_toi_thieu` decimal(10,2) DEFAULT '0.00',
  `trang_thai` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`khuyen_mai_id`),
  UNIQUE KEY `ma_code` (`ma_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khuyen_mai`
--

LOCK TABLES `khuyen_mai` WRITE;
/*!40000 ALTER TABLE `khuyen_mai` DISABLE KEYS */;
INSERT INTO `khuyen_mai` VALUES (1,'SALE50K_EDIT','Đã sửa mô tả','SO_TIEN',60000.00,'2023-10-01 00:00:00','2026-01-25 23:59:59',50,250000.00,1),(2,'SUMMERTIME','','PHAN_TRAM',100.00,'2025-12-22 00:00:00','2026-12-26 23:59:59',98,0.00,1),(3,'Wintersale','','PHAN_TRAM',50.00,'2026-01-17 00:00:00','2026-01-31 23:59:59',100,0.00,1);
/*!40000 ALTER TABLE `khuyen_mai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_hen`
--

DROP TABLE IF EXISTS `lich_hen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lich_hen` (
  `lich_hen_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `thu_cung_id` int DEFAULT NULL,
  `dich_vu_id` int NOT NULL,
  `nhan_vien_id` int DEFAULT NULL,
  `thoi_gian_bat_dau` datetime NOT NULL,
  `thoi_gian_ket_thuc` datetime NOT NULL,
  `trang_thai` enum('CHO_XAC_NHAN','DA_XAC_NHAN','DA_HOAN_THANH','DA_HUY') DEFAULT 'CHO_XAC_NHAN',
  `ghi_chu` text,
  `ly_do_huy` text,
  `email_khach_hang` varchar(255) DEFAULT NULL,
  `sdt_khach_hang` varchar(255) DEFAULT NULL,
  `ten_khach_hang` varchar(255) DEFAULT NULL,
  `loai_lich_hen` enum('KHAN_CAP','TAI_KHAM','THUONG_LE','TU_VAN') DEFAULT NULL,
  `ghi_chu_bac_si` text,
  PRIMARY KEY (`lich_hen_id`),
  KEY `fk_lh_thucung` (`thu_cung_id`),
  KEY `fk_lh_dichvu` (`dich_vu_id`),
  KEY `fk_lh_nhanvien` (`nhan_vien_id`),
  KEY `fk_lh_user` (`user_id`),
  CONSTRAINT `fk_lh_dichvu` FOREIGN KEY (`dich_vu_id`) REFERENCES `dich_vu` (`dich_vu_id`),
  CONSTRAINT `fk_lh_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`nhan_vien_id`),
  CONSTRAINT `fk_lh_thucung` FOREIGN KEY (`thu_cung_id`) REFERENCES `thu_cung` (`thu_cung_id`),
  CONSTRAINT `fk_lh_user` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_hen`
--

LOCK TABLES `lich_hen` WRITE;
/*!40000 ALTER TABLE `lich_hen` DISABLE KEYS */;
/*!40000 ALTER TABLE `lich_hen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nguoi_dung`
--

DROP TABLE IF EXISTS `nguoi_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoi_dung` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `dia_chi` text,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `auth_provider` enum('LOCAL','GOOGLE','FACEBOOK') DEFAULT 'LOCAL',
  `role` varchar(255) NOT NULL,
  `anh_dai_dien` text,
  `trang_thai` tinyint(1) DEFAULT '1',
  `gioi_tinh` varchar(10) DEFAULT NULL,
  `ngay_sinh` date DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
INSERT INTO `nguoi_dung` VALUES (1,'Vu Anh Duong','vuanhduong251020042@gmail.com','$2a$10$wOq3Yit.kW5xvCnFqarRletxh5nlFdONyB.4ll/q5bIAD0ragxH3K','0972471680','Hà ','2025-12-19 17:46:57','LOCAL','ADMIN','70bef9c6-1a67-4d11-87e1-20a25e15f707.jpg',1,'Nam','2004-10-25'),(2,'Nguyễn Văn A','user1@gmail.com','$2a$10$OpKEEDWKLOfsqrMcd/lyeOwnb410HZkAVYA8u6v/6q95FvkoCcM/.','09324532123','Hà Nội','2025-12-19 17:50:30','LOCAL','USER','08b80563-f622-48d5-8a40-9698d7a990bf.jpg',0,NULL,NULL),(3,'Trần Thị B','user2@gmail.com','123456','0902222222','TP HCM','2025-12-19 17:50:30','LOCAL','USER','57a96101-9908-405a-a6c8-58baba1e2b1d.jpg',1,NULL,NULL),(4,'Lê Văn C','user3@gmail.com','123456','0903333333','Đà Nẵng','2025-12-19 17:50:30','LOCAL','USER',NULL,1,NULL,NULL),(5,'Phạm Thị D','user4@gmail.com','123456','0904444444','Hải Phòng','2025-12-19 17:50:30','LOCAL','USER',NULL,1,NULL,NULL),(6,'Hoàng Văn E','user5@gmail.com','123456','0905555555','Cần Thơ','2025-12-19 17:50:30','LOCAL','USER',NULL,1,NULL,NULL),(7,'User 6','user6@gmail.com','123456','0906666666','Huế','2025-12-19 17:50:30','LOCAL','USER',NULL,1,NULL,NULL),(8,'User 7','user7@gmail.com','123456','0907777777','Nghệ An','2025-12-19 17:50:30','LOCAL','USER',NULL,1,NULL,NULL),(9,'User 8','user8@gmail.com','123456','0908888881','Quảng Ninh','2025-12-19 17:50:30','LOCAL','USER',NULL,1,NULL,NULL),(10,'Admin Pett','admin@gmail.com','$2a$10$sW.KUeJ2TbXqbwgMHPrAoO1AugIj41IMgZLpwWoTK6aBB1yPwoD1e','0909999999',NULL,'2025-12-19 17:50:30','LOCAL','DOCTOR','7552e027-08a6-40dc-9c39-74c70fce99dc.jpg',1,NULL,NULL),(12,'Trần Thị Bác Sĩ','bacsii@example.com','$2a$10$wEQbMM.3R6.4dwFukfXiR.CZKnbqqgk856HWfS.gFahxwxfprgv/6','0912345678','456 Đường XYZ, Hà Nội','2025-12-19 18:00:23','LOCAL','USER','0aa426df-0234-4dc9-b2e8-280dae303e4d.jpg',1,NULL,NULL),(14,'Nguyễn Văn Test','0909998887@petshop.local','$2a$10$KpehtQE24aS78k.7zj3c6e7ZOtBdscqxkVKE0LoWrdpSHUdhhHXzS','0909998887',NULL,'2025-12-20 02:10:25','LOCAL','USER',NULL,1,NULL,NULL),(15,'Bác sĩ Minh','bsminh@gmail.com','$2a$10$Q.7eftheeTGD68spN/WOZuisU5kdISQlclFoUj3gHGYqtvQI1D0Oe','0908888888',NULL,'2025-12-20 11:44:58','LOCAL','RECEPTIONIST','eeb835e6-26d1-439a-ac45-1cb9b2158824.jpg',1,NULL,NULL),(16,'Bác sĩ Lan','bslan@gmail.com','$2a$10$sW.KUeJ2TbXqbwgMHPrAoO1AugIj41IMgZLpwWoTK6aBB1yPwoD1e','0908888889',NULL,'2025-12-20 12:04:09','LOCAL','SPA','9e455f81-a674-4817-8c75-44b89871a3ea.jpg',1,NULL,NULL),(20,'Tên Nhân Viên Mới','nhanvien.moi@petshop.com','$2a$10$BcEVlIQ8XU7e6tRQqarWkOjiApuLl9AFFKvyFyzsiPAbJQ3weWq4e','0901234567','Hà Đông, Hà Nội','2025-12-20 12:21:55','LOCAL','DOCTOR','64f5e167-d2a8-421a-9d3c-e70d30ccf823.jpg',1,NULL,NULL),(22,'Vu Duong','vuanhduong@gmail.com','$2a$10$0UDqIkzMBoU2p3egLWpB6u3/hKY9Mmv4svnvorxp4LrHQO1hgNhxi','0972471681','HaNoi','2025-12-21 12:38:32','LOCAL','USER','08b80563-f622-48d5-8a40-9698d7a990bf.jpg',1,NULL,NULL),(25,'duong','duong@gmail.com','$2a$10$IuNLoSuF9G9EpBUWPwULpuR.wISJsct1WaUTtiijnhQuc/lUk8zLC','09842423212','HaNoi','2026-01-17 11:24:05','LOCAL','ADMIN',NULL,1,NULL,NULL),(26,'KTV Spa','spa@gmail.com','$2a$10$RJSZzp0MzVlsmdTNIgeBNukSg.841.zH9.EwuFRZJRmd.D8iX5ECy','0908888890',NULL,'2026-01-22 13:37:16','LOCAL','DOCTOR',NULL,1,NULL,NULL),(27,'hehe','hehe@gmail.com','$2a$10$4EYsGMdZD9Nq.bpkDxZLyOrm.132jxIMumEzo178OpGOpCR.TVxJy','091231232443','abc123','2026-01-27 12:23:37','LOCAL','USER',NULL,1,NULL,NULL);
/*!40000 ALTER TABLE `nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nha_cung_cap`
--

DROP TABLE IF EXISTS `nha_cung_cap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nha_cung_cap` (
  `ncc_id` int NOT NULL AUTO_INCREMENT,
  `ten_ncc` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `dia_chi` text,
  `da_xoa` bit(1) DEFAULT NULL,
  PRIMARY KEY (`ncc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nha_cung_cap`
--

LOCK TABLES `nha_cung_cap` WRITE;
/*!40000 ALTER TABLE `nha_cung_cap` DISABLE KEYS */;
INSERT INTO `nha_cung_cap` VALUES (2,'Pet City','02455556666','sales@petcity.vn','Đống Đa, Hà Nội',_binary '\0'),(4,'Royal Canin Vietnam','0909123456','contact@royalcanin.vn','Quận 7, TP.HCM',_binary '\0'),(5,'Royal Canin Vietnam','0909123457','contact@royalcanin.vn','Quận 7, TP.HCM',_binary '');
/*!40000 ALTER TABLE `nha_cung_cap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien`
--

DROP TABLE IF EXISTS `nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhan_vien` (
  `nhan_vien_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `chuc_vu` varchar(100) DEFAULT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `chuyen_khoa` varchar(255) DEFAULT NULL,
  `kinh_nghiem` text,
  `anh_dai_dien` text,
  PRIMARY KEY (`nhan_vien_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `fk_nhanvien_user` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien`
--

LOCK TABLES `nhan_vien` WRITE;
/*!40000 ALTER TABLE `nhan_vien` DISABLE KEYS */;
INSERT INTO `nhan_vien` VALUES (1,10,'Admin Pett','Bác sĩ thú y','0909999999','admin@gmail.com','Quản lý','5 năm','7552e027-08a6-40dc-9c39-74c70fce99dc.jpg'),(2,15,'Bác sĩ Minh','Nhân viên Spa','0908888888','bsminh@gmail.com','Nội khoa','5 năm kinh nghiệm điều trị chó mèo','eeb835e6-26d1-439a-ac45-1cb9b2158824.jpg'),(3,16,'Bác sĩ Lan','Bác sĩ thú y','0908888889','bslan@gmail.com','Thú y','6 năm','9e455f81-a674-4817-8c75-44b89871a3ea.jpg'),(4,26,'KTV Spa','Bác sĩ thú y','0908888890','spa@gmail.com','Grooming','4 năm',NULL),(5,NULL,'Lễ tân','Nhân viên lễ tân','0908888891','letan@gmail.com','CSKH','3 năm',NULL),(9,20,'Tên Nhân Viên Mới','Bác sĩ thú y','0901234567','nhanvien.moi@petshop.com','Chuyên khoa của nhân viên (ví dụ: Nội khoa)','Kinh nghiệm làm việc (ví dụ: 3 năm)','64f5e167-d2a8-421a-9d3c-e70d30ccf823.jpg');
/*!40000 ALTER TABLE `nhan_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phieu_nhap`
--

DROP TABLE IF EXISTS `phieu_nhap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phieu_nhap` (
  `phieu_nhap_id` int NOT NULL AUTO_INCREMENT,
  `ncc_id` int NOT NULL,
  `nhan_vien_id` int NOT NULL,
  `ngay_nhap` datetime DEFAULT CURRENT_TIMESTAMP,
  `tong_tien` decimal(38,2) NOT NULL,
  `ghi_chu` text,
  `da_xoa` bit(1) DEFAULT NULL,
  PRIMARY KEY (`phieu_nhap_id`),
  KEY `fk_pn_ncc` (`ncc_id`),
  KEY `fk_pn_nv` (`nhan_vien_id`),
  CONSTRAINT `fk_pn_ncc` FOREIGN KEY (`ncc_id`) REFERENCES `nha_cung_cap` (`ncc_id`),
  CONSTRAINT `fk_pn_nv` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`nhan_vien_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phieu_nhap`
--

LOCK TABLES `phieu_nhap` WRITE;
/*!40000 ALTER TABLE `phieu_nhap` DISABLE KEYS */;
INSERT INTO `phieu_nhap` VALUES (1,2,1,'2025-12-21 14:22:52',1100000.00,'Nhập hàng tháng 5',_binary '\0'),(2,2,1,'2025-12-21 14:26:30',1100000.00,'Nhập hàng tháng 5',_binary '\0'),(3,2,1,'2025-12-21 14:28:48',3000000.00,'Nhập sản phẩm mới',_binary ''),(4,4,1,'2025-12-21 21:09:46',2010000.00,'',_binary '\0');
/*!40000 ALTER TABLE `phieu_nhap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phong_chat`
--

DROP TABLE IF EXISTS `phong_chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phong_chat` (
  `phong_chat_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `nhan_vien_id` int DEFAULT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `trang_thai` enum('MO','DONG') DEFAULT 'MO',
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`phong_chat_id`),
  KEY `fk_chat_user` (`user_id`),
  KEY `fk_chat_nv` (`nhan_vien_id`),
  CONSTRAINT `fk_chat_nv` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`nhan_vien_id`),
  CONSTRAINT `fk_chat_user` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phong_chat`
--

LOCK TABLES `phong_chat` WRITE;
/*!40000 ALTER TABLE `phong_chat` DISABLE KEYS */;
INSERT INTO `phong_chat` VALUES (1,3,2,'Tư vấn lịch tiêm phòng','MO','2025-12-21 12:45:35');
/*!40000 ALTER TABLE `phong_chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `san_pham`
--

DROP TABLE IF EXISTS `san_pham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `san_pham` (
  `san_pham_id` int NOT NULL AUTO_INCREMENT,
  `danh_muc_id` int DEFAULT NULL,
  `ten_san_pham` varchar(255) NOT NULL,
  `mo_ta_chi_tiet` text,
  `gia` decimal(10,2) NOT NULL,
  `gia_giam` decimal(10,2) DEFAULT NULL,
  `so_luong_ton_kho` int DEFAULT '0',
  `hinh_anh` text,
  `da_xoa` tinyint(1) DEFAULT '0',
  `trong_luong` int DEFAULT NULL,
  `chi_dinh` text,
  `don_vi_tinh` varchar(255) DEFAULT NULL,
  `han_su_dung` date DEFAULT NULL,
  `so_lo` varchar(255) DEFAULT NULL,
  `thanh_phan` text,
  PRIMARY KEY (`san_pham_id`),
  KEY `fk_sp_danhmuc` (`danh_muc_id`),
  CONSTRAINT `fk_sp_danhmuc` FOREIGN KEY (`danh_muc_id`) REFERENCES `danh_muc_san_pham` (`danh_muc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `san_pham`
--

LOCK TABLES `san_pham` WRITE;
/*!40000 ALTER TABLE `san_pham` DISABLE KEYS */;
INSERT INTO `san_pham` VALUES (23,1,'Royal Canin Puppy','Thức ăn cho chó con từ 2–10 tháng tuổi',185000.00,NULL,100,'royal-canin-puppy.jpg',0,300,NULL,'gram','2026-12-31','RC001','Protein, vitamin, khoáng chất'),(24,1,'Pedigree Adult Beef','Thức ăn khô cho chó trưởng thành vị bò',170000.00,NULL,80,'pedigree-adult.jpg',0,400,NULL,'gram','2026-10-30','PD002','Thịt bò, ngũ cốc'),(25,2,'Whiskas Pate Cá Biển','Pate cho mèo vị cá biển',25000.00,NULL,200,'whiskas-pate.jpg',0,85,NULL,'gram','2026-08-20','WK003','Cá biển, vitamin'),(26,2,'Royal Canin Indoor','Thức ăn cho mèo nuôi trong nhà',190000.00,NULL,60,'royal-canin-indoor.jpg',0,400,NULL,'gram','2026-11-15','RC004','Protein, chất xơ'),(27,3,'NexGard Spectra','Viên nhai phòng ve, rận, giun tim cho chó',180000.00,NULL,50,'nexgard-spectra.jpg',0,20,NULL,'viên','2025-10-20','NG005','Afoxolaner'),(28,3,'Bio-Gentamicin','Thuốc nhỏ mắt, mũi, tai cho chó mèo',35000.00,NULL,120,'bio-gentamicin.jpg',0,10,NULL,'lọ','2026-12-31','BG006','Gentamicin'),(29,4,'Dây dắt chó tự động','Dây dắt chó dài 5m, chịu lực tốt',120000.00,NULL,40,'day-dat-cho.jpg',0,NULL,NULL,'cái',NULL,'PK007',NULL),(30,4,'Bát ăn inox','Bát ăn inox chống trượt cho chó mèo',45000.00,NULL,70,'bat-an-inox.jpg',0,NULL,NULL,'cái',NULL,'PK008',NULL),(31,5,'Bóng cao su cho chó','Đồ chơi giúp chó vận động, giảm stress',40000.00,NULL,90,'bong-cao-su.jpg',0,NULL,NULL,'cái',NULL,'DC009',NULL),(32,1,'Royal Canin Medium Adult','Thức ăn cho chó trưởng thành giống vừa',220000.00,NULL,60,'rc-medium-adult.jpg',0,500,NULL,'gram','2026-11-30',NULL,NULL),(33,1,'Royal Canin Maxi Adult','Thức ăn cho chó giống lớn',245000.00,NULL,50,'rc-maxi-adult.jpg',0,500,NULL,'gram','2026-12-31',NULL,NULL),(34,1,'SmartHeart Adult Lamb','Hạt cho chó trưởng thành vị cừu',165000.00,NULL,70,'smartheart-lamb.jpg',0,400,NULL,'gram','2026-10-15',NULL,NULL),(35,1,'Pedigree Puppy Chicken','Thức ăn cho chó con vị gà',155000.00,NULL,80,'pedigree-puppy.jpg',0,400,NULL,'gram','2026-09-20',NULL,NULL),(36,1,'Ganador Adult','Hạt cho chó trưởng thành giá phổ thông',135000.00,NULL,100,'ganador-adult.jpg',0,500,NULL,'gram','2026-08-30',NULL,NULL),(37,1,'Zenith Puppy','Thức ăn cao cấp cho chó con',290000.00,NULL,40,'zenith-puppy.jpg',0,500,NULL,'gram','2026-12-10',NULL,NULL),(38,1,'ANF 6Free Salmon','Thức ăn không ngũ cốc cho chó',320000.00,NULL,35,'anf-salmon.jpg',0,400,NULL,'gram','2026-11-05',NULL,NULL),(39,1,'Nutrience Original','Thức ăn chó cao cấp Canada',350000.00,NULL,30,'nutrience-dog.jpg',0,500,NULL,'gram','2026-12-25',NULL,NULL),(40,2,'Royal Canin Kitten','Thức ăn cho mèo con dưới 12 tháng',195000.00,NULL,70,'rc-kitten.jpg',0,400,NULL,'gram','2026-11-20',NULL,NULL),(41,2,'Royal Canin Hairball Care','Giảm búi lông cho mèo',210000.00,NULL,55,'rc-hairball.jpg',0,400,NULL,'gram','2026-12-15',NULL,NULL),(42,2,'Whiskas Adult Ocean Fish','Hạt mèo vị cá biển',125000.00,NULL,120,'whiskas-ocean.jpg',0,400,NULL,'gram','2026-09-30',NULL,NULL),(43,2,'Me-O Tuna','Thức ăn mèo vị cá ngừ',115000.00,NULL,150,'meo-tuna.jpg',0,400,NULL,'gram','2026-08-25',NULL,NULL),(44,2,'Catsrang Kitten','Hạt cho mèo con cao cấp',180000.00,NULL,65,'catsrang-kitten.jpg',0,400,NULL,'gram','2026-10-10',NULL,NULL),(45,2,'ANF 6Free Chicken','Thức ăn mèo không ngũ cốc',330000.00,NULL,40,'anf-cat.jpg',0,400,NULL,'gram','2026-12-01',NULL,NULL),(46,2,'Nutrience Indoor','Thức ăn cho mèo nuôi trong nhà',360000.00,NULL,35,'nutrience-cat.jpg',0,450,NULL,'gram','2026-12-28',NULL,NULL),(47,2,'Sheba Pate Cá Ngừ','Pate cao cấp cho mèo',32000.00,NULL,200,'sheba-tuna.jpg',0,85,NULL,'gram','2026-07-30',NULL,NULL),(48,3,'Bravecto','Viên nhai trị ve rận 12 tuần',550000.00,NULL,30,'bravecto.jpg',0,NULL,NULL,'viên','2026-05-15',NULL,NULL),(49,3,'Vime-Deworm','Thuốc tẩy giun sán chó mèo',25000.00,NULL,200,'vime-deworm.jpg',0,NULL,NULL,'viên','2027-01-01',NULL,NULL),(50,3,'Caldic','Viên bổ sung canxi',85000.00,NULL,80,'caldic.jpg',0,NULL,NULL,'hộp','2026-02-28',NULL,NULL),(51,3,'Nutri-Plus Gel','Gel dinh dưỡng cho thú cưng',160000.00,NULL,60,'nutri-plus.jpg',0,NULL,NULL,'tuýp','2025-08-08',NULL,NULL),(52,3,'Povidine 10%','Dung dịch sát trùng',15000.00,NULL,150,'povidine.jpg',0,NULL,NULL,'lọ','2028-01-01',NULL,NULL),(53,3,'Alkin Spray','Xịt sát khuẩn ngoài da',65000.00,NULL,90,'alkin.jpg',0,NULL,NULL,'chai','2026-09-15',NULL,NULL),(54,3,'Bio-Cat','Vitamin tổng hợp cho mèo',120000.00,NULL,70,'bio-cat.jpg',0,NULL,NULL,'lọ','2026-10-30',NULL,NULL),(55,3,'Hepatonic','Thuốc bổ gan cho chó mèo',180000.00,NULL,50,'hepatonic.jpg',0,NULL,NULL,'chai','2026-11-20',NULL,NULL),(56,4,'Vòng cổ da chó','Vòng cổ da cao cấp',75000.00,NULL,60,'vong-co-da.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(57,4,'Dây dắt phản quang','Dây dắt an toàn ban đêm',95000.00,NULL,50,'day-dat-phan-quang.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(58,4,'Khay vệ sinh mèo','Khay vệ sinh nhựa lớn',180000.00,NULL,40,'khay-ve-sinh.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(59,4,'Bình nước treo chuồng','Bình nước tự động',65000.00,NULL,70,'binh-nuoc.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(60,4,'Chuồng nhựa thú cưng','Chuồng nhựa size M',450000.00,NULL,20,'chuong-nhua.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(61,4,'Bát ăn đôi','Bát ăn đôi inox',90000.00,NULL,80,'bat-an-doi.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(62,4,'Áo chó mùa đông','Áo giữ ấm cho chó',120000.00,NULL,35,'ao-cho.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(63,4,'Lược chải lông','Lược chải lông chó mèo',55000.00,NULL,100,'luoc-long.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(64,5,'Bóng cao su phát âm','Bóng cao su kêu chíp',45000.00,NULL,90,'bong-keu.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(65,5,'Xương gặm cao su','Xương gặm cho chó',55000.00,NULL,85,'xuong-gam.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(66,5,'Chuột đồ chơi mèo','Chuột giả cho mèo vờn',30000.00,NULL,120,'chuot-meo.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(67,5,'Cần câu mèo','Cần câu có lông vũ',40000.00,NULL,100,'can-cau-meo.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(68,5,'Bóng lăn thông minh','Bóng tự lăn cho mèo',85000.00,NULL,60,'bong-lan.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(69,5,'Thú nhồi bông','Thú bông cho chó',65000.00,NULL,70,'thu-bong.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(70,5,'Đĩa bay cao su','Đĩa bay huấn luyện chó',50000.00,NULL,80,'dia-bay.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL),(71,5,'Đồ chơi gặm thừng','Thừng gặm răng cho chó',60000.00,NULL,75,'thung-gam.jpg',0,NULL,NULL,'cái',NULL,NULL,NULL);
/*!40000 ALTER TABLE `san_pham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `so_tiem_chung`
--

DROP TABLE IF EXISTS `so_tiem_chung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `so_tiem_chung` (
  `tiem_chung_id` int NOT NULL AUTO_INCREMENT,
  `thu_cung_id` int NOT NULL,
  `ten_vac_xin` varchar(255) NOT NULL,
  `ngay_tiem` date NOT NULL,
  `ngay_tai_chung` date DEFAULT NULL,
  `nhan_vien_id` int DEFAULT NULL,
  `ghi_chu` text,
  `lich_hen_id` int DEFAULT NULL,
  PRIMARY KEY (`tiem_chung_id`),
  KEY `fk_stc_thucung` (`thu_cung_id`),
  KEY `fk_stc_nhanvien` (`nhan_vien_id`),
  KEY `fk_stc_lichhen` (`lich_hen_id`),
  CONSTRAINT `fk_stc_lichhen` FOREIGN KEY (`lich_hen_id`) REFERENCES `lich_hen` (`lich_hen_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_stc_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`nhan_vien_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_stc_thucung` FOREIGN KEY (`thu_cung_id`) REFERENCES `thu_cung` (`thu_cung_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `so_tiem_chung`
--

LOCK TABLES `so_tiem_chung` WRITE;
/*!40000 ALTER TABLE `so_tiem_chung` DISABLE KEYS */;
/*!40000 ALTER TABLE `so_tiem_chung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thong_bao`
--

DROP TABLE IF EXISTS `thong_bao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thong_bao` (
  `thong_bao_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `loai_thong_bao` enum('DON_HANG','LICH_HEN','KHUYEN_MAI','HE_THONG') NOT NULL,
  `lien_ket` varchar(255) DEFAULT NULL,
  `da_doc` tinyint(1) DEFAULT '0',
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`thong_bao_id`),
  KEY `fk_tb_user` (`user_id`),
  CONSTRAINT `fk_tb_user` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thong_bao`
--

LOCK TABLES `thong_bao` WRITE;
/*!40000 ALTER TABLE `thong_bao` DISABLE KEYS */;
INSERT INTO `thong_bao` VALUES (1,1,'Đơn hàng đã được xác nhận','Đơn hàng #123 của bạn đã được cửa hàng xác nhận.','DON_HANG','/don-hang/123',1,'2025-12-21 15:52:52');
/*!40000 ALTER TABLE `thong_bao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thu_cung`
--

DROP TABLE IF EXISTS `thu_cung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thu_cung` (
  `thu_cung_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `ten_thu_cung` varchar(100) NOT NULL,
  `chung_loai` varchar(50) DEFAULT NULL,
  `giong_loai` varchar(100) DEFAULT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `gioi_tinh` varchar(10) DEFAULT NULL,
  `can_nang` decimal(5,2) DEFAULT NULL,
  `ghi_chu_suc_khoe` text,
  `hinh_anh` text,
  `is_active` bit(1) DEFAULT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `da_xoa` bit(1) DEFAULT NULL,
  PRIMARY KEY (`thu_cung_id`),
  KEY `fk_thucung_user` (`user_id`),
  CONSTRAINT `fk_thucung_user` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thu_cung`
--

LOCK TABLES `thu_cung` WRITE;
/*!40000 ALTER TABLE `thu_cung` DISABLE KEYS */;
INSERT INTO `thu_cung` VALUES (1,1,'Milu','Chó','Poodlee','2023-05-12','Đực',5.50,'Đã tiêm phòng dại, sức khỏe tốt','338664ae-4429-412c-a7aa-82ad694bd525.jpg',NULL,NULL,'2025-12-26 11:10:13.984905','2025-12-26 04:03:46',NULL),(2,1,'Luna','Mèo','ALN','2025-12-18','Cái',3.00,'Bình thường','0da0a074-680e-41d3-9c14-7a8ab6f12ca9.jpg',NULL,NULL,NULL,'2025-12-26 04:03:46',NULL),(3,3,'Max','Chó','Corgi',NULL,'Đực',9.10,NULL,NULL,NULL,NULL,NULL,'2025-12-26 04:03:46',NULL),(4,4,'Tom','Mèo','Ba tư',NULL,'Đực',4.00,NULL,NULL,NULL,NULL,NULL,'2025-12-26 04:03:46',NULL),(5,5,'Kiki','Chó','Chihuahua',NULL,'Cái',2.30,NULL,NULL,NULL,NULL,NULL,'2025-12-26 04:03:46',NULL),(6,6,'Leo','Mèo','Munchkin',NULL,'Đực',3.20,NULL,NULL,NULL,NULL,NULL,'2025-12-26 04:03:46',NULL),(7,7,'Bella','Chó','Golden',NULL,'Cái',18.50,NULL,NULL,NULL,NULL,NULL,'2025-12-26 04:03:46',NULL),(8,8,'Nana','Mèo','Xiêm',NULL,'Cái',3.50,NULL,NULL,NULL,NULL,NULL,'2025-12-26 04:03:46',NULL),(9,9,'Rocky','Chó','Bulldog',NULL,'Đực',20.00,NULL,NULL,NULL,NULL,NULL,'2025-12-26 04:03:46',NULL),(10,10,'Mimi','Mèo','ALN',NULL,'Cái',3.00,'','18d92af8-5950-4b00-b408-f78644cdc508.jpg',NULL,NULL,NULL,'2025-12-26 04:03:46',NULL),(12,1,'Ech','Chim','Chim','2025-12-01','Đực',2.50,'tốt','b8319cc6-d5fe-483a-8b2c-5003110f9779.jpg',NULL,NULL,NULL,'2025-12-26 04:03:46',NULL),(13,1,'Mimi','Mèo','Anh lông ngắn','2023-01-01','Cái',3.60,'Đã tiêm phòng đầy đủ','e7e61003-dab4-4172-ab73-f22e69b897cb.jpg',NULL,NULL,NULL,'2025-12-26 04:03:46',NULL),(14,1,'Kem','Chó','',NULL,'Đực',NULL,'','5e271f82-baa9-4c80-8690-a65b930fe132.jpg',NULL,NULL,NULL,'2026-01-16 08:38:39',NULL),(20,12,'kiki',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 03:30:12',NULL),(24,12,'Miki',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 04:22:04',NULL);
/*!40000 ALTER TABLE `thu_cung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tin_nhan`
--

DROP TABLE IF EXISTS `tin_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tin_nhan` (
  `tin_nhan_id` int NOT NULL AUTO_INCREMENT,
  `phong_chat_id` int NOT NULL,
  `nguoi_gui_id` int NOT NULL,
  `loai_nguoi_gui` enum('KHACH','NHAN_VIEN') NOT NULL,
  `noi_dung` text NOT NULL,
  `thoi_gian` datetime DEFAULT CURRENT_TIMESTAMP,
  `da_xem` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`tin_nhan_id`),
  KEY `fk_tn_phong` (`phong_chat_id`),
  CONSTRAINT `fk_tn_phong` FOREIGN KEY (`phong_chat_id`) REFERENCES `phong_chat` (`phong_chat_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tin_nhan`
--

LOCK TABLES `tin_nhan` WRITE;
/*!40000 ALTER TABLE `tin_nhan` DISABLE KEYS */;
INSERT INTO `tin_nhan` VALUES (1,1,3,'KHACH','Bác sĩ ơi cho em hỏi mèo 2 tháng tiêm được chưa?','2025-12-21 12:45:35',0),(2,1,2,'NHAN_VIEN','Chào bạn, mèo 2 tháng bắt đầu tiêm mũi 1 được rồi nhé.','2025-12-21 12:45:35',0);
/*!40000 ALTER TABLE `tin_nhan` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-28 20:07:33
