import { useState } from "react";
import { AxiosError } from "axios";
import { api } from "../services/api";

import { Alert } from "../components/Alert";

import { getInitialsName } from "../utils/getInitialsName";
import { Input } from "../components/Input";

import closeIcon from "../assets/icons/x.svg";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  user: User | null;
}

interface ApiErrorData {
  message: string;
}

export function EditCustomerModal({
  isOpen,
  onClose,
  onUpdate,
  user,
}: EditCustomerModalProps) {
  const [alertData, setAlertData] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const closeModal = () => {
    setAlertData(null);
    onClose();
  };

  async function handleUpdate() {
    if (!user) return;

    try {
      await api.put(`/users/${user.id}`, {
        name,
        email,
      });

      setAlertData({ msg: "Cliente atualizado com sucesso!", type: "success" });

      onUpdate();
      setTimeout(closeModal, 2000);
    } catch (err) {
      const error = err as AxiosError<ApiErrorData>;
      setAlertData({
        msg: error.response?.data?.message || "Erro ao atualizar cliente.",
        type: "error",
      });
    }
  }

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4">
      <div className="bg-white w-full max-w-125 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-500 relative">
          <h2 className="text-xl font-bold text-gray-900">Cliente</h2>
          <button onClick={onClose} className="p-1 cursor-pointer">
            <img src={closeIcon} alt="Fechar" />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-dark overflow-hidden flex items-center justify-center text-white font-bold">
                {user.avatar ? (
                  <img
                    src={`${api.defaults.baseURL}/files/${user.avatar}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitialsName(name || "")
                )}
              </div>
              <span className="text-sm text-gray-400 italic">
                Avatar gerenciado pelo cliente
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                legend="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="email"
                legend="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleUpdate}
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
