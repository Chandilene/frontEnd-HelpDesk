import { api } from "./api";

export async function getTechnicians() {
  const response = await api.get("/users", {
    params: { role: "TECHNICIAN" },
  });
  return response.data;
}

export async function getCustomers() {
  const response = await api.get("/users", {
    params: { role: "CUSTOMER" },
  });
  return response.data;
}
