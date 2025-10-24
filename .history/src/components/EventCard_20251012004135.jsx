import { Card, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function EventCard({ e }){
  return (
    <Card className="mb-3 shadow-sm event-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="mb-1"><Link to={`/events/${e._id}`}>{e.title}</Link></Card.Title>
            <Card.Subtitle className="text-muted">{new Date(e.startAt || e.date).toLocaleString()} • {e.location?.name || e.location}</Card.Subtitle>
          </div>
          {e.department && <Badge bg="primary" pill>{e.department}</Badge>}
        </div>
        <Card.Text className="mt-2">{e.description?.slice(0,160)}{e.description?.length>160?'…':''}</Card.Text>
      </Card.Body>
    </Card>
  )
}