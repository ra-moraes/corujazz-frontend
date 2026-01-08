import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { getCalendarByPeriod } from "./services/calendar.service";
import {
  MonthlyCalendar,
  type CalendarEvent,
} from "./components/MonthlyCalendar";
import { useNavigate } from "react-router-dom";
import { CreateEventDialog } from "./components/CreateEventDialog";
import { CalendarType } from "../types/calendar";
import { PresentationDetailsDialog } from "./components/PresentationDetailsDialog";
import { UnavailabilityDetailsDialog } from "./components/UnavailabilityDetailsDialog";
import { ReservationForPresentationDetailsDialog } from "./components/ReservationForPresentationDetailsDialog";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { deleteUnavailability } from "./services/unavailability.service";
import { deleteReservationForPresentation } from "../services/reservation-for-presentation.service";
import { deletePresentation } from "../services/presentation.service";

export function CalendarPage() {
  const navigate = useNavigate();

  const [startPeriod, setStartPeriod] = useState(new Date());
  const [endPeriod, setEndPeriod] = useState(new Date());

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedPresentationId, setSelectedPresentationId] = useState<
    string | null
  >(null);
  const [selectedUnavailabilityId, setSelectedUnavailabilityId] = useState<
    string | null
  >(null);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

  type DeleteAction = { type: CalendarType; id: string } | null;

  const [confirmDelete, setConfirmDelete] = useState<DeleteAction>(null);

  function loadCalendarEvents(start: Date, end: Date) {
    getCalendarByPeriod(start, end)
      .then((events) => {
        const calendarEvents = events.map((event) => ({
          id: event.ownerId,
          title: event.title,
          type: event.type,
          start: event.startDate,
          end: event.endDate,
        }));
        setEvents(calendarEvents);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCalendarEvents(startPeriod, endPeriod);
  }, [startPeriod, endPeriod]);

  function handlePeriodChange(start: Date, end: Date) {
    setStartPeriod(start);
    setEndPeriod(end);
  }

  function handleDayClick(date: string) {
    setSelectedDate(date);
    setDialogOpen(true);
  }

  const handleEventClick = (event: { id: string; type: CalendarType }) => {
    if (event.type === CalendarType.PRESENTATION) {
      setSelectedPresentationId(event.id);
    }
    if (event.type === CalendarType.UNAVAILABILITY) {
      setSelectedUnavailabilityId(event.id);
    }
    if (event.type === CalendarType.PRESENTATION_DATE_RESERVATION) {
      setSelectedReservationId(event.id);
    }
  };

  function handleSelect(type: CalendarType) {
    setDialogOpen(false);

    const path = (() => {
      switch (type) {
        case CalendarType.PRESENTATION:
          return "apresentacao";
        case CalendarType.PRESENTATION_DATE_RESERVATION:
          return "reserva-apresentacao";
        case CalendarType.UNAVAILABILITY:
          return "indisponibilidade";
      }
    })();

    navigate(`/${path}`, {
      state: { date: selectedDate },
    });
  }

  function handleEditPresentation(id: string) {
    navigate(`/apresentacao?presentationId=${id}`);
  }
  function handleDeletePresentation(id: string) {
    setConfirmDelete({ type: CalendarType.PRESENTATION, id });
  }

  function handleDeleteUnavailability(id: string) {
    setConfirmDelete({ type: CalendarType.UNAVAILABILITY, id });
  }

  function handleDeleteReservation(id: string) {
    setConfirmDelete({ type: CalendarType.PRESENTATION_DATE_RESERVATION, id });
  }

  function handleReservationToPresentation(id: string) {
    navigate(`/apresentacao?reservationForPresentationId=${id}`);
  }

  async function confirmDeleteAction() {
    if (!confirmDelete) return;

    const { type, id } = confirmDelete;

    setConfirmDelete(null);

    switch (type) {
      case CalendarType.PRESENTATION:
        setSelectedPresentationId(null);  
        await deletePresentation(id);
        break;

      case CalendarType.UNAVAILABILITY:
        setSelectedUnavailabilityId(null);
        await deleteUnavailability(id);
        break;

      case CalendarType.PRESENTATION_DATE_RESERVATION:
        setSelectedReservationId(null);  
        await deleteReservationForPresentation(id);
        break;
    }

    loadCalendarEvents(startPeriod, endPeriod);
  }

  function getConfirmDialogText() {
    switch (confirmDelete?.type) {
      case CalendarType.PRESENTATION:
        return {
          title: "Excluir apresentação",
          message:
            "Tem certeza que deseja excluir esta apresentação? Esta ação não pode ser desfeita.",
        };
      case CalendarType.UNAVAILABILITY:
        return {
          title: "Excluir indisponibilidade",
          message: "Tem certeza que deseja excluir esta indisponibilidade?",
        };
      case CalendarType.PRESENTATION_DATE_RESERVATION:
        return {
          title: "Excluir reserva",
          message: "Tem certeza que deseja excluir esta reserva?",
        };
      default:
        return { title: "", message: "" };
    }
  }

  const confirmText = getConfirmDialogText();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <MonthlyCalendar
        events={events}
        onDayClick={handleDayClick}
        onPeriodChange={handlePeriodChange}
        onEventClick={handleEventClick}
      />

      <CreateEventDialog
        open={dialogOpen}
        date={selectedDate}
        onClose={() => setDialogOpen(false)}
        onSelect={handleSelect}
      />

      <PresentationDetailsDialog
        open={!!selectedPresentationId}
        presentationId={selectedPresentationId}
        onClose={() => setSelectedPresentationId(null)}
        onEdit={handleEditPresentation}
        onDelete={handleDeletePresentation}
      />

      <UnavailabilityDetailsDialog
        open={!!selectedUnavailabilityId}
        unavailabilityId={selectedUnavailabilityId}
        onClose={() => setSelectedUnavailabilityId(null)}
        onDelete={handleDeleteUnavailability}
      />

      <ReservationForPresentationDetailsDialog
        open={!!selectedReservationId}
        reservationForPresentationId={selectedReservationId}
        onClose={() => setSelectedReservationId(null)}
        onDelete={handleDeleteReservation}
        onToPresentation={handleReservationToPresentation}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title={confirmText.title}
        message={confirmText.message}
        confirmText="Excluir"
        confirmColor="error"
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteAction}
      />
    </>
  );
}
