import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface ApiErrorDetail {
  status?: number;
  message: string;
}

export function GlobalErrorDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<ApiErrorDetail | null>(null);

  useEffect(() => {
    function handleError(event: Event) {
      const customEvent = event as CustomEvent<ApiErrorDetail>;
      setError(customEvent.detail);
      setOpen(true);
    }

    window.addEventListener('api-error', handleError);
    return () => window.removeEventListener('api-error', handleError);
  }, []);

  function handleClose() {
    setOpen(false);
    setError(null);
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Erro</DialogTitle>

      <DialogContent>
        <Typography>
          {error?.message}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
