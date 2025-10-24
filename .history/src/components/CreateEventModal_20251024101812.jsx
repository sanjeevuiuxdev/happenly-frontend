import { useState } from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { createEvent } from '../api/eventApi'

export default function CreateEventModal({ show, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '', description: '', department: '', type: '',
    startAt: '', endAt: '', location: ''
  })
  const [files, setFiles] = useState([])         
  const [previews, setPreviews] = useState([])

  const change = e => setForm({ ...form, [e.target.name]: e.target.value })

  const onFile = (e) => {
    const arr = Array.from(e.target.files || [])
    setFiles(arr)
    setPreviews(arr.map(f => ({ name: f.name, url: URL.createObjectURL(f), type: f.type })))
  }

  const submit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k,v]) => fd.append(k, v))
    // tags example: comma separated
    // fd.append('tags', 'ai,tech')

    files.forEach(f => fd.append('media', f))   // field name 'media' matches multer

    const { data } = await createEvent(fd)
    onCreated?.(data)
    // cleanup
    previews.forEach(p => URL.revokeObjectURL(p.url))
    setFiles([]); setPreviews([])
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

          <Form.Group className="mb-3">
  <Form.Label>Location <small className="text-muted">(text or Google Maps iframe)</small></Form.Label>
  <Form.Control
  as="textarea"
  rows={2}
  placeholder='e.g. "Auditorium" or paste Google Maps <iframe ...></iframe>'
  value={form.location || ''}
  onChange={(e) => setForm({ ...form, location: e.target.value })}
/>

</Form.Group>

          <Form.Group className="mb-2">
  <Form.Label>Organizer Name</Form.Label>
  <Form.Control name="organizerName" value={form.organizerName} onChange={change} />
</Form.Group>
<Form.Group className="mb-2">
  <Form.Label>Organizer Company</Form.Label>
  <Form.Control name="organizerCompany" value={form.organizerCompany} onChange={change} />
</Form.Group>
<Form.Group className="mb-3">
  <Form.Label>Organizer Email (optional)</Form.Label>
  <Form.Control type="email" name="organizerEmail" value={form.organizerEmail} onChange={change} />
</Form.Group>


          <Form.Group>
            <Form.Label>Media (images/videos)</Form.Label>
            <Form.Control type="file" accept="image/*,video/*" multiple onChange={onFile} />
            {/* previews */}
            {previews.length > 0 && (
              <div className="mt-2 d-flex flex-wrap gap-2">
                {previews.map(p => (
                  p.type.startsWith('image')
                    ? <img key={p.url} src={p.url} alt={p.name} width={90} height={60} className="rounded border" />
                    : <video key={p.url} src={p.url} width={120} height={80} className="rounded border" />
                ))}
              </div>
            )}
            <div className="form-text">Up to 5 files • 10MB each • JPG/PNG/WebP/GIF/MP4/MOV/WebM</div>
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
