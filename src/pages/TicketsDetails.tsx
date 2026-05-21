import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import type { Ticket } from "../dtos/tickets";

import { calculateTicketTotal } from "../utils/calculateTotal";

import { getById } from "../services/tickets";

// import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";

import { STATUS_VARIANTS } from "../constants/tickets";

import backIcon from "../assets/icons/arrow-left.svg";
import { formatDate } from "../utils/formateDate";
import { formatCurrency } from "../utils/formatCurrency";

export function TicketDetails() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  // const auth = useAuth();

  const baseService = ticket?.services[0];

  const additionalServices = ticket?.services.slice(1) || [];

  const total = ticket ? calculateTicketTotal(ticket.services) : 0;

  const getInitialsName = (name: string) => {
    if (!name) return "??";

    const names = name.split(" ");
    const first = names[0]?.[0] || "";
    const last = names.length > 1 ? names[names.length - 1][0] : "";
    return (first + last).toUpperCase();
  };

  useEffect(() => {
    let mounted = true;
    const loadTicket = async () => {
      if (!id) return;
      try {
        const response = await getById(id);

        if (mounted) {
          return setTicket(response?.data);
        }
      } catch (error) {
        console.log("Erro :", error);
      }
    };
    loadTicket();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="flex flex-col ">
      <div className="px-8 pt-8 md:pt-12 flex flex-col items-start mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 text-gray-300 font-semibold cursor-pointer"
        >
          <img src={backIcon} alt="" className="w-4 h-4" />
          Voltar
        </button>
        <h1 className="text-blue-dark text-2xl font-bold">Chamado detalhado</h1>
      </div>

      <div className=" border border-gray-500 rounded-lg p-5 w-full md:max-w-3xl mb-4">
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
                  <img src={variant.icon} alt="" className="w-4 h-4 shrink-0" />
                  <span className="text-sm truncate max-w-20 md:w-30 md:text-clip md:text-xs md:whitespace-normal ">
                    {variant.label}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>
        <p className="text-gray-200 font-bold ">{ticket?.title} </p>
        <div>
          <span className="text-gray-400 font-semibold text-sm">Descrição</span>
          <p className="text-sm text-gray-200">{ticket?.description}</p>
        </div>
        <div>
          <span className="text-gray-400 font-semibold text-sm">Categoria</span>
          <p className="text-sm text-gray-200">
            {ticket?.services[0].service.name}
          </p>
        </div>
        <div className="flex justify-between">
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
      </div>

      <div className=" border border-gray-500 rounded-lg p-5 w-full md:max-w-3xl mb-4">
        <div className="flex flex-col">
          <span className="text-gray-400 font-semibold text-sm">
            Técnico responsável
          </span>
          {ticket?.technician ? (
            <div className="flex gap-2 mb-8">
              <div className="w-8 h-8 rounded-full bg-blue-dark flex items-center justify-center">
                {ticket?.technician?.avatar ? (
                  <img
                    src={`${api.defaults.baseURL}/files/${ticket.technician?.avatar}`}
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
            <span className="text-gray-400 font-semibold text-sm">Valores</span>
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
                    <span className="text-gray-300">{item.service.name}</span>
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
              <span className="font-bold text-sm">{formatCurrency(total)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
