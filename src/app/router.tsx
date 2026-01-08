import { createBrowserRouter, Navigate } from "react-router-dom";
// import { CalendarPage } from '../calendar/CalendarPage';
import { MainLayout } from "../layout/MainLayout";
import { ErrorPage } from "../pages/ErrorPage";
import { PrivateRoute } from "../auth/PrivateRoute";
import { LoginPage } from "../auth/LoginPage";
import { CalendarPage } from "../calendar/CalendarPage";
import { UnavailabilityForm } from "../unavailability/UnavailabilityForm";
import { EstablishmentFormPage } from "../establishment/EstablishmentFormPage";
import { ReservationForm } from "../reservation-for-presentation/ReservationForm";
import { PresentationForm } from "../presentation/PresentationForm";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/agenda" replace />,
      },
      {
        path: 'agenda',
        element: <CalendarPage />,
      },
      {
        path: 'indisponibilidade',
        element: <UnavailabilityForm />,
      },
      {
        path: 'estabelecimento/novo',
        element: <EstablishmentFormPage />,
      },
      {
        path: 'reserva-apresentacao',
        element: <ReservationForm />,
      },
      {
        path: 'apresentacao',
        element: <PresentationForm />,
      },
    ],
  },
]);
