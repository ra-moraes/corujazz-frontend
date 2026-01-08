import { Box, Typography, Button } from '@mui/material';
import { useRouteError, useNavigate } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  const status = error?.status || 500;

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      gap={2}
    >
      <Typography variant="h3" color="primary">
        {status}
      </Typography>

      <Typography variant="h6">
        {status === 404
          ? 'Página não encontrada'
          : 'Algo deu errado'}
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate('/')}
      >
        Voltar para o início
      </Button>
    </Box>
  );
}
