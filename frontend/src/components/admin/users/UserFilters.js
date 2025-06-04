import React from 'react';
import {Col, Form, InputGroup, Row} from 'react-bootstrap';
import {FaSearch} from 'react-icons/fa';

const UserFilters = ({filters, onFiltersChange}) => {
    const roles = ['EMPLOYEE', 'MANAGER', 'VIP', 'VISITOR', 'CONTRACTOR', 'ADMIN'];

    const handleSearchChange = (e) => {
        onFiltersChange({...filters, search: e.target.value});
    };

    const handleRoleChange = (e) => {
        onFiltersChange({...filters, role: e.target.value});
    };

    return (
        <Row className="mb-3">
            <Col md={8}>
                <InputGroup>
                    <InputGroup.Text>
                        <FaSearch/>
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Search users by name or email..."
                        value={filters.search}
                        onChange={handleSearchChange}
                    />
                </InputGroup>
            </Col>
            <Col md={4}>
                <Form.Select value={filters.role} onChange={handleRoleChange}>
                    <option value="">All Roles</option>
                    {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </Form.Select>
            </Col>
        </Row>
    );
};

export default UserFilters;