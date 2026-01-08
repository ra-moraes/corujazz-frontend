import api from "../../services/api";
import type { UnavailabilityCreated } from "../../types/unavailability";

export async function createUnavailability(
  startDate: Date,
  endDate: Date,
  reason: string
): Promise<UnavailabilityCreated> {
  const { data } = await api.post<UnavailabilityCreated>(`/unavailabilities`, {
    startDate,
    endDate,
    reason,
  });

  return data;
}
