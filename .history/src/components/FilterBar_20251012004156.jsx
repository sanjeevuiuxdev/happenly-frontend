import { Row, Col, Form } from 'react-bootstrap'

export default function FilterBar({ filters, setFilters }){
  const update = (k,v)=> setFilters(prev=>({...prev,[k]:v}))
  return (
    <Form className="mb-3">
      <Row className="g-2">
        <Col md>
          <Form.Control placeholder="Search keywords" value={filters.q||''} onChange={e=>update('q', e.target.value)} />
        </Col>
        <Col md>
          <Form.Select value={filters.department||''} onChange={e=>update('department', e.target.value)}>
            <option value="">All Departments</option>
            <option>CS</option><option>ECE</option><option>ME</option>
          </Form.Select>
        </Col>
        <Col md>
          <Form.Select value={filters.type||''} onChange={e=>update('type', e.target.value)}>
            <option value="">All Types</option>
            <option value="talk">Talk</option>
            <option value="workshop">Workshop</option>
            <option value="contest">Contest</option>
          </Form.Select>
        </Col>
        <Col md>
          <Form.Select value={filters.sort||'startAt'} onChange={e=>update('sort', e.target.value)}>
            <option value="startAt">Date</option>
            <option value="popularity">Popularity</option>
            <option value="title">Title</option>
          </Form.Select>
        </Col>
      </Row>
    </Form>
  )
}