import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaCog, FaSignOutAlt, FaUserShield } from 'react-icons/fa';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();

  console.log('Navigation - isAuthenticated:', isAuthenticated, 'user:', user);

  const handleLogout = () => {
    console.log('Navigation - logout clicked');
    logout();
    window.location.href = '/login';
  };

  const handleNavClick = (path) => {
    window.location.href = path;
  };

  if (!isAuthenticated) {
    console.log('Navigation - not authenticated, not rendering');
    return null;
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand 
          style={{ cursor: 'pointer' }}
          onClick={() => handleNavClick('/')}
        >
          Smart Office
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => handleNavClick('/')}>
              Dashboard
            </Nav.Link>
            <Nav.Link onClick={() => handleNavClick('/parking')}>
              Parking
            </Nav.Link>
            <Nav.Link onClick={() => handleNavClick('/conf-room')}>
              Conf Room Bookings
            </Nav.Link>
            {user?.role === 'ADMIN' && (
              <Nav.Link onClick={() => handleNavClick('/admin')}>
                <FaUserShield className="me-1" />
                Administration
              </Nav.Link>
            )}
          </Nav>
          
          <Nav>
            <NavDropdown 
              title={
                <span>
                  <FaUser className="me-1" />
                  {user?.name || 'User'}
                </span>
              } 
              id="user-dropdown"
            >
              <NavDropdown.Item>
                <FaUser className="me-2" />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item>
                <FaCog className="me-2" />
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
