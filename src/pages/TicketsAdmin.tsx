import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getAll } from "../services/tickets";
import { useNavigate } from "react-router";

import editIcon from "../assets/icons/pen-line.svg";

import { STATUS_VARIANTS } from "../constants/tickets";

import type { Ticket } from "../dtos/tickets";
import { formatCurrency } from "../utils/formatCurrency";
import { calculateTicketTotal } from "../utils/calculateTotal";
import { formatDate } from "../utils/formateDate";

export function TicketsAdmin() {
  const { session } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  console.log(session);

  function handleDetails(id: string) {
    navigate(`/details/${id}`);
  }

  useEffect(() => {
    let mounted = true;
    const loadDataTickets = async () => {
      try {
        setLoading(true);

        const response = await getAll();

        if (mounted) {
          setTickets(response.data);
        }

        console.log(response);
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

  if (loading) return <p>Carregando chamados...</p>;

  return (
    <div>
      <div>
        {" "}
        <h1 className="text-blue-dark text-3xl font-bold mt-7"> Chamados</h1>
      </div>

      <div className="w-full border border-gray-500 rounded-2xl overflow-hidden mt-6 p-4">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="">
              <th className=" md:w-28 text-gray-400 text-sm text-left border-b border-gray-500">
                Atualizado em
              </th>
              <th className="hidden md:text-gray-400 md:text-sm md:table-cell text-left border-b border-gray-500">
                Id
              </th>
              <th className="text-gray-400 text-sm text-left border-b border-gray-500 ">
                Título e Serviço
              </th>

              <th className="hidden md:text-gray-400 md:text-sm md:table-cell text-left border-b border-gray-500">
                Valor total
              </th>
              <th className="hidden md:text-gray-400 md:text-sm md:table-cell text-left border-b border-gray-500 ">
                Cliente
              </th>
              <th className="hidden md:text-gray-400 md:text-sm md:table-cell text-left border-b border-gray-500">
                Técnico
              </th>
              <th className="text-gray-400 text-sm text-left border-b border-gray-500">
                Status
              </th>
              <th className="border-b border-gray-500"> </th>
            </tr>
          </thead>

          <tbody className="w-full ">
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className=" w-20 md:w-28 text-xs py-4 px-4 text-gray-200 border-b border-gray-500">
                  {formatDate(ticket.updatedAt)}
                </td>
                <td className="hidden md:text-gray-200 md:text-xs md:table-cell font-semibold border-b border-gray-500">
                  {ticket.id}
                </td>
                <td className=" flex flex-col text-sm text-gray-200 font-semibold w-36 md:table-cell md:w-52 border-b border-gray-500 wrap-normal">
                  <p>{ticket.title}</p>
                  <p className="text-xs font-normal">
                    {ticket.services[0]?.service.name}
                  </p>
                </td>
                <td className="hidden md:text-gray-200 md:text-sm md:table-cell border-b border-gray-500">
                  {formatCurrency(calculateTicketTotal(ticket.services))}
                </td>
                <td className="hidden md:text-gray-200 md:text-sm md:table-cell border-b border-gray-500">
                  nome do cliente
                </td>
                <td className="hidden md:text-gray-200 md:text-sm md:table-cell border-b border-gray-500">
                  {ticket.technician?.name || "Pendente"}
                </td>
                <td className="table-cell border-b border-gray-500 text-center">
                  {(() => {
                    const variant =
                      STATUS_VARIANTS[ticket.status] || STATUS_VARIANTS.OPEN;

                    return (
                      <div
                        className={`w-7 h-7 md:w-fit  md:h-7 flex items-center justify-center gap-1.5 rounded-full md:rounded-4xl md:p-2  whitespace-nowrap} ${variant.classes}  `}
                      >
                        <img src={variant.icon} alt="" className="w-4 h-4" />
                        <span className="hidden md:flex md:text-xs">
                          {variant.label}
                        </span>
                      </div>
                    );
                  })()}
                </td>
                <td className="table-cell border-b border-gray-500">
                  <button
                    onClick={() => handleDetails(ticket.id)}
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-gray-500"
                  >
                    <img src={editIcon} alt="" className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            <tr></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
