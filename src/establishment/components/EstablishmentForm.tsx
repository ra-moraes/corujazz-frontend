import { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import { createEstablishment } from "../services/establishment.service";
import type { CreateEstablishmentDto } from "../../types/establishment";
import { MuiTelInput } from "mui-tel-input";

interface Props {
  onCancel: () => void;
  onSuccess: (id: string) => void;
}

export function EstablishmentForm({ onCancel, onSuccess }: Props) {
  const [form, setForm] = useState<CreateEstablishmentDto>({
    name: "",
    street: "",
    city: "",
    distance: 0,
    contactName: "",
    contactPhone: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "distance" ? Number(value) : value,
    }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const result = await createEstablishment(form);
      onSuccess(result.id);
    } finally {
      setLoading(false);
    }
  }

  const isDisabled =
    !form.name ||
    !form.street ||
    !form.city ||
    !form.distance ||
    !form.contactName ||
    !form.contactPhone;

  return (
    <Stack spacing={2}>
      <TextField
        label="Nome"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Rua"
        name="street"
        value={form.street}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Cidade"
        name="city"
        value={form.city}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Distância (km)"
        name="distance"
        type="number"
        value={form.distance}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Nome do contato"
        name="contactName"
        value={form.contactName}
        onChange={handleChange}
        required
        fullWidth
      />

      <MuiTelInput
        label="Telefone do contato"
        value={form.contactPhone}
        onChange={(value) =>
          setForm((prev) => ({ ...prev, contactPhone: value }))
        }
        defaultCountry="BR"
        required
        fullWidth
      />

      <Stack direction="row" spacing={1}>
        <Button fullWidth variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>

        <Button
          fullWidth
          variant="contained"
          disabled={isDisabled || loading}
          onClick={handleSubmit}
        >
          Salvar
        </Button>
      </Stack>
    </Stack>
  );
}
