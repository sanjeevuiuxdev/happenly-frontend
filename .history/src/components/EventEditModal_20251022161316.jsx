import { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { updateEvent } from '../api/eventApi';

export default function EventEditModal({ show, onClose, event, onUpdated }) {
  const [form, setForm] = useState({});
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || '',
        description: event.description || '',
        department: event.department || '',
        type: event.type || '',
        startAt: event.startAt ? event.startAt.slice(0,16) : '',
        endAt: event.endAt ? event.endAt.slice(0,16) : '',
        location: event.location?.name || '',
        organizerName: event.organizer?.name || '',
        organizerCompany: event.organizer?.company || '',
        organizerEmail: event.organizer?.email || '',
      });
      setFiles([]);
    }
  }, [event]);

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const onFile = (e) => setFiles(Array.from(e.target.files || []));

  const submit = async (e) => {
    e.preventDefault();
    // If admin selected new files -> send multipart; else send JSON
    if (files.length) {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v ?? ''));
      files.forEach(f => fd.append('media', f));
      await updateEvent(event._id, fd);
    } else {
      await updateEvent(event._id, {
        ...form,
        organizer: {
          name: form.organizerName,
          company: form.organizerCompany,
          email: form.organizerEmail
        },
        location: { name: form.location }
      });
    }
    onUpdated?.();
    onClose();
  };

  if (!event) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={submit}>
        <Modal.Header closeButton><Modal.Title>Edit Event</Modal.Title></Modal.Header>
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
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Department</Form.Label>
                <Form.Select name="department" value={form.department} onChange={change} required>
                  <option value="">Select Department</option>
                  <option value="IT">IT</option>
                  <option value="CS">CS</option>
                  <option value="ME">ME</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Type</Form.Label>
                <Form.Control name="type" value={form.type} onChange={change} placeholder="talk / workshop / contest" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-2">
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Start</Form.Label>
                <Form.Control type="datetime-local" name="startAt" value={form.startAt} onChange={change} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>End</Form.Label>
                <Form.Control type="datetime-local" name="endAt" value={form.endAt} onChange={change} />
              </Form.Group>
            </Col>
          </Row>

          // In CreateEventModal.jsx and EventEditModal.jsx
<Form.Group className="mb-3">
  <Form.Label>Location <small className="text-muted">(text or Google Maps iframe)</small></Form.Label>
  <Form.Control
    name="location"
    as="textarea"        // if you prefer single-line keep it "type='text'"
    rows={2}
    placeholder='e.g. "Auditorium" or paste Google Maps <iframe ... ></iframe>'
    value={form.location || ''}
    onChange={onChange}
  />
</Form.Group>


          <Row className="g-2">
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>Organizer Name</Form.Label>
                <Form.Control name="organizerName" value={form.organizerName} onChange={change} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>Company</Form.Label>
                <Form.Control name="organizerCompany" value={form.organizerCompany} onChange={change} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="organizerEmail" value={form.organizerEmail} onChange={change} />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-1">
            <Form.Label>Replace media (optional)</Form.Label>
            <Form.Control type="file" accept="image/*,video/*" multiple onChange={onFile}/>
            <div className="form-text">If you select files here, the existing media will be replaced.</div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Update</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
