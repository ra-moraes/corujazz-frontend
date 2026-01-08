import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { getUnavailabilityById } from "../services/unavailability.service";
import type { UnavailabilityDetails } from "../../types/unavailability";
import "./DetailsDialog.css";
import "./UnavailabilityDetailsDialog.css";

interface Props {
  open: boolean;
  unavailabilityId: string | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UnavailabilityDetailsDialog({
  open,
  unavailabilityId,
  onClose,
  onDelete,
}: Props) {
  const [data, setData] = useState<UnavailabilityDetails | null>(null);

  useEffect(() => {
    if (!open || !unavailabilityId) return;
    getUnavailabilityById(unavailabilityId).then(setData);
  }, [open, unavailabilityId]);

  function handleClose() {
    setData(null);
    onClose();
  }

  const loading = open && !data;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="unavailability-dialog-title">
        Indisponibilidade
      </DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
          </Stack>
        )}

        {!loading && data && (
          <Stack spacing={2}>
            {/* Ações */}
            <Stack direction="row" spacing={1}>
              {onDelete && unavailabilityId && data.canDelete && (
                <Button
                  fullWidth
                  color="error"
                  variant="outlined"
                  onClick={() => onDelete(unavailabilityId)}
                >
                  Excluir
                </Button>
              )}
            </Stack>

            {/* Show */}
            <Box>
              <Stack spacing={0.5} mt={1}>
                <Typography className="section-title">
                  <span className="label">Usuário:</span>{" "}
                  <span className="value">{data.userName}</span>
                </Typography>
                <Typography className="section-item">
                  <span className="label">Data:</span>{" "}
                  <span className="value">{formatDate(data.startDate)}</span>
                </Typography>
                <Typography className="section-item">
                  <span className="label">Início:</span>{" "}
                  <span className="value">{formatTime(data.startDate)}</span>
                </Typography>
                <Typography className="section-item">
                  <span className="label">Fim:</span>{" "}
                  <span className="value">{formatTime(data.endDate)}</span>
                </Typography>
                <Typography className="section-item">
                  <span className="label">Motivo:</span>{" "}
                  <span className="value">{data?.reason || 'Não informado'}</span>
                </Typography>
              </Stack>
            </Box>

            <Box textAlign="right">
              <Button onClick={handleClose}>Fechar</Button>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
