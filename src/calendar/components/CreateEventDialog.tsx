import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { CalendarType } from "../../types/calendar";
import { useAuth } from "../../auth/AuthContext";
import "./CreateEventDialog.css";

interface Props {
  open: boolean;
  date: string | null;
  onClose: () => void;
  onSelect: (type: CalendarType) => void;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";

  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR");
}

export function CreateEventDialog({ open, date, onClose, onSelect }: Props) {
  const { user } = useAuth();

  const canAccessFull = user?.role === "admin" || user?.role === "banda";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Novo agendamento</DialogTitle>

      <DialogContent>
        <Typography variant="body2" mb={2}>
          Data selecionada: <strong>{formatDate(date?.toString())}</strong>
        </Typography>

        <Stack spacing={2}>
          {canAccessFull && (
            <Button
              variant="contained"
              className="event-presentation"
              onClick={() => onSelect(CalendarType.PRESENTATION)}
            >
              Nova Apresentação
            </Button>
          )}

          {canAccessFull && (
            <Button
              variant="outlined"
              className="event-reservation"
              onClick={() =>
                onSelect(CalendarType.PRESENTATION_DATE_RESERVATION)
              }
            >
              Nova Reserva
            </Button>
          )}

          <Button
            variant="outlined"
            className="event-unavailability"
            onClick={() => onSelect(CalendarType.UNAVAILABILITY)}
          >
            Nova Indisponibilidade
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}
