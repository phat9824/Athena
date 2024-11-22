<?php

class NhanVien{
    private $maNV, $tenNV, $soNgayLam, $luongNgay;
    
    public function Gan($maNV, $tenNV, $soNgayLam, $luongNgay){
        $this->maNV = $tenNV;
        $this->tenNV = $tenNV; 
        $this->soNgayLam = $soNgayLam;
        $this->luongNgay = $luongNgay;
    }

    public function InNhanVien() {
        echo "Mã nhân viên: {$this->maNV}\n";
        echo "Tên nhân viên: {$this->tenNV}\n";
        echo "Số ngày làm: {$this->soNgayLam}\n";
        echo "Lương ngày: {$this->luongNgay}\n";
    }

    // Phương thức tính lương tháng
    public function TinhLuong() {
        return $this->soNgayLam * $this->luongNgay;
    }
}

class NhanVienQL extends NhanVien{
    private $phucap = 2000;

    public function InNhanVien(){
        parent::InNhanVien();
        echo "Phụ cấp : {$this->phucap}\n";
    }
    public function TinhLuong(){
        return parent::TinhLuong() + $this->phucap;
    }
}

?>