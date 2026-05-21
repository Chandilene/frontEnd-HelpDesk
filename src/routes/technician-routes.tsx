import { Route, Routes } from "react-router";
import { TicketsTechnician } from "../pages/TicketsTechnician";
import { TicketsDetailsTechnician } from "../pages/TicketsDetailsTechnician";
import { NotFound } from "../pages/NotFound";
import { AppLayout } from "../components/AppLayout";

export function TechnicianRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<TicketsTechnician />} />
        <Route path="/details/:id" element={<TicketsDetailsTechnician />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
