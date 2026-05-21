import { api } from "./api";

export async function getServices() {
  const response = await api.get("/services", {
    params: { role: "ADMIN" },
  });
  return response.data;
}
