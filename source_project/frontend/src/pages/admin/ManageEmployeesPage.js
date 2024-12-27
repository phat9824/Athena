import React, { useEffect, useState } from 'react'; 
import { useAppContext } from "../../AppContext.js";
import styles from "./ManageEmployeesPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";

const ManageEmployeesPage = () => {
    const { getCSRFToken, getCookie, baseUrl } = useAppContext();
    const [employees, setEmployees] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    // State cho tìm kiếm
    const [searchQuery, setSearchQuery] = useState('');

    // State cho form thay đổi mật khẩu (chỉ cần email và mật khẩu mới)
    const [emailForPass, setEmailForPass] = useState('');
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
                throw new Error(`Error fetching employees: ${response.status}`);
            }

            const res = await response.json();
            setEmployees(res);
        } catch (error) {
            setErrorMessage(error.message || "Có lỗi xảy ra khi tải danh sách nhân viên.");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
        // eslint-disable-next-line
    }, []);

    const addEmployee = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        const { EMAIL, PASSWORD, TENADMIN, SDT, DIACHI } = newEmployee;
        if (!EMAIL || !PASSWORD || !TENADMIN) {
            setErrorMessage("Vui lòng điền Email, Mật khẩu và Tên nhân viên!");
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

            setSuccessMessage("Nhân viên đã được thêm thành công!");
            setErrorMessage("");
            // Reset form
            setNewEmployee({ EMAIL: "", PASSWORD: "", TENADMIN: "", SDT: "", DIACHI: "" });
            // Refresh employee list
            fetchEmployees();
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleEditClick = (id) => {
        setEmployees(prev => 
            prev.map(emp => 
                emp.ID === id ? {...emp, isEditing: true, editingTENADMIN: emp.TENADMIN, editingSDT: emp.SDT, editingDIACHI: emp.DIACHI} : emp
            )
        );
    };

    const handleFieldChange = (id, field, value) => {
        setEmployees(prev => 
            prev.map(emp => emp.ID === id ? {...emp, [field]: value} : emp)
        );
    };

    const saveEmployeeInfo = async (id) => {
        setErrorMessage("");
        setSuccessMessage("");

        const emp = employees.find(e => e.ID === id);
        // Lấy ra các trường đang chỉnh sửa
        const { editingTENADMIN, editingSDT, editingDIACHI } = emp;
        if (!editingTENADMIN) {
            setErrorMessage("Tên nhân viên không thể để trống!");
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
                throw new Error(res.error || res.message || "Không thể cập nhật thông tin nhân viên.");
            }

            setSuccessMessage("Thông tin nhân viên đã được cập nhật thành công!");
            // Cập nhật state
            setEmployees(prev => 
                prev.map(e => e.ID === id
                    ? {
                        ...e,
                        TENADMIN: editingTENADMIN,
                        SDT: editingSDT,
                        DIACHI: editingDIACHI,
                        isEditing: false
                    }
                    : e
                )
            );
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    // Hàm cập nhật mật khẩu (chỉ cần EMAIL và NEW_PASSWORD)
    const updatePassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        // Kiểm tra trường bắt buộc
        if (!emailForPass || !newPass) {
            setErrorMessage("Vui lòng điền Email và Mật khẩu mới!");
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
                    NEW_PASSWORD: newPass
                }),
            });

            const res = await response.json();
            if (!response.ok) {
                throw new Error(res.error || res.message || "Không thể thay đổi mật khẩu.");
            }

            setSuccessMessage("Mật khẩu đã được cập nhật thành công!");
            setEmailForPass('');
            setNewPass('');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    // Lọc danh sách nhân viên theo từ khoá tìm kiếm
    const filteredEmployees = employees.filter(emp => {
        return (
            emp.EMAIL?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
            emp.TENADMIN?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
            emp.SDT?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
            emp.DIACHI?.toLowerCase()?.includes(searchQuery.toLowerCase())
        );
    });

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Quản lý nhân viên</h1>

            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

            {/* Ô tìm kiếm */}
            <div className={styles.searchSection}>
                <input
                    type="text"
                    placeholder="Tìm kiếm nhân viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {/* Danh sách nhân viên */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Tên nhân viên</th>
                        <th>Điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Trạng thái</th>
                        <th>Hình ảnh</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map(emp => (
                        <tr key={emp.ID}>
                            <td>{emp.ID}</td>
                            <td>{emp.EMAIL}</td>
                            <td>
                                {emp.isEditing ? (
                                    <input 
                                        value={emp.editingTENADMIN}
                                        onChange={(e) => handleFieldChange(emp.ID, 'editingTENADMIN', e.target.value)}
                                    />
                                ) : (
                                    emp.TENADMIN
                                )}
                            </td>
                            <td>
                                {emp.isEditing ? (
                                    <input
                                        value={emp.editingSDT || ''}
                                        onChange={(e) => handleFieldChange(emp.ID, 'editingSDT', e.target.value)}
                                    />
                                ) : (
                                    emp.SDT
                                )}
                            </td>
                            <td>
                                {emp.isEditing ? (
                                    <input
                                        value={emp.editingDIACHI || ''}
                                        onChange={(e) => handleFieldChange(emp.ID, 'editingDIACHI', e.target.value)}
                                    />
                                ) : (
                                    emp.DIACHI
                                )}
                            </td>
                            <td>{emp.TINHTRANG === 1 ? 'Hoạt động' : 'Khóa'}</td>
                            <td>
                                {emp.IMAGEURL ? (
                                    <img
                                        src={`${baseUrl}${emp.IMAGEURL}`}
                                        alt="Employee"
                                        className={styles.thumbnail}
                                    />
                                ) : 'Không có ảnh'}
                            </td>
                            <td>
                                {emp.isEditing ? (
                                    <button
                                        className={styles.iconButton}
                                        onClick={() => saveEmployeeInfo(emp.ID)}
                                    >
                                        <FontAwesomeIcon icon={faSave} />
                                    </button>
                                ) : (
                                    <button
                                        className={styles.iconButton}
                                        onClick={() => handleEditClick(emp.ID)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
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
                        placeholder="Mật khẩu"
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
                        placeholder="Điện thoại"
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

            {/* Form thay đổi mật khẩu (chỉ yêu cầu email và mật khẩu mới) */}
            <div className={styles.changePasswordSection}>
                <h2>Thay đổi mật khẩu nhân viên</h2>
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
                        placeholder="Mật khẩu mới"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        required
                    />
                    <button type="submit">Thay đổi mật khẩu</button>
                </form>
            </div>
        </div>
    );
};

export default ManageEmployeesPage;
