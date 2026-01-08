import api from "../../services/api";
import type { CreateEstablishmentDto, EstablishmentCreated } from "../../types/establishment";

export async function createEstablishment(
  establishment: CreateEstablishmentDto
): Promise<EstablishmentCreated> {
  const { data } = await api.post<EstablishmentCreated>(`/establishments`, establishment);

  return data;
}