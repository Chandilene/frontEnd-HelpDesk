import type { Ticket } from "../dtos/tickets";
export function calculateTicketTotal(services: Ticket["services"]) {
  return services.reduce((acc, item) => {
    return acc + Number(item.service.price || 0);
  }, 0);
}
