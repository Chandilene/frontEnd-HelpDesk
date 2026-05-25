import editIcon from "../assets/icons/pen-line.svg";
import closedIcon from "../assets/icons/closedIconWhite.svg";
import tagStatusInProgress from "../assets/icons/TagStatusInProgress.svg";
import tagStatusOpen from "../assets/icons/TagStatusOpen.svg";
import tagStatusClosed from "../assets/icons/TagStatusGreen.svg";
import inProgressIcon from "../assets/icons/clockWhiteIcon.svg";
import { useNavigate } from "react-router";

import type { Ticket } from "../dtos/tickets";

import { formatDate } from "../utils/formateDate";
import { formatCurrency } from "../utils/formatCurrency";
import { calculateTicketTotal } from "../utils/calculateTotal";
import { getInitialsName } from "../utils/getInitialsName";

interface TicketCardProps {
  ticket: Ticket;
  onStatusChange: (newStatus: "OPEN" | "IN_PROGRESS" | "CLOSED") => void;
}

export function TicketCard({ ticket, onStatusChange }: TicketCardProps) {
  const navigate = useNavigate();
  function handleDetails(id: string) {
    navigate(`/details/${id}`);
  }
  function getByStatusStyles() {
    if (ticket.status === "OPEN") {
      return {
        nextStatus: "IN_PROGRESS" as const,
        buttonText: "Iniciar",
        buttonIcon: inProgressIcon,
        statusIcon: tagStatusOpen,
      };
    } else if (ticket.status === "IN_PROGRESS") {
      return {
        nextStatus: "CLOSED" as const,
        buttonText: "Encerrar",
        buttonIcon: closedIcon,
        statusIcon: tagStatusInProgress,
      };
    } else {
      return {
        buttonText: null,
        buttonIcon: null,
        statusIcon: tagStatusClosed,
      };
    }
  }

  const styles = getByStatusStyles();
  return (
    <li className="snap-start list-none">
      <article className="min-w-80 md:min-w-87.5 bg-white border border-gray-450 rounded-xl p-5 shadow-sm">
        <header className="flex justify-between items-center text-[12px] text-gray-400 mb-2">
          <span className="text-[12px] font-medium max-w-15 truncate">
            {ticket.id}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => handleDetails(ticket.id)}
              title="Editar"
              className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer bg-gray-500"
            >
              <img src={editIcon} className="w-4 h-4" alt="" />
            </button>
            {styles.buttonText && (
              <button
                onClick={() =>
                  styles.nextStatus && onStatusChange(styles.nextStatus)
                }
                className="flex items-center justify-center gap-2 px-2 py-1 text-gray-600 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <img
                  src={styles.buttonIcon}
                  className="w-3.5 h-3.5 "
                  alt={styles.buttonText}
                />
                {styles.buttonText}
              </button>
            )}
          </div>
        </header>

        <div className="mb-4">
          <h3 className="font-bold text-gray-100">{ticket.title}</h3>
          <p className="text-sm text-gray-200 ">
            {ticket.services[0]?.service.name}
          </p>
        </div>

        <div className="flex justify-between items-center mt-5 ">
          <span className="text-xs text-gray-200 font-medium">
            {formatDate(ticket.updatedAt)}
          </span>
          <span className="font-bold text-sm text-gray-900">
            {formatCurrency(calculateTicketTotal(ticket.services))}
          </span>
        </div>

        <footer className="mt-4 pt-4 border-t flex justify-between items-center">
          <div className="flex gap-2 justify-items-start items-center">
            <div className="w-6 h-6 rounded-full bg-blue-dark flex items-center justify-center overflow-hidden shrink-0">
              {ticket.customer?.avatar ? (
                <img
                  src={ticket.customer.avatar}
                  alt={ticket.customer?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white  text-sm">
                  {getInitialsName(ticket.customer?.name || "")}
                </span>
              )}
            </div>
            <span className="text-gray-700 font-bold text-xs">
              {ticket.customer?.name || "Cliente"}
            </span>
          </div>

          <div className="flex items-center justify-center w-7 h-7  rounded-full text-feedback-progress">
            <img src={styles.statusIcon} alt="" className="w-7 h-7" />
          </div>
        </footer>
      </article>
    </li>
  );
}
