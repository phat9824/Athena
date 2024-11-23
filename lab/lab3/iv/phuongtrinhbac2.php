<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Calculator</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }

        th,
        td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
</head>

<body>
    <form method="GET" action="">
        <table border="1" style="border-collapse: collapse;">
            <tr>
                <td>Hệ số a</td>
                <td><input type="text" name="a"></td>
            </tr>
            <tr>
                <td>Hệ số b</td>
                <td><input type="text" name="b"></td>
            </tr>
            <tr>
                <td>Hệ số c</td>
                <td><input type="text" name="c"></td>
            </tr>
            <tr>
                <td colspan="2" style=="text-align: center;">
                    <input type="submit" name="solve" value="Giải">
                </td>
            </tr>

            <tr colspan="2">
                <td colspan="2">
                    <div>
                        <?php

                        function solve($a, $b, $c): void
                        {
                            // Xử lý trường hợp a = 0 (phương trình bậc 1)
                            if ($a == 0) {
                                if ($b == 0) {
                                    echo $c == 0 ? "Phương trình vô số nghiệm." : "Phương trình vô nghiệm.";
                                } else {
                                    $x = -$c / $b;
                                    echo "Phương trình có nghiệm duy nhất: x = " . $x;
                                }
                            } else {
                                // Phương trình bậc 2: ax^2 + bx + c = 0
                                $delta = $b * $b - 4 * $a * $c;
                                if ($delta < 0) {
                                    echo "Phương trình vô nghiệm";
                                } else if ($delta == 0) {
                                    $x = -$b / (2 * $a);
                                    echo "Phương trình có nghiệm kép: x1 = x2 = " . $x;
                                } else {
                                    $x1 = (-$b + sqrt($delta)) / (2 * $a);
                                    $x2 = (-$b - sqrt($delta)) / (2 * $a);
                                    echo "Phương trình có hai nghiệm phân biệt: x1 = $x1, x2 = $x2";
                                }
                            }
                        }


                        if (isset($_GET['solve'])) {
                            // Lấy các giá trị từ form
                            $a = $_GET['a'];
                            $b = $_GET['b'];
                            $c = $_GET['c'];


                            // Kiểm tra giá trị nhập vào
                            if (is_numeric($a) && is_numeric($b) && is_numeric($c)) {
                                $a = floatval($a);
                                $b = floatval($b);
                                $c = floatval($c);

                                solve($a, $b, $c);
                            } else {
                                echo "Vui lòng nhập các số hợp lệ cho hệ số a, b và c.";
                            }
                        }
                        ?>
                    </div>
                </td>
            </tr>


        </table>

    </form>
</body>