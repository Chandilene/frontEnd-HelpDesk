// import { Alert } from "./Alert";
import { useEffect, useState } from "react";
import closeIcon from "../assets/icons/x.svg";
import type { ServiceDTO } from "../dtos/service";
// import { formatCurrency } from "../utils/formatCurrency";

import { Input } from "./Input";
import { Select } from "./Select";
import { api } from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";
import { Alert } from "./Alert";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
  //   service?: ServiceDTO | null;
  ticketId: string | undefined;
}

export function AddServiceTechnicianModal({
  isOpen,
  onClose,
  onSubmit,
  ticketId,
}: ServiceModalProps) {
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  const [alertData, setAlertData] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    async function loadServicesInSelect() {
      try {
        const response = await api.get("/services");
        setServices(response.data);
      } catch (error) {
        console.error("Erro ao carregar serviços no select", error);
      }
    }

    if (isOpen) {
      loadServicesInSelect();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedServiceId("");
    }
  }, [isOpen]);

  const selectedService = services.find((s) => s.id === selectedServiceId);

  async function handleAddService() {
    if (!selectedServiceId) {
      setAlertData({ msg: "Selecione um serviço", type: "error" });
      return;
    }

    try {
      await api.post(`/tickets/${ticketId}/services`, {
        services: [selectedServiceId],
      });

      if (onSubmit) {
        await onSubmit();
      }

      onClose();
    } catch (error) {
      console.error("Erro ao adicionar serviço ao chamado:", error);
    }
  }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4">
      <div className="bg-white w-full max-w-125 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-500 relative">
          <h2 className="text-xl font-bold text-gray-900">Serviço adicional</h2>
          <button onClick={onClose} className="p-1 cursor-pointer">
            <img src={closeIcon} alt="Fechar" />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Select
                className="text-gray-200"
                legend="título"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Select>
              <Input
                legend="Valor"
                disabled
                value={
                  selectedService ? formatCurrency(selectedService.price) : ""
                }
              />
            </div>
          </div>

          <button
            onClick={handleAddService}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl mt-4 hover:bg-gray-800 transition-all cursor-pointer"
          >
            Salvar
          </button>
        </div>

        {alertData && (
          <Alert
            message={alertData.msg}
            type={alertData.type}
            onClose={() => setAlertData(null)}
          />
        )}
      </div>
    </div>
  );
}
