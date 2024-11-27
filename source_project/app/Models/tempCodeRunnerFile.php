<?php
use App\Models\TaiKhoan;
$user = TaiKhoan::getUserByEmail('test@example.com');
dump($user);