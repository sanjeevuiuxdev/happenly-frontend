import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import ThemeSwitcher from './ThemeSwitcher'

export default function AppNavbar(){
  const authed = !!localStorage.getItem('token')
  const logout = () => { localStorage.removeItem('token'); window.location.href = '/' }
  return (
    <Navbar expand="lg" bg="body" className="border-bottom">
      <Container>
        <Navbar.Brand href="/">Happennly!</Navbar.Brand>
        <Navbar.Toggle aria-controls="nav" />
        <Navbar.Collapse id="nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/events">Events</Nav.Link>
            <Nav.Link href="/ai">AI</Nav.Link>
            {authed && <Nav.Link href="/dashboard">Dashboard</Nav.Link>}
          </Nav>
          <div className="d-flex gap-2 align-items-center">
            <ThemeSwitcher />
            {authed ? (
              <Button variant="outline-danger" size="sm" onClick={logout}>Logout</Button>
            ) : (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/signup">Signup</Nav.Link>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}