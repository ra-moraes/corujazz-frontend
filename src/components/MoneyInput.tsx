import { NumericFormat } from "react-number-format";
import { TextField } from "@mui/material";

interface Props {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
}

export function MoneyInput({ label, value, onChange }: Props) {
  return (
    <NumericFormat
      customInput={TextField}
      label={label}
      value={value}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      fullWidth
      onValueChange={(values) => {
        onChange(values.floatValue ?? null);
      }}
    />
  );
}
