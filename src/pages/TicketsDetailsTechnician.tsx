import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import axios, { AxiosError } from "axios";
import type { Ticket } from "../dtos/tickets";

import { Button } from "../components/Button";
import { Alert } from "../components/Alert";

import { calculateTicketTotal } from "../utils/calculateTotal";

import { getById } from "../services/tickets";

import { api } from "../services/api";

import { STATUS_VARIANTS } from "../constants/tickets";

import backIcon from "../assets/icons/arrow-left.svg";
import clockBlackIcon from "../assets/icons/clockBlackIcon.svg";

import closedBlackIcon from "../assets/icons/closedIconBlack.svg";
import openBlackIcon from "../assets/icons/openBlackIcon.svg";
import newServiceIcon from "../assets/icons/plusWhite.svg";
import trashIcon from "../assets/icons/trash.svg";

import { formatDate } from "../utils/formateDate";
import { formatCurrency } from "../utils/formatCurrency";
import { getInitialsName } from "../utils/getInitialsName";

import { AddServiceTechnicianModal } from "../components/addServiceTechnician";

interface ApiErrorData {
  message: string;
}

export function TicketsDetailsTechnician() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const { id } = useParams<{ id: string }>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [alertData, setAlertData] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const navigate = useNavigate();

  const baseService = ticket?.services[0];

  const additionalServices = ticket?.services.slice(1) || [];

  const total = ticket ? calculateTicketTotal(ticket.services) : 0;

  const loadTicket = useCallback(
    async (isMounted = true) => {
      if (!id) return;
      try {
        const response = await getById(id);
        if (isMounted) {
          setTicket(response?.data);
        }
      } catch (error) {
        console.log("Erro ao carregar ticket:", error);
      }
    },
    [id],
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      await loadTicket(mounted);
    })();

    return () => {
      mounted = false;
    };
  }, [loadTicket]);

  async function handleStatusChange(status: "OPEN" | "IN_PROGRESS" | "CLOSED") {
    try {
      await api.patch(`/tickets/${id}/status`, { status });
      setAlertData({ msg: "Status atualizado com sucesso!", type: "success" });
      setTicket((prev) => (prev ? { ...prev, status: status } : null));
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

  async function handleDeleteService(id: string) {
    try {
      await api.delete(`/tickets/services/${id}`);
      loadTicket();
    } catch (error) {
      console.error("Erro ao deletar serviço", error);
    }
  }
  console.log("ID da relação:", ticket?.services[0].id);
  return (
    <div className="flex flex-col ">
      <header className="px-8 pt-8 md:pt-12 flex flex-col mb-5">
        <nav>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 text-gray-300 font-semibold cursor-pointer"
          >
            <img src={backIcon} alt="" className="w-4 h-4" />
            Voltar
          </button>
        </nav>

        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-blue-dark text-2xl font-bold">
            Chamado detalhado
          </h1>

          <aside
            className="flex flex-col items-start gap-2"
            aria-labelledby="status-label"
          >
            <div className="flex items-center gap-3 w-full md:w-auto md:gap-6 mb-5 text-gray-200">
              {ticket?.status === "OPEN" && (
                <>
                  <Button
                    onClick={() => handleStatusChange("CLOSED")}
                    className="bg-gray-500 text-gray-800 font-semibold p-2.5 hover:bg-gray-600 hover:scale-105 flex gap-1.5 justify-center items-center whitespace-nowrap"
                  >
                    <img
                      src={closedBlackIcon}
                      alt="botão para encerrar chamado"
                      className="w-4 h-4"
                    />
                    {" Encerrar"}
                  </Button>

                  <Button
                    onClick={() => handleStatusChange("IN_PROGRESS")}
                    className="bg-gray-500 text-gray-800 font-semibold p-2.5 hover:bg-gray-600 hover:scale-105 flex gap-1.5 justify-center items-center whitespace-nowrap"
                  >
                    <img
                      src={clockBlackIcon}
                      alt="botão para iniciar atendimento de um chamado"
                      className="w-4 h-4"
                    />
                    {" Iniciar atendimento"}
                  </Button>
                </>
              )}

              {ticket?.status === "IN_PROGRESS" && (
                <Button
                  onClick={() => handleStatusChange("CLOSED")}
                  className="bg-gray-500 text-gray-800 font-semibold p-2.5 hover:bg-gray-600 hover:scale-105 flex gap-1.5 justify-center items-center whitespace-nowrap"
                >
                  <img src={closedBlackIcon} alt="" className="w-4 h-4" />
                  {" Encerrar"}
                </Button>
              )}

              {ticket?.status === "CLOSED" && (
                <Button
                  onClick={() => handleStatusChange("OPEN")}
                  className="bg-gray-500 text-gray-800 font-semibold p-2.5 hover:bg-gray-600 hover:scale-105 flex gap-1.5 justify-center items-center whitespace-nowrap"
                >
                  <img src={openBlackIcon} alt="" className="w-4 h-4" />
                  {"Reabrir"}
                </Button>
              )}
            </div>
          </aside>
        </section>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 px-2">
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className=" border border-gray-500 rounded-lg p-3 w-full md:max-w-5xl mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-bold text-sm block truncate max-w-30">
                {ticket?.id}
              </span>
              <div>
                {(() => {
                  if (!ticket) return <p>Carregando...</p>;
                  const variant =
                    STATUS_VARIANTS[ticket.status] || STATUS_VARIANTS.OPEN;

                  return (
                    <div
                      className={` md:w-fit h-7 flex items-center justify-center gap-1 md:1.5 rounded-4xl p-2 whitespace-nowrap} ${variant.classes}  `}
                    >
                      <img
                        src={variant.icon}
                        alt=""
                        className="w-4 h-4 shrink-0"
                      />
                      <span className="text-sm truncate max-w-20 md:w-30 md:text-clip md:text-xs md:whitespace-normal ">
                        {variant.label}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>
            <p className="text-gray-200 font-bold  mb-5">{ticket?.title} </p>
            <div className="mb-5">
              <span className="text-gray-400 font-semibold text-sm">
                Descrição
              </span>
              <p className="text-sm text-gray-200">{ticket?.description}</p>
            </div>
            <div className="mb-5">
              <span className="text-gray-400 font-semibold text-sm">
                Categoria
              </span>
              <p className="text-sm text-gray-200">
                {ticket?.services[0].service.name}
              </p>
            </div>
            <div className="flex justify-between mb-5">
              <div>
                <span className="text-gray-400 font-semibold text-sm">
                  Criado em
                </span>
                <p className="text-sm text-gray-200">
                  {formatDate(ticket?.createdAt)}
                </p>
              </div>
              <div>
                <span className="text-gray-400 font-semibold text-sm">
                  Atualizado em
                </span>
                <p className="text-sm text-gray-200">
                  {formatDate(ticket?.updatedAt)}
                </p>
              </div>
            </div>
            <div>
              <span className="text-gray-400 font-semibold text-sm">
                Cliente
              </span>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-dark flex items-center justify-center">
                  {ticket?.customer?.avatar ? (
                    <img
                      src={ticket.customer?.avatar}
                      alt={ticket.customer?.name}
                      className="w-full h-full object-cover rounded-4xl"
                    />
                  ) : (
                    <span className="text-gray-400 font-bold text-sm">
                      {getInitialsName(ticket?.customer?.name || "")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-200">
                  {ticket?.customer?.name}
                </p>
              </div>
            </div>
          </div>
          <div className=" border border-gray-500 rounded-lg p-3 w-full md:max-w-5xl order-last md:order-0">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-semibold text-sm">
                  Serviços adicionais
                </span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-7 h-7 bg-gray-200 flex justify-center items-center p-0.5 rounded-lg"
                >
                  <img src={newServiceIcon} alt="" className="w-4 h-4" />
                </button>
              </div>
              {ticket?.services && ticket.services.length > 0 ? (
                ticket.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex justify-between items-center mt-4 border-b border-gray-450"
                  >
                    <p className="text-gray-100 text-xs font-semibold mb-2">
                      {service.service.name}
                    </p>
                    <div className="flex gap-1 md:gap-10 items-center">
                      <span className="text-gray-100 text-xs font-semibold mb-2">
                        {formatCurrency(service.service.price)}
                      </span>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="w-7 h-7 bg-gray-500 flex justify-center items-center p-0.5 rounded-lg mb-2"
                      >
                        <img
                          src={trashIcon}
                          alt="botao para deletar um chamado"
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-xs mt-2">
                  Nenhum serviço adicionado.
                </p>
              )}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className=" border border-gray-500 rounded-lg p-3 w-full md:max-w-3xl mb-4">
            <div className="flex flex-col">
              <span className="text-gray-400 font-semibold text-sm">
                Técnico responsável
              </span>
              {ticket?.technician ? (
                <div className="flex gap-2 mb-8">
                  <div className="w-8 h-8 rounded-full bg-blue-dark flex items-center justify-center">
                    {ticket?.technician?.avatar ? (
                      <img
                        src={ticket.technician?.avatar}
                        alt={ticket.technician?.name}
                        className="w-full h-full object-cover rounded-4xl"
                      />
                    ) : (
                      <span className="text-gray-400 font-bold text-sm">
                        {getInitialsName(ticket.technician?.name || "")}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-200 text-xs ">
                      {ticket?.technician?.name ?? ""}
                    </p>
                    <p className="text-gray-300 text-xs">
                      {ticket?.technician?.email ?? ""}
                    </p>
                  </div>
                </div>
              ) : (
                <span className="text-gray-300">Não atribuido</span>
              )}

              <div>
                <span className="text-gray-400 font-semibold text-sm">
                  Valores
                </span>
                <p className="text-gray-200 text-xs flex justify-between">
                  Preço base{" "}
                  <span className="">
                    {baseService
                      ? formatCurrency(baseService.service.price)
                      : "R$ 0,00"}
                  </span>
                </p>
              </div>
              <div className="">
                <span className="text-gray-400 font-semibold text-sm">
                  Adicionais
                </span>

                {additionalServices.length > 0 && (
                  <div className="mt-4">
                    <span className="text-gray-400 block mb-1">Adicionais</span>
                    {additionalServices.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300">
                          {item.service.name}
                        </span>
                        <span className="text-gray-200">
                          {formatCurrency(item.service.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <hr className="border-t border-gray-500 my-4" />
                <p className="text-gray-200 font-bold text-sm flex justify-between pb-4 ">
                  Total{" "}
                  <span className="font-bold text-sm">
                    {formatCurrency(total)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
      <AddServiceTechnicianModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={loadTicket}
        ticketId={id}
      />
      {alertData && (
        <Alert
          message={alertData.msg}
          type={alertData.type}
          onClose={() => setAlertData(null)}
        />
      )}
    </div>
  );
}
