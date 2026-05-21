import { Route, Routes } from "react-router";
import { TicketsAdmin } from "../pages/TicketsAdmin";
import { NotFound } from "../pages/NotFound";
import { AppLayout } from "../components/AppLayout";
import { TicketDetailsAdmin } from "../pages/TicketsDetailsAdmin";
import { TableAllTechnician } from "../pages/TableAllTechnician";
import { CreateTechnician } from "../pages/CreateTechnician";
import { EditTechnician } from "../pages/EditTechnician";
import { TableAllCustomers } from "../pages/TableAllCustomers";
import { TableAllServices } from "../pages/TableAllServices";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<TicketsAdmin />} />
        <Route path="/details/:id" element={<TicketDetailsAdmin />} />
        <Route path="/users" element={<TableAllTechnician />} />
        <Route path="/users/admin" element={<CreateTechnician />} />
        <Route path="/edit-technician/:id" element={<EditTechnician />} />
        <Route path="/customers" element={<TableAllCustomers />} />
        <Route path="/services" element={<TableAllServices />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
