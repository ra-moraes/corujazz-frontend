import type { Establishment } from "../types/establishment";
import api from "./api";

export async function getEstablishments(): Promise<Establishment[]> {
  const { data } = await api.get<Establishment[]>("/establishments");
  return data;
}
