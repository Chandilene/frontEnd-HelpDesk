import { api } from "./api";

export async function getAll() {
  const response = await api.get("/tickets");
  return response;
}

export async function getById(id: string) {
  try {
    const response = await api.get(`/tickets/${id}`);
    return response;
  } catch (error) {
    console.error("Erro ao buscar ticket", error);
  }
}
