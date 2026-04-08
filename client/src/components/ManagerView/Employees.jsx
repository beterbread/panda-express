import './styles/Employees.css';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { PageContext } from './ManagerView';
import './styles/Employees.css'; 
import { Translate } from '../Translation/TranslationWrapper';

function Employees() {
    const { setPage } = useContext(PageContext);
    useEffect(() => {
    setPage("employees");
    }, []);
    const [employees, setEmployees] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        employee_id: "",
        employee_name: "",
        is_manager: false
    });

    // State for editing
    const [editEmployeeId, setEditEmployeeId] = useState(null);
    const [updatedEmployee, setUpdatedEmployee] = useState({
        employee_name: "",
        is_manager: false
    });

    useEffect(() => {
        async function fetchEmployees() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/manager/employee/get`);
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        }
        fetchEmployees();
    }, []);

    // Handle input changes for adding a new employee
    const handleNewInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setNewEmployee((prevEmployee) => ({ ...prevEmployee, [name]: inputValue }));
    };

    // Handle adding a new employee
    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/manager/employee/add`, newEmployee);
            setEmployees((prevEmployees) => [...prevEmployees, response.data]);
            setNewEmployee({ employee_id: "", employee_name: "", is_manager: false });
            setIsFormVisible(false); // Hide the form after adding the employee
        } catch (error) {
            console.error("Error adding employee:", error);
            alert("Failed to add employee.");
        }
    };

    // Toggle the visibility of the add new employee form
    const toggleFormVisibility = () => {
        setIsFormVisible((prevVisibility) => !prevVisibility);
    };

    // Handle clicking the "Edit" button
    const handleEditClick = (employee) => {
        setEditEmployeeId(employee.employee_id);
        setUpdatedEmployee({ ...employee });
    };

    // Handle input changes when editing an employee
    const handleEditInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setUpdatedEmployee((prevEmployee) => ({ ...prevEmployee, [name]: inputValue }));
    };

    // Handle saving the edited employee
    const handleSaveClick = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/manager/employee/update`, updatedEmployee);
            setEmployees((prevEmployees) =>
                prevEmployees.map((employee) =>
                    employee.employee_id === updatedEmployee.employee_id ? updatedEmployee : employee
                )
            );
            setEditEmployeeId(null);
        } catch (error) {
            console.error("Error updating employee:", error);
            alert("Failed to update employee.");
        }
    };

    // Handle canceling the edit
    const handleCancelClick = () => {
        setEditEmployeeId(null);
    };

    return (
        <div className="container" id='employees-container'>
            <h3 className='pageTitle'><Translate>Employees</Translate></h3>

            <table className='table-container' id="employee-table">
                <tbody>
                    <thead className='table-header'>
                        <tr>
                            <th><Translate>Employee ID</Translate></th>
                            <th><Translate>Employee Name</Translate></th>
                            <th><Translate>Is Manager</Translate></th>
                            <th><Translate>Actions</Translate></th>
                        </tr>
                    </thead>
                    {employees.map((employee, index) => (
                        <tr key={index}>
                            {editEmployeeId === employee.employee_id ? (
                                // Render input fields for editing
                                <>
                                    <td>{employee.employee_id}</td>
                                    <td>
                                        <input
                                            className='edit-table-input'
                                            type="text"
                                            name="employee_name"
                                            value={updatedEmployee.employee_name}
                                            onChange={handleEditInputChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className='edit-table-input'
                                            type="checkbox"
                                            name="is_manager"
                                            checked={updatedEmployee.is_manager}
                                            onChange={handleEditInputChange}
                                        />
                                    </td>
                                    <td>
                                        <button className='smaller-buttons-black' onClick={handleSaveClick}><Translate>Save</Translate></button>
                                        <button className='smaller-buttons-black' onClick={handleCancelClick}><Translate>Cancel</Translate></button>
                                    </td>
                                </>
                            ) : (
                                // Render regular row
                                <>
                                    <td>{employee.employee_id}</td>
                                    <td>{employee.employee_name}</td>
                                    <td><Translate>{employee.is_manager ? "Yes" : "No"}</Translate></td>
                                    <td>
                                        <button className='smaller-buttons-black' onClick={() => handleEditClick(employee)}><Translate>Edit</Translate></button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    {isFormVisible && (
                        <tr>
                            <td colSpan="4">
                                <form onSubmit={handleAddEmployee} className="employee-form">
                                    <input
                                        type="text"
                                        name="employee_id"
                                        placeholder="Employee ID"
                                        value={newEmployee.employee_id}
                                        onChange={handleNewInputChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="employee_name"
                                        placeholder="Employee Name"
                                        value={newEmployee.employee_name}
                                        onChange={handleNewInputChange}
                                        required
                                    />
                                    <label>
                                        <Translate>Is Manager:</Translate>
                                        <input
                                            type="checkbox"
                                            name="is_manager"
                                            checked={newEmployee.is_manager}
                                            onChange={handleNewInputChange}
                                        />
                                    </label>
                                    <button className='smaller-buttons-black' type="submit"><Translate>Add</Translate></button>
                                </form>
                                
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button onClick={toggleFormVisibility} className='default-button-black' id="add-employee-button">
                <Translate>{isFormVisible ? "Cancel" : "Add New Employee"}</Translate>
            </button>
        </div>
    );
}

export default Employees;
