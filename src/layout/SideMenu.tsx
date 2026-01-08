import { List, ListItemButton, ListItemText } from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

export function SideMenu() {
  const { user } = useAuth();

  const menu = [
    { label: '.', path: '/', roles: ['admin', 'banda', 'equipe'] },
    { label: 'Estabelecimentos', path: '/estabelecimento/novo', roles: ['admin'] },
    { label: 'Shows', path: '/shows', roles: ['admin'] },
    { label: 'Agenda', path: '/agenda', roles: ['admin', 'equipe', 'banda'] },
    { label: 'Nova Apresentação', path: '/apresentacao', roles: ['admin', 'banda'] },
    { label: 'Nova Reserva', path: '/reserva-apresentacao', roles: ['admin', 'banda'] },
    { label: 'Nova Indisponibilidade', path: '/indisponibilidade', roles: ['admin', 'banda', 'equipe'] },
  ];

  return (
    <List>
      {menu
        .filter(item => item.roles.includes(user!.role))
        .map(item => (
          <ListItemButton key={item.path} component={Link} to={item.path}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
    </List>
  );
}
