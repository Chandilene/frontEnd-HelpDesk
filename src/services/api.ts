import axios from "axios";
import Swal from "sweetalert2";

export const api = axios.create({
  baseURL: "http://localhost:3333",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("@helpdesk:user");
      localStorage.removeItem("@helpdesk:token");

      Swal.fire({
        title: "Sessão Expirada!",
        text: "Seu tempo de acesso acabou. Por favor, faça login novamente para continuar.",
        icon: "warning",
        confirmButtonText: "Ir para o Login",
        confirmButtonColor: "#0044ff",
        background: "#1e2024",
        color: "#ffffff",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/";
        }
      });
    }

    return Promise.reject(error);
  },
);
