export type Ticket = {
  id: string;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  description: string;
  createdAt: string;
  updatedAt: string;
  technician?: {
    name: string;
    email: string;
    avatar?: string;
  };
  customer?: {
    name: string;
    avatar?: string;
  };
  services: {
    id: string;
    service: {
      id: string;
      name: string;
      price: number;
    };
  }[];
};

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
