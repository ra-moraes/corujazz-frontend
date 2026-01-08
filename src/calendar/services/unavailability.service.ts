import api from "../../services/api";
import type { UnavailabilityDetails } from "../../types/unavailability";

export async function getUnavailabilityById(
  id: string
): Promise<UnavailabilityDetails> {
  const { data } = await api.get<UnavailabilityDetails>(`/unavailabilities/${id}`);

  return data;
}

export async function deleteUnavailability(
  id: string
): Promise<void> {
  await api.delete(`/unavailabilities/${id}`);
}
