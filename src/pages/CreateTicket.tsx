import { api } from "../services/api";
import { useState, useEffect } from "react";
import { formatCurrency } from "../utils/formatCurrency";

import { Input } from "../components/Input";
import { TextArea } from "../components/TextArea";
import { Select } from "../components/Select";
import { Alert } from "../components/Alert";

type ServiceAPI = {
  id: string;
  name: string;
  price: string;
};

export function CreateTicket() {
  const [services, setServices] = useState<ServiceAPI[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [alertData, setAlertData] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await api.get("/services");
        console.log(response.data);
        setServices(response.data);
      } catch (error) {
        console.error("Erro ao buscar serviços.", error);
      }
    }
    loadServices();
  }, []);

  const selectedService = services.find((s) => s.id === selectedServiceId);

  async function handleCreateTicket(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");

    if (!selectedServiceId) {
      return setErrorMessage("Selecione um serviço");
    }

    if (title.trim().length < 5) {
      return setErrorMessage("O título deve ter pelo menos 5 caracteres.");
    }

    if (description.trim().length < 10) {
      return setErrorMessage(
        "A descrição precisa ser mais detalhada (min. 10 caracteres).",
      );
    }

    try {
      const data = {
        title,
        description,
        services: [selectedServiceId],
      };

      await api.post("/tickets", data);

      setAlertData({ msg: "Chamado criado com sucesso!", type: "success" });
      setTitle("");
      setDescription("");
      setSelectedServiceId("");
    } catch (error: any) {
      let message = error.response?.data?.message;

      if (error.response?.data?.errors) {
        message = error.response.data.errors[0].message;
      }

      setErrorMessage(message || "Erro ao validar dados do chamado.");
      console.error("Detalhes do erro:", error.response?.data);
      setAlertData({ msg: "Erro ao conectar com o servidor.", type: "error" });
    }
  }

  return (
    <div className=" min-h-screen flex flex-col p-7">
      <div>
        <h1 className="text-blue-dark text-[20px] md:text-2xl font-bold mb-8">
          Novo chamado
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="flex-1 border border-gray-500 p-8 rounded-lg mb-4">
          <h2 className="text-gray-200 font-bold">Informações</h2>
          <p className="text-xs text-gray-300 mb-6">
            Configure os dias e horários em que você está disponível para
            atender chamados
          </p>

          <form onSubmit={handleCreateTicket} className="">
            <Input
              legend="Título"
              placeholder="Digite um título para o chamado"
              value={title}
              className="border-b-gray-500"
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextArea
              legend="descrição"
              placeholder="Descreva o que está acontecendo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <hr className="border-t border-gray-500 my-4" />

            <Select
              legend="Categoria de serviço"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
            >
              {services.map((item) => (
                <option key={item.id} value={item.id} className="bg-gray-600">
                  {item.name}
                </option>
              ))}
            </Select>
          </form>
        </div>
        <aside className="border border-gray-500 p-8 rounded-lg w-full lg:max-w-sm">
          <header className="mb-5">
            <h2 className="text-gray-200 text-xl font-bold">Resumo</h2>
            <p className="text-gray-300 text-sm">Valores e detalhes</p>
          </header>

          <dl className="space-y-6">
            <div>
              <dt className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                Categoria de serviço
              </dt>
              <dd className="text-gray-800 text-lg font-medium">
                {selectedService?.name}
              </dd>
            </div>

            <div>
              <dt className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                Custo inicial
              </dt>
              <dd className="text-gray-800 text-2xl font-bold mb-5">
                {selectedService
                  ? formatCurrency(Number(selectedService?.price))
                  : "R$ 0,00"}
              </dd>
            </div>
          </dl>

          <p className="text-gray-300 text-xs leading-relaxed mb-4">
            O chamado será automaticamente atribuído a um técnico disponível
          </p>

          {errorMessage && (
            <p className="text-red-500 text-sm font-semibold mb-4 bg-red-100 p-3 rounded border border-red-200">
              ⚠️ {errorMessage}
            </p>
          )}

          <button
            onClick={handleCreateTicket}
            type="submit"
            className="w-full bg-gray-900 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Criar chamado
          </button>
        </aside>
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
