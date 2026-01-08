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
import type { PresentationDetails } from "../../types/presentation";
import { useAuth } from "../../auth/AuthContext";
import "./DetailsDialog.css";
import "./PresentationDetailsDialog.css";
import { getPresentationById } from "../../services/presentation.service";

interface Props {
  open: boolean;
  presentationId: string | null;
  onClose: () => void;
  onEdit?: (id: string) => void;
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

export function PresentationDetailsDialog({
  open,
  presentationId,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  const { user } = useAuth();
  const [data, setData] = useState<PresentationDetails | null>(null);

  const canAccessFull = user?.role === "admin" || user?.role === "banda";

  useEffect(() => {
    if (!open || !presentationId) return;
    getPresentationById(presentationId).then(setData);
  }, [open, presentationId]);

  function handleClose() {
    setData(null);
    onClose();
  }

  const loading = open && !data;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="presentation-dialog-title">
        Apresentação
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
              {canAccessFull && onEdit && presentationId && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => onEdit(presentationId)}
                >
                  Editar
                </Button>
              )}

              {canAccessFull && onDelete && presentationId && (
                <Button
                  fullWidth
                  color="error"
                  variant="outlined"
                  onClick={() => onDelete(presentationId)}
                >
                  Excluir
                </Button>
              )}
            </Stack>

            {/* Show */}
            <Box>
              <Typography className="section-title">
                <span className="label">Show:</span>{" "}
                <span className="value">{data.showName}</span>
              </Typography>

              <Typography className="section-item">
                <span className="label">Duração:</span>{" "}
                <span className="value">{data.duration} minutos</span>
              </Typography>

              {canAccessFull && data.observation && (
                <Typography className="section-item">
                  <span className="label">Observações:</span>{" "}
                  <span className="value">{data.observation}</span>
                </Typography>
              )}
            </Box>

            {/* Data */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className="section-title">
                  <span className="label">Data:</span>{" "}
                  <span className="value">
                    {formatDate(data.presentationStartDate)}
                  </span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={0.5}>
                  <Typography className="section-item">
                    <strong>Passagem de som:</strong>{" "}
                    {formatTime(data.soundCheckStartDate)} –{" "}
                    {formatTime(data.soundCheckEndDate)}
                  </Typography>

                  <Typography className="section-item">
                    <strong>Apresentação:</strong>{" "}
                    {formatTime(data.presentationStartDate)} –{" "}
                    {formatTime(data.presentationEndDate)}
                  </Typography>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Estabelecimento */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className="section-title">
                  <span className="label">Estabelecimento:</span>{" "}
                  <span className="value">{data.establishmentName}</span>
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack spacing={0.5}>
                  <Typography className="section-item">
                    <strong>Contato:</strong> {data.establishmentContactName} –{" "}
                    {data.establishmentContactPhone}
                  </Typography>

                  <Typography className="section-item">
                    <strong>Endereço:</strong> {data.establishmentStreet},{" "}
                    {data.establishmentCity}
                  </Typography>
                </Stack>
              </AccordionDetails>
            </Accordion>

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
