// import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getAll } from "../services/tickets";
import type { Ticket } from "../dtos/tickets";
import { TicketCard } from "../components/TicketCard";
import { Alert } from "../components/Alert";

import inProgressIcon from "../assets/icons/clock-2.svg";
import openIcon from "../assets/icons/circle-help.svg";
import closedIcon from "../assets/icons/circle-check-big.svg";
import { api } from "../services/api";
import axios, { AxiosError } from "axios";

interface ApiErrorData {
  message: string;
}

export function TicketsTechnician() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [loading, setLoading] = useState(true);
  const [alertData, setAlertData] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  async function handleStatusChange(
    idCard: string,
    status: "OPEN" | "IN_PROGRESS" | "CLOSED",
  ) {
    try {
      await api.patch(`/tickets/${idCard}/status`, { status });
      setAlertData({ msg: "Status atualizado com sucesso!", type: "success" });
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === idCard ? { ...ticket, status } : ticket,
        ),
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorData>;
        const message =
          axiosError.response?.data?.message || "Erro interno no servidor";
        console.log("Status Code:", axiosError.response?.status);
        console.error(message);
        setAlertData({ msg: "Erro ao atualizar status", type: "error" });
      } else {
        setAlertData({ msg: "Ocorreu um erro inesperado.", type: "error" });
      }
    }
  }

  useEffect(() => {
    let mounted = true;
    const loadDataTickets = async () => {
      try {
        setLoading(true);

        const response = await getAll();

        if (mounted) {
          const ticketsReverse = response.data.reverse();
          setTickets(ticketsReverse);
        }
      } catch (error) {
        console.log("Erro :", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDataTickets();
    return () => {
      mounted = false;
    };
  }, []);
  const ticketsOpen = tickets.filter((t) => t.status === "OPEN");
  const ticketsInProgress = tickets.filter((t) => t.status === "IN_PROGRESS");
  const ticketsClosed = tickets.filter((t) => t.status === "CLOSED");
  if (loading) return <p>Carregando chamados...</p>;

  return (
    <main className="p-6 bg-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Meus chamados</h1>
      </header>
      {ticketsInProgress.length > 0 && (
        <section className="mb-10" aria-label="Chamados em atendimento">
          <header className="flex items-center gap-2 mb-4 bg-feedback-bg-progress text-feedback-progress w-fit px-4 py-1 rounded-full">
            <img src={inProgressIcon} alt="" className="w-4 h-4" />
            <h2 className="text-blue-700 text-xs  ">Em atendimento</h2>
          </header>

          <ul className="flex gap-4 overflow-x-auto pb-4 snap-x  custom-scrollbar">
            {ticketsInProgress.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onStatusChange={(newStatus) =>
                  handleStatusChange(ticket.id, newStatus)
                }
              />
            ))}
          </ul>
        </section>
      )}
      {ticketsOpen.length > 0 && (
        <section className="mb-10" aria-label="Chamados abertos">
          <header className="flex items-center gap-2 mb-4 bg-feedback-bg-open text-feedback-open w-fit px-4 py-1 rounded-full">
            <img src={openIcon} alt="" className="w-4 h-4" />
            <h2 className="text-red-700 text-xs  ">Aberto</h2>
          </header>

          <ul className="flex gap-4 overflow-x-auto pb-4 snap-x  custom-scrollbar">
            {ticketsOpen.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onStatusChange={(newStatus) =>
                  handleStatusChange(ticket.id, newStatus)
                }
              />
            ))}
          </ul>
        </section>
      )}

      {ticketsClosed.length > 0 && (
        <section className="mb-10" aria-label="Chamados abertos">
          <header className="flex items-center gap-2 mb-4 bg-feedback-bg-done text-feedback-done w-fit px-4 py-1 rounded-full">
            <img src={closedIcon} alt="" className="w-4 h-4" />
            <h2 className="text-green-700 text-xs  ">Encerrado</h2>
          </header>

          <ul className="flex gap-4 overflow-x-auto pb-4 snap-x  custom-scrollbar">
            {ticketsClosed.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onStatusChange={(newStatus) =>
                  handleStatusChange(ticket.id, newStatus)
                }
              />
            ))}
          </ul>
        </section>
      )}

      {alertData && (
        <Alert
          message={alertData.msg}
          type={alertData.type}
          onClose={() => setAlertData(null)}
        />
      )}
    </main>
  );
}
