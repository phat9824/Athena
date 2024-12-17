import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { useAppContext } from '../../AppContext';
import { Chart as ChartJS } from 'chart.js/auto';
import styles from "./AdminDashboardPage.module.css"; // Import CSS Module

const AdminDashboardPage = () => {
  const { baseUrl } = useAppContext();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [chartData, setChartData] = useState(null);
  const [totals, setTotals] = useState({ total_revenue: 0, total_quantity: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [topProducts, setTopProducts] = useState([]); // New state for top 3 products

  // Fetch danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/danhmucts`);
        const data = await response.json();
        setCategoryOptions(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    };
    fetchCategories();
  }, [baseUrl]);

  const fetchStatistics = async () => {
    if (!startDate || !endDate) {
      alert('Vui lòng chọn ngày bắt đầu và ngày kết thúc.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}/api/thongke?startDate=${startDate}&endDate=${endDate}&categoryId=${categoryId}`);
      const data = await response.json();

      const productSales = data.productSales;
      const labels = productSales.map(item => item.TENTS);
      const salesData = productSales.map(item => item.total_quantity);

      const dailySales = data.dailySales;
      const dailyLabels = dailySales.map(item => item.NGAYLAPHD);
      const dailyData = dailySales.map(item => Math.round(item.total_quantity));

      setTotals(data.totals[0]); // Tổng doanh thu và số lượng

      // Set chart data
      setChartData({
        pieChart: {
          labels: labels,
          datasets: [
            {
              label: 'Số lượng bán ra',
              data: salesData,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66FF66', '#9966FF'],
            },
          ],
        },
        barChart: {
          labels: dailyLabels,
          datasets: [
            {
              label: 'Số lượng bán ra mỗi ngày',
              data: dailyData,
              backgroundColor: '#36A2EB',
            },
          ],
        },
      });

      // Set top 3 products data
      setTopProducts(data.topProducts);

    } catch (error) {
      console.error('Lỗi khi lấy thống kê:', error);
      alert('Đã xảy ra lỗi khi tải dữ liệu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>THỐNG KÊ SẢN PHẨM BÁN RA VÀ DOANH THU</h1>

      {/* Form để chọn ngày và danh mục */}
      <form className={styles.formContainer}>
        <div className={styles.selectContainer}>
          <select
            className={styles.customSelect} // Áp dụng lớp từ CSS Module
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categoryOptions.map((category) => (
              <option key={category.MADM} value={category.MADM}>
                {category.TENDM}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.datePickerContainer}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.datePickerInput}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.datePickerInput}
          />
          <button 
            type="button" 
            className={styles.buttonFetch} // Áp dụng lớp từ CSS Module
            onClick={fetchStatistics} 
            disabled={isLoading}
          >
            {isLoading ? 'Đang tải...' : 'Xem thống kê'}
          </button>
        </div>
      </form>

      {/* Top 3 sản phẩm bán chạy nhất */}
      {topProducts.length > 0 && (
      <div className={styles.topProductsContainer}>
        <h2 className={styles.topProductsTitle}>Top 3 Sản Phẩm Bán Chạy Nhất</h2>
        <div className={styles.topProductsList}>
          {topProducts.map((product, index) => (
            <div key={index} className={styles.topProductCard}>
              <img
                src={`${baseUrl}${product.IMAGEURL}`} // Dùng baseUrl cộng với URL của ảnh
                alt={product.TENTS} // Đặt alt text cho ảnh
                className={styles.productImage} // Áp dụng class CSS cho ảnh
              />
              <div className={styles.productInfo}>
                <p className={styles.productName}>{product.TENTS}</p>
                <p className={styles.productSales}>Số lượng bán ra: {product.total_quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
    
      {/* Tổng doanh thu và số lượng sản phẩm */}
      <div className={styles.totalsContainer}>
        <div className={styles.totalCard1}>
          <h3>Tổng Doanh Thu</h3>
          <p>{totals.total_revenue ? totals.total_revenue.toLocaleString('vi-VN') + " VND" : 0 + " VND"}</p>
        </div>
        <div className={styles.totalCard2}>
          <h3>Tổng Số Sản Phẩm Bán Ra</h3>
          <p>{totals.total_quantity || 0}</p>
        </div>
      </div>

      {/* Biểu đồ */}
      {chartData && (
        <div className={styles.chartsRow}>
          <div className={styles.chartContainer}>
            <h2 className={styles.chartTitle}>Biểu đồ tròn thể hiện số lượng bán ra</h2>
            <Pie data={chartData.pieChart} />
          </div>
          <div className={styles.chartContainer}>
            <h2 className={styles.chartTitle}>Biểu đồ cột thể hiện số lượng bán ra theo ngày</h2>
            <Bar data={chartData.barChart} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
