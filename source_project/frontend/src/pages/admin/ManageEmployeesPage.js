// src/pages/admin/ManageEmployeesPage.js
import React, { useEffect, useState } from 'react';
import { useAppContext } from "../../AppContext.js";
import styles from "./ManageEmployeesPage.module.css";

const ManageEmployeesPage = () => {
    const { getCSRFToken, getCookie, baseUrl } = useAppContext();
    const [employees, setEmployees] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    // State cho form đổi mật khẩu
    const [emailForPass, setEmailForPass] = useState('');
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');

    const [newEmployee, setNewEmployee] = useState({
        EMAIL: "",
        PASSWORD: "",
        TENADMIN: "",
        SDT: "",
        DIACHI: ""
    });

    const fetchEmployees = async () => {
        if (isFetching) return;
        setIsFetching(true);

        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(`${baseUrl}/api/admin/employees`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Lỗi khi lấy danh sách nhân viên: ${response.status}`);
            }

            const res = await response.json();
            setEmployees(res);
        } catch (error) {
            setErrorMessage(error.message || "Đã xảy ra lỗi khi lấy danh sách nhân viên.");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const addEmployee = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        const { EMAIL, PASSWORD, TENADMIN, SDT, DIACHI } = newEmployee;
        if (!EMAIL || !PASSWORD || !TENADMIN) {
            setErrorMessage("Vui lòng điền đủ Email, Password, Tên nhân viên!");
            return;
        }

        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(`${baseUrl}/api/admin/employees/create`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                },
                credentials: "include",
                body: JSON.stringify({ EMAIL, PASSWORD, TENADMIN, SDT, DIACHI }),
            });

            const res = await response.json();
            if (!response.ok) {
                throw new Error(res.error || res.message || "Không thể thêm nhân viên.");
            }

            setSuccessMessage("Thêm nhân viên thành công!");
            setErrorMessage("");
            // Reset form
            setNewEmployee({ EMAIL: "", PASSWORD: "", TENADMIN: "", SDT: "", DIACHI: "" });
            // Refresh danh sách nhân viên
            fetchEmployees();
        } catch (error) {
            setErrorMessage(error.message);
        }
    };




    const handleEditClick = (id) => {
        setEmployees(prev => prev.map(emp => emp.ID === id ? {...emp, isEditing: true} : emp));
    }

    const handleFieldChange = (id, field, value) => {
        setEmployees(prev => prev.map(emp => emp.ID === id ? {...emp, [field]: value} : emp));
    }

    const saveEmployeeInfo = async (id) => {
        setErrorMessage("");
        setSuccessMessage("");

        const emp = employees.find(e => e.ID === id);
        const { editingTENADMIN, editingSDT, editingDIACHI } = emp;
        if (!editingTENADMIN) {
            setErrorMessage("Tên nhân viên không được để trống!");
            return;
        }

        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(`${baseUrl}/api/admin/employees/update-info`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                },
                credentials: "include",
                body: JSON.stringify({
                    ID: id,
                    TENADMIN: editingTENADMIN,
                    SDT: editingSDT,
                    DIACHI: editingDIACHI
                }),
            });

            const res = await response.json();
            if (!response.ok) {
                throw new Error(res.error || res.message || "Không thể cập nhật thông tin.");
            }

            setSuccessMessage("Cập nhật thông tin thành công!");
            // Cập nhật state
            setEmployees(prev => prev.map(e => e.ID === id ? {...e, TENADMIN: editingTENADMIN, SDT: editingSDT, DIACHI: editingDIACHI, isEditing: false} : e));
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    const updatePassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!emailForPass || !oldPass || !newPass) {
            setErrorMessage("Vui lòng nhập đủ Email, Mật khẩu cũ, Mật khẩu mới!");
            return;
        }

        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(`${baseUrl}/api/admin/employees/update-password`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                },
                credentials: "include",
                body: JSON.stringify({
                    EMAIL: emailForPass,
                    OLD_PASSWORD: oldPass,
                    NEW_PASSWORD: newPass
                }),
            });

            const res = await response.json();
            if (!response.ok) {
                throw new Error(res.error || res.message || "Không thể cập nhật mật khẩu.");
            }

            setSuccessMessage("Cập nhật mật khẩu thành công!");
            setEmailForPass('');
            setOldPass('');
            setNewPass('');
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Quản lý nhân viên</h1>

            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

            {/* Bảng danh sách nhân viên */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Tên nhân viên</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Tình trạng</th>
                        <th>Ảnh</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.ID}>
                            <td>{emp.ID}</td>
                            <td>{emp.EMAIL}</td>
                            <td>
                                {emp.isEditing ? (
                                    <input 
                                        value={emp.editingTENADMIN}
                                        onChange={(e) => handleFieldChange(emp.ID, 'editingTENADMIN', e.target.value)}
                                    />
                                ) : emp.TENADMIN}
                            </td>
                            <td>
                                {emp.isEditing ? (
                                    <input
                                        value={emp.editingSDT || ''}
                                        onChange={(e) => handleFieldChange(emp.ID, 'editingSDT', e.target.value)}
                                    />
                                ) : emp.SDT}
                            </td>
                            <td>
                                {emp.isEditing ? (
                                    <input
                                        value={emp.editingDIACHI || ''}
                                        onChange={(e) => handleFieldChange(emp.ID, 'editingDIACHI', e.target.value)}
                                    />
                                ) : emp.DIACHI}
                            </td>
                            <td>{emp.TINHTRANG === 1 ? 'Hoạt động' : 'Đã khóa'}</td>
                            <td>
                                {emp.IMAGEURL ? (
                                    <img src={`${baseUrl}${emp.IMAGEURL}`} alt="Employee" className={styles.thumbnail}/>
                                ) : 'Chưa có ảnh'}
                            </td>
                            <td>
                                {emp.isEditing ? (
                                    <button onClick={() => saveEmployeeInfo(emp.ID)}>Lưu</button>
                                ) : (
                                    <button onClick={() => handleEditClick(emp.ID)}>Chỉnh sửa</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>



            {/* Form thêm nhân viên mới */}
            <div className={styles.addEmployeeSection}>
                <h2>Thêm nhân viên mới</h2>
                <form onSubmit={addEmployee} className={styles.addEmployeeForm}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={newEmployee.EMAIL}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, EMAIL: e.target.value }))}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newEmployee.PASSWORD}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, PASSWORD: e.target.value }))}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Tên nhân viên"
                        value={newEmployee.TENADMIN}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, TENADMIN: e.target.value }))}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Số điện thoại"
                        value={newEmployee.SDT}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, SDT: e.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="Địa chỉ"
                        value={newEmployee.DIACHI}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, DIACHI: e.target.value }))}
                    />
                    <button type="submit">Thêm</button>
                </form>
            </div>

            {/* Form đổi mật khẩu */}
            <div className={styles.changePasswordSection}>
                <h2>Đổi mật khẩu nhân viên</h2>
                <form onSubmit={updatePassword} className={styles.changePassForm}>
                    <input 
                        type="email"
                        placeholder="Email"
                        value={emailForPass}
                        onChange={(e) => setEmailForPass(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu cũ"
                        value={oldPass}
                        onChange={(e) => setOldPass(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu mới"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        required
                    />
                    <button type="submit">Đổi mật khẩu</button>
                </form>
            </div>


        </div>
    );
};

export default ManageEmployeesPage;
