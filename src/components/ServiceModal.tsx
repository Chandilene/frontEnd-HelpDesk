import { useState } from "react";
import { AxiosError } from "axios";
import { api } from "../services/api";
import type { ServiceDTO } from "../dtos/service";
import { Alert } from "./Alert";

import { Input } from "./Input";

import closeIcon from "../assets/icons/x.svg";
import { formatCurrency } from "../utils/formatCurrency";
import { z, ZodError } from "zod";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  service?: ServiceDTO | null;
}

interface ApiErrorData {
  message: string;
}

const bodySchema = z.object({
  name: z.string().trim().min(4, { message: "Nome do serviço é obrigatório" }),
  price: z.number().positive("O preço deve ser um valor positivo"),
});

export function ServiceModal({
  isOpen,
  onClose,
  onSubmit,
  service,
}: ServiceModalProps) {
  const [alertData, setAlertData] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const [name, setName] = useState(service?.name || "");
  const [value, setValue] = useState(
    service ? String(service.price * 100) : "",
  );

  const closeModal = () => {
    setAlertData(null);
    onClose();
  };

  async function handleSubmit() {
    try {
      const data = bodySchema.parse({
        name,
        price: Number(value) / 100,
      });

      if (service) {
        await api.put(`/services/${service.id}`, data);
        setAlertData({
          msg: "Serviço atualizado com sucesso!",
          type: "success",
        });
      } else {
        await api.post("/services", data);
        setAlertData({ msg: "Serviço criado com sucesso!", type: "success" });
        setName("");
        setValue("");
      }

      onSubmit();

      setTimeout(closeModal, 2000);
      setName("");
      setValue("");
    } catch (err) {
      if (err instanceof ZodError) {
        return setAlertData({
          msg: err.issues[0].message,
          type: "error",
        });
      }
      const error = err as AxiosError<ApiErrorData>;
      setAlertData({
        msg: error.response?.data?.message || "Erro ao criar serviço.",
        type: "error",
      });
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4">
      <div className="bg-white w-full max-w-125 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-500 relative">
          <h2 className="text-xl font-bold text-gray-900">
            {service ? "Serviço" : "Cadastro de serviço"}
          </h2>
          <button onClick={onClose} className="p-1 cursor-pointer">
            <img src={closeIcon} alt="Fechar" />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Input
                legend="Título"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do serviço"
              />
              <Input
                legend="Valor"
                value={formatCurrency(Number(value) / 100)}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "");
                  setValue(rawValue);
                }}
                placeholder="Valor do serviço"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
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
