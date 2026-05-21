import { useEffect, useState, useCallback } from "react";
import type { ServiceDTO } from "../dtos/service";

import editIcon from "../assets/icons/pen-line.svg";
import plusWhiteIcon from "../assets/icons/plusWhite.svg";

import { Button } from "../components/Button";
import { getServices } from "../services/services";
import { SERVICE_STATUS_VARIANTS } from "../constants/services";

import { formatCurrency } from "../utils/formatCurrency";
import { api } from "../services/api";
import { Alert } from "../components/Alert";
import type { AxiosError } from "axios";

import { ServiceModal } from "../components/ServiceModal";

interface ApiErrorData {
  message: string;
}

export function TableAllServices() {
  const [selectedService, setSelectedService] = useState<ServiceDTO | null>(
    null,
  );
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [alertData, setAlertData] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const loadAllServices = useCallback(async (isMounted = true) => {
    try {
      const response = await getServices();
      if (isMounted) {
        setServices(response);
      }
    } catch (error) {
      console.log("Erro ao carregar:", error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await loadAllServices(mounted);
    })();

    return () => {
      mounted = false;
    };
  }, [loadAllServices]);

  async function handleChangeStatus(id: string, currentStatus: boolean) {
    try {
      const newStatus = !currentStatus;
      await api.put(`/services/${id}`, { isActive: newStatus });
      setAlertData({
        msg: "O status do serviço foi alterado",
        type: "success",
      });
      await loadAllServices();
    } catch (err) {
      const error = err as AxiosError<ApiErrorData>;
      setAlertData({
        msg:
          error.response?.data?.message ||
          "Erro ao atualizar status do serviço.",
        type: "error",
      });
    }
  }

  if (loading) return <p>Carregando clientes...</p>;

  return (
    <div>
      <div className="flex justify-between">
        {" "}
        <h1 className="text-blue-dark text-3xl font-bold mt-7">Serviços</h1>
        <Button
          className="flex gap-2 justify-center px-4 mt-7"
          onClick={() => {
            setSelectedService(null);
            setIsModalOpen(true);
          }}
        >
          <img src={plusWhiteIcon} alt="" />
          <span className="hidden md:block">NOVO</span>
        </Button>
      </div>

      <div className="w-full border border-gray-500 rounded-2xl overflow-hidden mt-6 p-2">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="">
              <th className=" md:w-30 text-gray-400 text-sm text-left border-b border-gray-500">
                Título
              </th>
              <th className="text-gray-400 md:text-sm md:table-cell text-left border-b border-gray-500">
                Valor
              </th>
              <th className=" text-gray-400 text-sm text-left border-b border-gray-500 ">
                Status
              </th>
              <th className="border-b border-gray-500"> </th>
            </tr>
          </thead>

          <tbody className="w-full ">
            {services.map((service) => {
              const statusKey = service.isActive ? "active" : "inactive";
              const variant = SERVICE_STATUS_VARIANTS[statusKey];

              return (
                <tr
                  key={service.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="border-b border-gray-500 px-2 py-5 text-sm shrink-0 overflow-hidden">
                    <p className="text-gray-200   block max-w-16 md:max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {service.name}
                    </p>
                  </td>
                  <td className="text-gray-900 whitespace-nowrap text-xs md:text-sm border-b border-gray-500 px-2 py-5">
                    {formatCurrency(service.price)}
                  </td>
                  <td className="border-b border-gray-500 px-2 py-5">
                    <span
                      className={`hidden md:inline-block  text-[10px] md:text-xs font-bold px-2 py-1 rounded-full uppercase ${variant.badgeClasses}`}
                    >
                      {variant.label}
                    </span>
                    <img
                      src={variant.badgeIcon}
                      alt={variant.label}
                      className="w-7 h-7 min-w-7 min-h-7 shrink-0 md:hidden"
                    />
                  </td>

                  <td className="border-b border-gray-500 px-2 py-5 text-right">
                    <div className="flex justify-end items-center gap-1 md:gap-2">
                      <button
                        onClick={() =>
                          handleChangeStatus(service.id, service.isActive)
                        }
                        className={`flex items-center justify-center gap-2 p-2.5 hover:bg-gray-500 rounded-xl text-gray-300 font-bold text-sm transition-colors cursor-pointer min-w-9 min-h-9 ${variant.buttonClasses}`}
                      >
                        <img
                          src={variant.buttonIcon}
                          alt="Reativar serviço"
                          className="w-6 h-6 min-w-6 min-h-6 shrink-0 opacity-80"
                        />

                        <span className="hidden md:block">
                          {variant.buttonLabel}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedService(service);
                          setIsModalOpen(true);
                        }}
                        title="Editar"
                        className="p-2 bg-gray-500 hover:bg-gray-600 rounded-xl transition-colors cursor-pointer flex items-center justify-center min-w-9 min-h-9"
                      >
                        <img
                          src={editIcon}
                          alt="Editar"
                          className="w-6 h-6 min-w-6 min-h-6 shrink-0 opacity-80"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ServiceModal
        key={selectedService?.id || "new"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => loadAllServices()}
        service={selectedService} // Se for criação, passe null
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
