import React, {useState} from 'react';
import {Alert, Button, Card, Col, Container, Form, Row, Spinner} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

const Register = () => {
    const {register, loading} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        officeId: 1
    });
    const [message, setMessage] = useState({type: '', text: ''});

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({type: '', text: ''});

        if (formData.password !== formData.confirmPassword) {
            setMessage({type: 'danger', text: 'Passwords do not match'});
            return;
        }

        const {confirmPassword, ...registrationData} = formData;
        const result = await register(registrationData);

        if (result.success) {
            setMessage({type: 'success', text: 'Registration successful! Please login.'});
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setMessage({type: 'danger', text: result.error});
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow">
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h2>Create Account</h2>
                                <p className="text-muted">Join Smart Office</p>
                            </div>

                            {message.text && (
                                <Alert variant={message.type} className="mb-3">
                                    {message.text}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Department</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        placeholder="Enter your department"
                                        required
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Enter password"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="Confirm password"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner size="sm" className="me-2"/>
                                            Creating account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </Form>

                            <div className="text-center mt-3">
                                <p className="mb-0">
                                    Already have an account? <Link to="/login">Sign in</Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
