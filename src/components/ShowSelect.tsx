// components/ShowSelect.tsx
import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { getShows } from "../services/show.service";
import type { Show } from "../types/show";


interface Props {
  value: Show | null;
  onChange: (show: Show | null) => void;
  required?: boolean;
}

export function ShowSelect({ value, onChange, required }: Props) {
  const [options, setOptions] = useState<Show[]>([]);

  useEffect(() => {
    getShows().then((data) =>
      setOptions(
        [...data].sort((a, b) => a.name.localeCompare(b.name))
      )
    );
  }, []);

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, v) => onChange(v)}
      getOptionLabel={(o) => o.name}
      renderInput={(params) => (
        <TextField {...params} label="Show" required={required} />
      )}
    />
  );
}
