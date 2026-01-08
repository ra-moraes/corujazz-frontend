import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/agenda', { replace: true });
    } catch (err) {
      console.log(err);
      setError('Email ou senha inválidos');
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 12, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant="h4" align="center">
          Login
        </Typography>

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <Button type="submit" variant="contained" size="large">
          Entrar
        </Button>
      </Box>
    </Container>
  );
}
