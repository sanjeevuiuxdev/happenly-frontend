import CalendarView from '../components/CalendarView'
import { useNavigate } from 'react-router-dom'

export default function Home(){
  const nav = useNavigate()
  const onDateSelect = (iso)=> nav(`/events?from=${iso}&to=${iso}`)

  const demo = [{ title: 'Tech Talk', start: new Date(), end: new Date() }]

  return (
    <div>
      <h2 className="mb-2">Event Calendar Overview</h2>
      <p className="text-muted mb-4">Use the calendar to jump to events on a specific date.</p>

      {/* Center the calendar */}
      <div className="d-flex justify-content-center">
        <div className="w-100" style={{ maxWidth: "" }}>
          <CalendarView events={demo} onDateSelect={onDateSelect} />
        </div>
      </div>
    </div>
  )
}
