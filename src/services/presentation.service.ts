import type { CreatedPresentation, PresentationPayloadDto, PresentationDetails } from "../types/presentation";
import api from "./api";

export async function createPresentation(
  reservation: PresentationPayloadDto
): Promise<CreatedPresentation> {
  const { data } = await api.post<CreatedPresentation>(`/presentation`, reservation);

  return data;
}

export async function editPresentation(
  presentationId: string,
  reservation: PresentationPayloadDto
): Promise<CreatedPresentation> {
  const { data } = await api.patch<CreatedPresentation>(`/presentation/${presentationId}`, reservation);

  return data;
}

export async function getPresentationById(
  id: string
): Promise<PresentationDetails> {
  const { data } = await api.get<PresentationDetails>(`/presentation/${id}`);

  return data;
}

export async function deletePresentation(
  id: string
): Promise<void> {
  await api.delete(`/presentation/${id}`);
}