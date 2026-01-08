// components/EstablishmentSelect.tsx
import {
  Autocomplete,
  TextField,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { Establishment } from "../types/establishment";

interface Props {
  value: Establishment | null;
  options: Establishment[];
  onChange: (value: Establishment | null) => void;
  onCreateRequest: () => void;
}

export function EstablishmentSelect({
  value,
  options,
  onChange,
  onCreateRequest,
}: Props) {
  return (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Autocomplete
        fullWidth
        options={options}
        value={value}
        onChange={(_, v) => onChange(v)}
        getOptionLabel={(o) => o.name}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        renderInput={(params) => (
          <TextField {...params} label="Estabelecimento" />
        )}
      />

      <IconButton
        color="primary"
        sx={{ mt: "4px" }}
        onClick={onCreateRequest}
      >
        <AddIcon />
      </IconButton>
    </Stack>
  );
}
