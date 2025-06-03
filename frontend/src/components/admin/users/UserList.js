import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const UserList = ({ users, filters, onEdit, onDelete }) => {
  const getRoleBadgeVariant = (role) => {
    const variants = {
      'ADMIN': 'danger',
      'MANAGER': 'primary',
      'VIP': 'warning',
      'EMPLOYEE': 'success',
      'VISITOR': 'info',
      'CONTRACTOR': 'secondary'
    };
    return variants[role] || 'secondary';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         user.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchesRole = !filters.role || user.role === filters.role;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div className="mb-2 text-muted">
        Showing {filteredUsers.length} of {users.length} users
      </div>
      
      <Table responsive striped hover>
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
              </td>
              <td>{user.department || '-'}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(user)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(user.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default UserList;