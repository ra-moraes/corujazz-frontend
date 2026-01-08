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
import { EstablishmentFormDialog } from "../establishment/components/EstablishmentFormDialog";
import { useEstablishments } from "../hooks/useEstablishment";
import { createPresentation, editPresentation } from "../services/presentation.service";
import { useEffect } from "react";
import { getReservationForPresentationById } from "../services/reservation-for-presentation.service";
import { getPresentationById } from "../services/presentation.service";
import type { PresentationPayloadDto } from "../types/presentation";

export function PresentationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialDate = location.state?.date ? dayjs(location.state.date) : null;

  const [date, setDate] = useState<Dayjs | null>(initialDate);
  const [soundCheckStart, setSoundCheckStart] = useState<Dayjs | null>(null);
  const [soundCheckEnd, setSoundCheckEnd] = useState<Dayjs | null>(null);
  const [presentationStart, setPresentationStart] = useState<Dayjs | null>(
    null
  );
  const [presentationEnd, setPresentationEnd] = useState<Dayjs | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

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

  function applyDateAndTime(iso: string): { date: Dayjs; time: Dayjs } {
    const d = dayjs(iso);
    return {
      date: d.startOf("day"),
      time: d,
    };
  }

  const searchParams = new URLSearchParams(location.search);
  const reservationForPresentationId = searchParams.get(
    "reservationForPresentationId"
  );

  const presentationId = searchParams.get("presentationId");

  useEffect(() => {
    if (!presentationId) return;

    async function loadPresentation(presentationId: string) {
      setLoading(true);

      const data = await getPresentationById(presentationId);

      const soundCheckStart = applyDateAndTime(data.soundCheckStartDate);
      const soundCheckEnd = applyDateAndTime(data.soundCheckEndDate);
      const presentationStart = applyDateAndTime(data.presentationStartDate);
      const presentationEnd = applyDateAndTime(data.presentationEndDate);

      setDate(dayjs(data.startDate));
      setSoundCheckStart(soundCheckStart.time);
      setSoundCheckEnd(soundCheckEnd.time);
      setPresentationStart(presentationStart.time);
      setPresentationEnd(presentationEnd.time);

      setDuration(data.duration);
      setValue(data.value ?? null);
      setObservations(data.observation ?? "");

      // selects
      setShow(data.showId ? { id: data.showId, name: data.showName } : null);
      setEstablishment(
        data.establishmentId
          ? {
              id: data.establishmentId,
              name: data.establishmentName,
            }
          : null
      );

      setLoading(false);
    }

    loadPresentation(presentationId);
  }, [presentationId]);

  useEffect(() => {
    if (!reservationForPresentationId || presentationId) return;

    async function loadReservation(reservationForPresentationId: string) {
      setLoading(true);

      const data = await getReservationForPresentationById(
        reservationForPresentationId
      );

      setDate(dayjs(data.startDate));

      setPresentationStart(dayjs(data.startDate));
      setPresentationEnd(dayjs(data.endDate));

      if (data.showId) {
        setShow({ id: data.showId, name: data.showName! });
      }

      if (data.establishmentId) {
        setEstablishment({
          id: data.establishmentId,
          name: data.establishmentName!,
        });
      }

      if (data.value) {
        setValue(data.value);
      }

      if (data.observation) {
        setObservations(data.observation);
      }

      setLoading(false);
    }

    loadReservation(reservationForPresentationId);
  }, [reservationForPresentationId, presentationId]);

  function isValid() {
    if (
      !date ||
      !soundCheckStart ||
      !soundCheckEnd ||
      !show ||
      !establishment ||
      !presentationStart ||
      !presentationEnd ||
      !duration ||
      !value
    ) {
      setError("Verifique os campos obrigatórios.");
      return false;
    }

    if (soundCheckEnd.isBefore(soundCheckStart)) {
      setError(
        "O horário de término deve ser maior que o início (passagem de som)."
      );
      return false;
    }
    if (presentationEnd.isBefore(presentationStart)) {
      setError(
        "O horário de término deve ser maior que o início (apresentação)."
      );
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    if (!isValid()) return;

    const soundCheckStartDate = date!
      .hour(soundCheckStart!.hour())
      .minute(soundCheckStart!.minute())
      .toDate();

    const soundCheckEndDate = date!
      .hour(soundCheckEnd!.hour())
      .minute(soundCheckEnd!.minute())
      .toDate();

    const presentationStartDate = date!
      .hour(presentationStart!.hour())
      .minute(presentationStart!.minute())
      .toDate();

    const presentationEndDate = date!
      .hour(presentationEnd!.hour())
      .minute(presentationEnd!.minute())
      .toDate();

    setLoading(true);

    const payload: PresentationPayloadDto = {
      soundCheckStart: soundCheckStartDate.toISOString(),
      soundCheckEnd: soundCheckEndDate.toISOString(),
      presentationStart: presentationStartDate.toISOString(),
      presentationEnd: presentationEndDate.toISOString(),
      duration: duration!,
      showId: show!.id,
      establishmentId: establishment!.id,
      value: value!,
      observations: observations || undefined,
      reservationForPresentationId: reservationForPresentationId || undefined,
    };

    if (!presentationId) {
      await createPresentation(payload);
    } else {
      await editPresentation(presentationId, payload);
    }

    setLoading(false);

    navigate("/agenda");
  }

  return (
    <Stack spacing={2} maxWidth={480} mx="auto">
      <Typography variant="h6" mb={3} style={{ textAlign: "center" }}>
        {presentationId ? "Editar apresentação" : "Cadastrar apresentação"}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {reservationForPresentationId && !presentationId && (
        <Alert severity="info">
          Alguns campos foram preenchidos a partir da reserva. Verifique e
          complete as informações da apresentação.
        </Alert>
      )}

      <DatePicker
        label="Data"
        value={date}
        minDate={dayjs()}
        onChange={setDate}
        slotProps={{ textField: { required: true, readOnly: true } }}
      />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TimePicker
          label="Início passagem de som"
          ampm={false}
          value={soundCheckStart}
          onChange={setSoundCheckStart}
          sx={{ flex: 1 }}
          slotProps={{ textField: { required: true, readOnly: true } }}
        />

        <TimePicker
          label="Fim passagem de som"
          ampm={false}
          value={soundCheckEnd}
          onChange={setSoundCheckEnd}
          sx={{ flex: 1 }}
          slotProps={{ textField: { required: true, readOnly: true } }}
        />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TimePicker
          label="Início apresentação"
          ampm={false}
          value={presentationStart}
          onChange={setPresentationStart}
          sx={{ flex: 1 }}
          slotProps={{ textField: { required: true, readOnly: true } }}
        />

        <TimePicker
          label="Fim apresentação"
          ampm={false}
          value={presentationEnd}
          onChange={setPresentationEnd}
          sx={{ flex: 1 }}
          slotProps={{ textField: { required: true, readOnly: true } }}
        />
      </Stack>

      <TextField
        label="Tempo de apresentação (min.)"
        name="duration"
        type="number"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        required
        fullWidth
      />

      <ShowSelect value={show} onChange={setShow} required />

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
        required
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
