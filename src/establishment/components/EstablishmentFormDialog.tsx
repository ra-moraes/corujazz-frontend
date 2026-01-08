import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { EstablishmentForm } from "./EstablishmentForm";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

export function EstablishmentFormDialog({
  open,
  onClose,
  onCreated,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Estabelecimento</DialogTitle>

      <DialogContent dividers>
        <EstablishmentForm
          onCancel={onClose}
          onSuccess={(id) => {
            onCreated(id);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
