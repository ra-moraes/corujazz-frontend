import type { CreatedReservationForPresentation, CreateReservationForPresentation, ReservationForPresentationDetails } from "../types/reservation-for-preservation";
import api from "./api";

export async function createReservationForPresentation(
  reservation: CreateReservationForPresentation
): Promise<CreatedReservationForPresentation> {
  const { data } = await api.post<CreatedReservationForPresentation>(`/reservations-for-presentation`, reservation);

  return data;
}

export async function getReservationForPresentationById(
  id: string
): Promise<ReservationForPresentationDetails> {
  const { data } = await api.get<ReservationForPresentationDetails>(`/reservations-for-presentation/${id}`);

  return data;
}

export async function deleteReservationForPresentation(
  id: string
): Promise<void> {
  await api.delete(`/reservations-for-presentation/${id}`);
}