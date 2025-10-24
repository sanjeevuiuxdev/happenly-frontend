import CalendarView from '../components/CalendarView';
import { useNavigate } from 'react-router-dom';

export default function Home(){
  const nav = useNavigate();
  const onDateSelect = (iso) => nav(`/events?from=${iso}&to=${iso}`);
  const demo = [
    { title: 'Tech Talk', start: new Date(), end: new Date() },
  ];

  return (
    <>
      <h2 className="mb-3">Event Calendar Overview</h2>
      <p className="text-muted">Use the calendar to jump to events on a specific date.</p>
      <CalendarView events={demo} onDateSelect={onDateSelect} />
    </>
  );
}
