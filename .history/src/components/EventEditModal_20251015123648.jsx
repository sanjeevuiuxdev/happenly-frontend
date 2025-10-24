import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { updateEvent } from '../api/eventApi';

export default function EventEditModal({ show, onHide, event, refresh }) {
  const [form, setForm] = useState(event || {});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    await updateEvent(event._id, form);
    setLoading(false);
    refresh();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" value={form.title || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" value={form.description || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Select name="department" value={form.department || ''} onChange={handleChange}>
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="CS">CS</option>
              <option value="ME">ME</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" disabled={loading} onClick={handleSubmit}>
          {loading ? 'Updating…' : 'Update'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
