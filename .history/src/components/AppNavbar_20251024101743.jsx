// src/components/AppNavbar.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Button, Badge } from 'react-bootstrap';
import ThemeSwitcher from './ThemeSwitcher';

function readUser() {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); }
  catch { return null; }
}

export default function AppNavbar() {
  const [user, setUser] = useState(readUser());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sync = () => setUser(readUser());
    window.addEventListener('storage', sync);
    window.addEventListener('auth:changed', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('auth:changed', sync);
    };
  }, []);

  const isAdmin = user?.role === 'admin';

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('auth:changed'));
    if (location.pathname.startsWith('/dashboard')) navigate('/');
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <Navbar expand="md" bg="body" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">Happennly!</Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/events">Events</Nav.Link>
            <Nav.Link as={Link} to="/ai">AI</Nav.Link>
            {isAdmin && (
              <Nav.Link as={Link} to="/dashboard">
                Dashboard <Badge bg="secondary" pill>Admin</Badge>
              </Nav.Link>
            )}
          </Nav>

          <Nav className="ms-auto align-items-center">
           
            <ThemeSwitcher />

            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-secondary" size="sm">
                  Hi, {displayName}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header>
                    <div className="fw-semibold">{displayName}</div>
                    <div className="small text-muted">{user?.email}</div>
                    {isAdmin && <Badge bg="primary" className="mt-2">Admin</Badge>}
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logout} className="text-danger">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-secondary" size="sm" className="me-2">
                  Login
                </Button>
                <Button as={Link} to="/signup" variant="primary" size="sm">
                  Signup
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
