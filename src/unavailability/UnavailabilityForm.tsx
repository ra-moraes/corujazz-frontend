import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { createUnavailability } from "./services/unavailability.service";

export function UnavailabilityForm() {
  const navigate = useNavigate();

  const location = useLocation();
  const initialDate = location.state?.date ? dayjs(location.state.date) : null;

  const [date, setDate] = useState<Dayjs | null>(initialDate);
  const [start, setStart] = useState<Dayjs | null>(null);
  const [end, setEnd] = useState<Dayjs | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function isValid() {
    if (!date || !start || !end || !reason.trim()) {
      setError("Todos os campos são obrigatórios.");
      return false;
    }

    if (end.isBefore(start)) {
      setError("O horário de término deve ser maior que o início.");
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    setError(null);

    if (!isValid()) return;

    setLoading(true);

    try {
      const startDate = date!
        .hour(start!.hour())
        .minute(start!.minute())
        .second(0)
        .millisecond(0)
        .toDate();

      const endDate = date!
        .hour(end!.hour())
        .minute(end!.minute())
        .second(0)
        .millisecond(0)
        .toDate();

      await createUnavailability(startDate, endDate, reason);

      navigate("/agenda");
    } catch (err) {
      console.log(err);
      setError("Erro ao salvar indisponibilidade. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box maxWidth={480} mx="auto">
      <Typography variant="h6" mb={3} style={{textAlign: 'center'}}>
        Cadastrar indisponibilidade
      </Typography>

      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <DatePicker
          label="Data"
          value={date}
          minDate={dayjs()}
          onChange={setDate}
          slotProps={{ textField: { required: true, readOnly: true } }}
        />

        <TimePicker
          label="Início"
          value={start}
          onChange={setStart}
          slotProps={{ textField: { required: true, readOnly: true } }}
          ampm={false}
        />

        <TimePicker
          label="Fim"
          value={end}
          onChange={setEnd}
          slotProps={{ textField: { required: true, readOnly: true } }}
          ampm={false}
        />

        <TextField
          label="Motivo"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          multiline
          rows={3}
          required
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={() => navigate("/agenda")}>Cancelar</Button>

          <Button variant="contained" onClick={handleSubmit} disabled={loading} loading={loading}>
            Salvar
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
