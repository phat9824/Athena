<?php
class Sach {
    private $maSach, $tenSach, $gia;
    private $soLuong, $nhaXuatBan;

    public function __construct($ma, $ten, $gia, $soLuong, $nhaXuatBan) {
        $this->maSach = $ma;
        $this->tenSach = $ten;
        $this->gia = $gia;
        $this->soLuong = $soLuong;
        $this->nhaXuatBan = $nhaXuatBan;
    }

    public function tinhTongTien() {
        return $this->soLuong * $this->gia;
    }
}

class TieuThuyet extends Sach {
    private $tinhTrang;

    public function __construct($ma, $ten, $gia, $soLuong, $nhaXuatBan, $tinhTrang) {
        parent::__construct($ma, $ten, $gia, $soLuong, $nhaXuatBan);
        $this->tinhTrang = $tinhTrang;
    }

    public function tinhTongTien() {
        if ($this->tinhTrang == 'cu') {
            return parent::tinhTongTien();
        } else {
            return parent::tinhTongTien() * 0.2;
        }
    }

    public function loaiSach() {
        return "Tiểu thuyết";
    }
}

class TrinhTham extends Sach {
    private $thue;

    public function __construct($ma, $ten, $gia, $soLuong, $nhaXuatBan, $thue) {
        parent::__construct($ma, $ten, $gia, $soLuong, $nhaXuatBan);
        $this->thue = $thue;
    }

    public function tinhTongTien() {
        return parent::tinhTongTien() + $this->thue;
    }

    public function loaiSach() {
        return "Trinh thám";
    }
}

$sach = array(
    new TieuThuyet("TT001", "Nhà giả kim", 150000, 8, "Nhà xuất bản Paulo Coelho", "mới"),
    new TieuThuyet("TT002", "Kiêu hãnh và định kiến", 180000, 15, "Nhà xuất bản Jane Austen", "cu"),
    new TieuThuyet("TT003", "Rừng Nauy", 220000, 10, "Nhà xuất bản Haruki Murakami", "mới"),
    new TieuThuyet("TT004", "Giết con chim nhại", 175000, 5, "Nhà xuất bản Harper Lee", "cu"),
    new TieuThuyet("TT005", "Người đua diều", 200000, 20, "Nhà xuất bản Khaled Hosseini", "mới"),
    new TrinhTham("TTT001", "Cô gái có hình xăm rồng", 140000, 30, "Nhà xuất bản Stieg Larsson", 25000),
    new TrinhTham("TTT002", "Cô gái mất tích", 120000, 25, "Nhà xuất bản Gillian Flynn", 20000),
    new TrinhTham("TTT003", "Những câu chuyện của Sherlock Holmes", 160000, 12, "Nhà xuất bản Arthur Conan Doyle", 30000),
    new TrinhTham("TTT004", "Chim ưng Maltese", 130000, 40, "Nhà xuất bản Dashiell Hammett", 15000),
    new TrinhTham("TTT005", "Trong khu rừng", 110000, 20, "Nhà xuất bản Tana French", 18000),
);

$soLuongTieuThuyet = 0; $tongTienTieuThuyet = 0;
$soLuongTrinhTham = 0; $tongTienTrinhTham = 0;

for ($i = 0; $i < count($sach); $i++) {
    if ($sach[$i]->loaiSach() == "Tiểu thuyết") {
        $soLuongTieuThuyet += 1;
        $tongTienTieuThuyet += $sach[$i]->tinhTongTien();
    } else {
        $soLuongTrinhTham += 1;
        $tongTienTrinhTham += $sach[$i]->tinhTongTien();
    }
}

echo "Số lượng Tiểu thuyết: " . $soLuongTieuThuyet . " - Tổng tiền Tiểu thuyết: " . $tongTienTieuThuyet . " vnđ";
echo "<br>";
echo "Số lượng Trinh thám: " . $soLuongTrinhTham . " - Tổng tiền Trinh thám: " . $tongTienTrinhTham . " vnđ";
