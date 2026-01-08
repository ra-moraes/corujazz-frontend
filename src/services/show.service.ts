import type { Show } from "../types/show";
import api from "./api";

export async function getShows(): Promise<Show[]> {
  const { data } = await api.get<Show[]>("/shows");
  return data;
}
