import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuth } from "../../auth/AuthContext";
import "./DetailsDialog.css";
import "./ReservationForPresentationDetailsDialog.css";
import type { ReservationForPresentationDetails } from "../../types/reservation-for-preservation";
import { getReservationForPresentationById } from "../../services/reservation-for-presentation.service";

interface Props {
  open: boolean;
  reservationForPresentationId: string | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onToPresentation?: (id: string) => void;
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

export function ReservationForPresentationDetailsDialog({
  open,
  reservationForPresentationId,
  onClose,
  onDelete,
  onToPresentation,
}: Props) {
  const { user } = useAuth();
  const [data, setData] = useState<ReservationForPresentationDetails | null>(null);

  const canAccessFull = user?.role === "admin" || user?.role === "banda";

  useEffect(() => {
    if (!open || !reservationForPresentationId) return;
    getReservationForPresentationById(reservationForPresentationId).then(setData);
  }, [open, reservationForPresentationId]);

  function handleClose() {
    setData(null);
    onClose();
  }

  const loading = open && !data;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="reservation-for-presentation-dialog-title">
        Reserva
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
              {onToPresentation && reservationForPresentationId && canAccessFull && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => onToPresentation(reservationForPresentationId)}
                >
                  Apresentação
                </Button>
              )}
              {onDelete && reservationForPresentationId && canAccessFull && (
                <Button
                  fullWidth
                  color="error"
                  variant="outlined"
                  onClick={() => onDelete(reservationForPresentationId)}
                >
                  Excluir
                </Button>
              )}
            </Stack>

            {/* Show */}
            <Box>
              <Typography className="section-title">
                <span className="label">Show:</span>{" "}
                <span className="value">{data?.showName || 'Não definido'}</span>
              </Typography>

              <Stack spacing={0.5} mt={1}>
                {canAccessFull && data.observation && (
                  <Typography className="section-item">
                    <span className="label">Observações:</span>{" "}
                    <span className="value">{data?.observation || 'Não definido'}</span>
                  </Typography>
                )}
              </Stack>
            </Box>

            {/* Data */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className="section-title">
                  <span className="label">Data:</span>{" "}
                  <span className="value">
                    {formatDate(data.startDate)}
                  </span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={0.5}>
                  <Typography className="section-item">
                    <strong>Início:</strong>{" "}
                    {formatTime(data.startDate)}
                  </Typography>

                  <Typography className="section-item">
                    <strong>Fim:</strong>{" "}
                    {formatTime(data.endDate)}
                  </Typography>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Estabelecimento */}
            <Typography className="section-title">
              <span className="label">Estabelecimento:</span>{" "}
              <span className="value">
                {data?.establishmentName || 'Não informado'}
              </span>
            </Typography>

            {/* Valor */}
            {canAccessFull && data.value != null && (
              <Typography className="section-title">
                <span className="label">Valor:</span>{" "}
                <span className="value">
                  R${" "}
                  {data.value.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </Typography>
            )}

            <Box textAlign="right">
              <Button onClick={handleClose}>Fechar</Button>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
