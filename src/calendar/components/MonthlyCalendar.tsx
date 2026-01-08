import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./MonthlyCalendar.css";
import { CalendarType } from "../../types/calendar";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  type: string;
  end?: string;
}

interface Props {
  events: CalendarEvent[];
  onDayClick?: (date: string) => void;
  onMonthChange?: (year: number, month: number) => void;
  onPeriodChange?: (start: Date, end: Date) => void;
  onEventClick?: (event: { id: string; type: CalendarType }) => void;
}

function mapEventType(type: string): string {
  switch (type) {
    case CalendarType.PRESENTATION:
      return "event-presentation";
    case CalendarType.UNAVAILABILITY:
      return "event-unavailability";
    case CalendarType.PRESENTATION_DATE_RESERVATION:
      return "event-reservation";
    default:
      return "event-default";
  }
}

export function MonthlyCalendar({ events, onDayClick, onMonthChange, onPeriodChange, onEventClick }: Props) {
  const colorEvents: CalendarEvent[] = events.map((event) => ({
    ...event,
    classNames: [mapEventType(event.type)],
    extendedProps: {
      type: event.type,
    },
  }));

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      displayEventTime={false}
      initialView="dayGridMonth"
      height="auto"
      locale="pt-br"
      events={colorEvents}
      dateClick={(info) => onDayClick?.(info.dateStr)}
      datesSet={(info) => {
        const date = info.start;
        
        const dateMonth = date.getMonth() + 1;
        const month = dateMonth === 12 ? 1 : dateMonth;

        const dateYear = date.getFullYear();
        const year = dateMonth === 12 ? dateYear + 1 : dateYear;

        onMonthChange?.(year, month);
        onPeriodChange?.(info.start, info.end);
      }}
      eventClick={(info) => {
        onEventClick?.({
          id: info.event.id,
          type: info.event.extendedProps.type as CalendarType,
        });
      }}
      headerToolbar={{
        left: "prev,next",
        center: "title",
        right: "",
      }}
    />
  );
}
