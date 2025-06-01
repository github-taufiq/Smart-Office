import React from 'react';
import { Navbar, Nav, Container, Breadcrumb } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';
import { FaCar, FaPlus, FaChartBar, FaHome } from 'react-icons/fa';

const Navigation = () => {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [{ name: 'Home', path: '/', icon: <FaHome /> }];

    if (path.includes('/parking')) {
      breadcrumbs.push({ name: 'Parking Management', path: '/parking' });
    }
    if (path.includes('/add-parking')) {
      breadcrumbs.push({ name: 'Add Parking', path: '/add-parking' });
    }
    if (path.includes('/reports')) {
      breadcrumbs.push({ name: 'Reports', path: '/reports' });
    }

    return breadcrumbs;
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand href="/">
            <FaCar className="me-2" />
            Smart Office - Parking System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/parking">
                <Nav.Link>
                  <FaCar className="me-1" />
                  Parking Slots
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/add-parking">
                <Nav.Link>
                  <FaPlus className="me-1" />
                  Add Parking
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/reports">
                <Nav.Link>
                  <FaChartBar className="me-1" />
                  Reports
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Breadcrumb>
          {getBreadcrumbs().map((crumb, index) => (
            <LinkContainer key={index} to={crumb.path}>
              <Breadcrumb.Item active={index === getBreadcrumbs().length - 1}>
                {crumb.icon && <span className="me-1">{crumb.icon}</span>}
                {crumb.name}
              </Breadcrumb.Item>
            </LinkContainer>
          ))}
        </Breadcrumb>
      </Container>
    </>
  );
};

export default Navigation;