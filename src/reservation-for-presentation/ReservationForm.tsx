import { useState } from "react";
import { Stack, Button, TextField, Alert, Typography } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { ShowSelect } from "../components/ShowSelect";
import { EstablishmentSelect } from "../components/EstablishmentSelect";
import { MoneyInput } from "../components/MoneyInput";
import type { Show } from "../types/show";
import type { Establishment } from "../types/establishment";
import { createReservationForPresentation } from "../services/reservation-for-presentation.service";
import { EstablishmentFormDialog } from "../establishment/components/EstablishmentFormDialog";
import { useEstablishments } from "../hooks/useEstablishment";

export function ReservationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialDate = location.state?.date ? dayjs(location.state.date) : null;

  const [date, setDate] = useState<Dayjs | null>(initialDate);
  const [start, setStart] = useState<Dayjs | null>(null);
  const [end, setEnd] = useState<Dayjs | null>(null);

  const [show, setShow] = useState<Show | null>(null);
  const [establishment, setEstablishment] = useState<Establishment | null>(
    null
  );
  const [openEstablishmentDialog, setOpenEstablishmentDialog] = useState(false);

  const [value, setValue] = useState<number | null>(null);
  const [observations, setObservations] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { establishmentOptions: establishments, reload } = useEstablishments();

  function isValid() {
    if (!date || !start || !end) {
      setError("Verifique os campos obrigatórios.");
      return false;
    }

    if (end.isBefore(start)) {
      setError("O horário de término deve ser maior que o início.");
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    if (!isValid()) return;

    const startDate = date!
      .hour(start!.hour())
      .minute(start!.minute())
      .toDate();

    const endDate = date!.hour(end!.hour()).minute(end!.minute()).toDate();

    setLoading(true);

    await createReservationForPresentation({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      showId: show?.id,
      establishmentId: establishment?.id,
      value: value ?? undefined,
      observations: observations || undefined,
    });

    setLoading(false);

    navigate("/agenda");
  }

  return (
    <Stack spacing={2} maxWidth={480} mx="auto">
      <Typography variant="h6" mb={3} style={{ textAlign: "center" }}>
        Cadastrar reserva
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <DatePicker
        label="Data"
        value={date}
        minDate={dayjs()}
        onChange={setDate}
        slotProps={{ textField: { required: true, readOnly: true } }}
      />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TimePicker
          label="Início"
          ampm={false}
          value={start}
          onChange={setStart}
          sx={{ flex: 1 }}
        />

        <TimePicker
          label="Fim"
          ampm={false}
          value={end}
          onChange={setEnd}
          sx={{ flex: 1 }}
        />
      </Stack>

      <ShowSelect value={show} onChange={setShow} />

      <EstablishmentSelect
        value={establishment}
        options={establishments}
        onChange={setEstablishment}
        onCreateRequest={() => setOpenEstablishmentDialog(true)}
      />

      <MoneyInput label="Valor" value={value} onChange={setValue} />

      <TextField
        label="Observações"
        multiline
        rows={3}
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
      />

      <Stack direction="row" spacing={1}>
        <Button fullWidth onClick={() => navigate("/agenda")}>
          Cancelar
        </Button>

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          loading={loading}
        >
          Salvar
        </Button>
      </Stack>

      <EstablishmentFormDialog
        open={openEstablishmentDialog}
        onClose={() => setOpenEstablishmentDialog(false)}
        onCreated={async (id) => {
          const data = await reload();
          const created = data.find((e) => e.id === id);
          setEstablishment(created ?? null);
        }}
      />
    </Stack>
  );
}
