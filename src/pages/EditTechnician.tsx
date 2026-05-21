import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { z } from "zod";

import { Alert } from "../components/Alert";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import backIcon from "../assets/icons/arrow-left.svg";
import { api } from "../services/api";

const MORNING_HOURS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"];
const AFTERNOON_HOURS = ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const NIGHT_HOURS = ["19:00", "20:00", "21:00", "22:00", "23:00"];

const bodySchema = z.object({
  name: z.string().trim().min(1, { message: "Informe o nome" }),
  email: z.string().email({ message: "Email inválido" }),
  role: z.enum(["TECHNICIAN"]),
  schedule: z
    .array(z.string())
    .min(1, { message: "Selecione o horário de trabalho" }),
});

export function EditTechnician() {
  const [alertData, setAlertData] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const navigate = useNavigate();

  const { id } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedHours, setSelectedHours] = useState<string[]>([]);

  function handleSelectHour(hour: string) {
    setSelectedHours((prev) => {
      if (prev.includes(hour)) {
        return prev.filter((h) => h !== hour);
      }

      return [...prev, hour];
    });
  }

  useEffect(() => {
    async function fetchTech() {
      if (!id) return;

      try {
        const response = await api.get(`/users/${id}`);
        const { name, email, schedule } = response.data;
        setName(name);
        setEmail(email);
        setSelectedHours(schedule || []);
        console.log("Dados do técnico carregados:", response.data);
      } catch (error) {
        console.error("Erro ao carregar técnico", error);
        setAlertData({
          msg: "Não foi possível carregar os dados.",
          type: "error",
        });
      }
    }
    fetchTech();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    const result = bodySchema.safeParse({
      name: name,
      email: email,
      role: "TECHNICIAN",
      schedule: selectedHours,
    });

    if (!result.success) {
      const firstError = result.error.issues[0].message;
      setAlertData({ msg: firstError, type: "error" });
      return;
    }

    try {
      await api.put(`/users/${id}`, result.data);
      setAlertData({ msg: "Técnico atualizado com sucesso!", type: "success" });
    } catch (error) {
      console.log(error);
      setAlertData({ msg: "Erro ao conectar com o servidor.", type: "error" });
    }
  }

  return (
    <div className="flex flex-col justify-center px-4 md:px-20 lg:px-50">
      <header className="pt-8 md:pt-12 flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="md:flex flex-col items-start">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 text-gray-300 font-semibold cursor-pointer"
          >
            <img src={backIcon} alt="" className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-blue-dark text-2xl font-bold">
            Editar perfil de técnico
          </h1>
        </div>

        <section className="flex gap-2 w-full md:w-auto ">
          <Button
            onClick={() => navigate(-1)}
            className="flex-1 md:w-32 bg-gray-500 text-sm font-bold text-gray-800 hover:bg-gray-600 hover:scale-105"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="edit-form"
            className="flex-1 md:w-32  text-sm font-bold text-gray-600 hover:bg-gray-700 hover:scale-105"
          >
            Salvar
          </Button>
        </section>
      </header>
      <div className="flex flex-col md:flex-row md:justify-between gap-6">
        <section className="mt-4 w-full md:max-w-87.5 border border-gray-500 rounded-lg p-5">
          <h2 className="text-gray-100 font-bold">Dados pessoais</h2>
          <p className="text-gray-300 text-xs">
            Defina as informações do perfil de técnico
          </p>
          <form onSubmit={handleUpdate} id="edit-form" className="mt-5">
            <Input
              required
              className="mb-5"
              legend="nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              required
              className="mb-5"
              type="email"
              legend="e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </form>
        </section>

        <section className="mt-4 mb-5  w-full md:max-w-3xl border border-gray-500 rounded-lg p-5">
          <h2 className="text-gray-100 font-bold">Horários de atendimento</h2>
          <p className="text-gray-300 text-xs">
            Selecione os horários de disponibilidade do técnico para atendimento
          </p>

          <div className="mt-5">
            <span className="text-gray-300 uppercase text-[10px] ">Manhã</span>
            <ul className="flex gap-1 flex-wrap mt-2">
              {MORNING_HOURS.map((hour) => (
                <li
                  key={hour}
                  onClick={() => handleSelectHour(hour)}
                  className={`cursor-pointer border py-1.5 px-3 rounded-2xl transition-all duration-200 text-xs md:text-sm
          ${
            selectedHours.includes(hour)
              ? "bg-blue-dark text-white border-blue-dark shadow-md scale-105"
              : "text-gray-200 border-gray-400 hover:border-blue-light"
          }`}
                >
                  {hour}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5">
            <span className="text-gray-300 uppercase text-[10px] ">tarde</span>
            <ul className="flex gap-1 flex-wrap mt-2">
              {AFTERNOON_HOURS.map((hour) => (
                <li
                  key={hour}
                  onClick={() => handleSelectHour(hour)}
                  className={`cursor-pointer border py-1.5 px-3 rounded-2xl transition-all duration-200 text-xs md:text-sm ${
                    selectedHours.includes(hour)
                      ? "bg-blue-dark text-white border-blue-dark shadow-md scale-105"
                      : "text-gray-200 border-gray-400 hover:border-blue-light"
                  }`}
                >
                  {hour}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5">
            <span className="text-gray-300 uppercase text-[10px] ">noite</span>
            <ul className="flex gap-1 flex-wrap mt-2">
              {NIGHT_HOURS.map((hour) => (
                <li
                  key={hour}
                  onClick={() => handleSelectHour(hour)}
                  className={`cursor-pointer border py-1.5 px-3 rounded-2xl transition-all duration-200 text-xs md:text-sm ${
                    selectedHours.includes(hour)
                      ? "bg-blue-dark text-white border-blue-dark shadow-md scale-105"
                      : "text-gray-200 border-gray-400 hover:border-blue-light"
                  }`}
                >
                  {hour}
                </li>
              ))}
            </ul>
          </div>
        </section>
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
