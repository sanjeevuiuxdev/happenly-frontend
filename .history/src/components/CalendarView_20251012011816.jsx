// CalendarView.jsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";

// Keep Bootstrap via main.jsx
import "/node_modules/@fullcalendar/daygrid/index.css"; // v6 path that Vite will pick up



export default function CalendarView({ onDateSelect }){
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, bootstrap5Plugin]}
      initialView="dayGridMonth"
      themeSystem="bootstrap5"
      height={520}
      dateClick={(info)=> onDateSelect?.(info.dateStr)}
    />
  )
}