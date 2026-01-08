import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EstablishmentForm } from "./components/EstablishmentForm";

export function EstablishmentFormPage() {
  const navigate = useNavigate();

  return (
    <Box maxWidth={600} mx="auto">
      <Typography variant="h6" mb={2}>
        Estabelecimento
      </Typography>

      <EstablishmentForm
        onCancel={() => navigate("/agenda")}
        onSuccess={() => navigate("/agenda")}
      />
    </Box>
  );
}
