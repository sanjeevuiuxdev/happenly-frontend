import { useState } from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { createEvent } from '../api/eventApi'

export default function CreateEventModal({ show, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    department: '',
    type: '',
    startAt: '',
    endAt: '',
    location: ''
  })

  const change = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    // backend expects startAt/endAt as ISO
    const payload = {
      ...form,
      location: { name: form.location }
    }
    const { data } = await createEvent(payload)
    onCreated?.(data)
    onClose()
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={submit}>
        <Modal.Header closeButton><Modal.Title>Create Event</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" value={form.title} onChange={change} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={change} />
          </Form.Group>
          <Row className="g-2">
            <Col md>
              <Form.Group className="mb-2">
                <Form.Label>Department</Form.Label>
                <Form.Control name="department" value={form.department} onChange={change} />
              </Form.Group>
            </Col>
            <Col md>
              <Form.Group className="mb-2">
                <Form.Label>Type</Form.Label>
                <Form.Control name="type" value={form.type} onChange={change} placeholder="talk / workshop / contest" />
              </Form.Group>
            </Col>
          </Row>
          <Row className="g-2">
            <Col md>
              <Form.Group className="mb-2">
                <Form.Label>Start</Form.Label>
                <Form.Control type="datetime-local" name="startAt" value={form.startAt} onChange={change} required />
              </Form.Group>
            </Col>
            <Col md>
              <Form.Group className="mb-2">
                <Form.Label>End</Form.Label>
                <Form.Control type="datetime-local" name="endAt" value={form.endAt} onChange={change} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-2">
            <Form.Label>Location</Form.Label>
            <Form.Control name="location" value={form.location} onChange={change} placeholder="Auditorium" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Create</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
