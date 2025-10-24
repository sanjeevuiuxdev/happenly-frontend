// src/components/CalendarView.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import {
  format,
  parse,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Button } from 'react-bootstrap';
import { listEvents } from '../api/eventApi';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => new Date(),
  getDay: (d) => d.getDay(),
  locales,
});

// ---------- Custom Toolbar ----------
function CustomToolbar({ label, onNavigate }) {
  return (
    <div className="rbc-toolbar d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex gap-2">
        <Button variant="light" onClick={() => onNavigate('PREV')}>
          Back
        </Button>
        <Button variant="light" onClick={() => onNavigate('TODAY')}>
          Today
        </Button>
        <Button variant="light" onClick={() => onNavigate('NEXT')}>
          Next
        </Button>
      </div>
      <h5 className="m-0 fw-semibold">{label}</h5>
      <div />
    </div>
  );
}

// ---------- Main Calendar ----------
export default function CalendarView() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Current month range
  const range = useMemo(() => {
    return { from: startOfMonth(date), to: endOfMonth(date) };
  }, [date]);

  // Fetch events for visible month
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await listEvents({
          from: range.from.toISOString(),
          to: range.to.toISOString(),
          sort: 'startAt',
          order: 'asc',
          limit: 500,
        });
        const events = (data.items || data).map((e) => ({
          ...e,
          title: e.title,
          start: new Date(e.startAt || e.date),
          end: new Date(e.endAt || e.startAt || e.date),
          resource: e,
        }));
        setItems(events);
      } finally {
        setLoading(false);
      }
    })();
  }, [range]);

  // Color per department (optional)
  function eventStyleGetter(event) {
    const colorMap = {
      IT: '#0d6efd',
      CS: '#198754',
      ME: '#6f42c1',
      Other: '#6c757d',
    };
    const bg = colorMap[event.resource?.department] || '#0dcaf0';
    return { style: { backgroundColor: bg, borderColor: bg } };
  }

  return (
    <div className="card p-3 shadow-sm">
      <h3 className="mb-3">Event Calendar Overview</h3>
      <p className="text-muted mb-3">
        Click a date to filter events, or click an event to open its details.
      </p>

      <Calendar
        localizer={localizer}
        events={items}
        date={date}
        view="month" // ✅ Only Month view
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        toolbar={true}
        components={{
          toolbar: (props) => (
            <CustomToolbar
              {...props}
              onNavigate={(action) => {
                if (action === 'TODAY') setDate(new Date());
                else if (action === 'NEXT') setDate(addMonths(date, 1));
                else if (action === 'PREV') setDate(subMonths(date, 1));
              }}
            />
          ),
        }}
        onSelectEvent={(ev) => navigate(`/events/${ev.resource._id}`)}
        eventPropGetter={eventStyleGetter}
        messages={{
          month: 'Month',
          today: 'Today',
          previous: 'Back',
          next: 'Next',
        }}
      />

      {loading && <div className="text-muted small mt-2">Loading events…</div>}
    </div>
  );
}
