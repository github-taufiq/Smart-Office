import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa';
import UserList from './users/UserList';
import UserModal from './users/UserModal';
import UserFilters from './users/UserFilters';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filters, setFilters] = useState({ search: '', role: '' });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Mock data - replace with actual API call
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@company.com', role: 'EMPLOYEE', department: 'IT' },
        { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'MANAGER', department: 'HR' },
        { id: 3, name: 'Bob Wilson', email: 'bob@company.com', role: 'ADMIN', department: 'IT' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      showAlert('Error fetching users', 'danger');
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...userData } : user
        ));
        showAlert('User updated successfully', 'success');
      } else {
        const newUser = { ...userData, id: Date.now() };
        setUsers([...users, newUser]);
        showAlert('User created successfully', 'success');
      }
      setShowModal(false);
      setEditingUser(null);
    } catch (error) {
      showAlert('Error saving user', 'danger');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      showAlert('User deleted successfully', 'success');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>User Management</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaUserPlus className="me-2" />
          Add User
        </Button>
      </div>

      {alert && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <UserFilters filters={filters} onFiltersChange={setFilters} />
      
      <UserList 
        users={users}
        filters={filters}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      <UserModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />
    </div>
  );
};

export default UserManagement;