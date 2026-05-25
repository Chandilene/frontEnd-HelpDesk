import { useState } from "react";
import { AxiosError } from "axios";
import Compressor from "compressorjs";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

import { Alert } from "../components/Alert";

import { getInitialsName } from "../utils/getInitialsName";
import { Input } from "../components/Input";

import closeIcon from "../assets/icons/x.svg";
import uploadIcon from "../assets/icons/upload.svg";
import trashIcon from "../assets/icons/trash.svg";
import backIcon from "../assets/icons/arrow-left.svg";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiErrorData {
  message: string;
}

const convertToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.onerror = (error) => reject(error);
  });
};

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const auth = useAuth();

  const [alertData, setAlertData] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const [name, setName] = useState(auth.session?.user.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  const userId = auth.session?.user.id;
  const userRole = auth.session?.user.role;
  const userSchedule = auth.session?.user.schedule || undefined;

  const closeModal = () => {
    setTimeout(() => {
      setAlertData(null);
      onClose();
    }, 3000);
  };

  function handleChangeAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const imagePreview = URL.createObjectURL(file);
    setAvatarPreview(imagePreview);

    new Compressor(file, {
      quality: 0.6,
      maxWidth: 600,
      maxHeight: 600,
      async success(result) {
        try {
          const base64 = await convertToBase64(result);
          setAvatarBase64(base64);
        } catch (error) {
          console.error("Erro ao converter imagem comprimida:", error);
        }
      },
      error(err) {
        console.error("Erro na compressão:", err.message);
      },
    });
  }

  async function handleUpdate() {
    try {
      let avatarName = auth.session?.user.avatar;
      if (avatarBase64) {
        const response = await api.patch("/users/avatar", {
          avatar: avatarBase64,
        });
        avatarName = response.data.avatar;
      } else if (avatarBase64 === "") {
        const response = await api.patch("/users/avatar", { avatar: null });
        avatarName = response.data.avatar;
      }

      const userUpdate: User = { name };
      if (newPassword.trim()) {
        userUpdate.password = newPassword;
        userUpdate.old_password = currentPassword;
      }

      await api.put(`/users/${userId}`, userUpdate);

      await auth.updateProfile({
        user: { name, avatar: avatarName },
      });

      setAlertData({ msg: "Perfil atualizado com sucesso!", type: "success" });

      closeModal();
    } catch (err) {
      const error = err as AxiosError<ApiErrorData>;
      console.error("erro do error: ", error.response);
      const message =
        error.response?.data?.message || "Não foi possível atualizar o perfil.";

      setAlertData({
        msg: message,
        type: "error",
      });
      closeModal();
    }
  }

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4">
      <div className="bg-white w-full max-w-125 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-500 relative">
          {isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(false)}
              className="absolute left-6 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <img src={backIcon} alt="Voltar" className="w-4 h-4" />
            </button>
          )}

          <h2
            className={`text-xl font-bold text-gray-900 ${isChangingPassword ? "w-full text-center" : ""}`}
          >
            {isChangingPassword ? "Alterar senha" : "Perfil"}
          </h2>

          <button
            onClick={onClose}
            className="absolute right-6 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
          >
            <img src={closeIcon} alt="Fechar" />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6">
          {!isChangingPassword ? (
            <div className="flex flex-col gap-6">
              <input
                type="file"
                id="avatar"
                className="hidden"
                onChange={handleChangeAvatar}
              />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-dark overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      className="w-full h-full object-cover"
                    />
                  ) : auth.session?.user.avatar ? (
                    <img
                      src={auth.session.user.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                      {getInitialsName(name || "")}
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar"
                  className="text-xs font-bold text-gray-200 flex items-center gap-2 bg-gray-500 px-4 py-2 rounded-lg hover:bg-gray-600 transition-all cursor-pointer"
                >
                  <img src={uploadIcon} alt="" />
                  Nova imagem
                </label>
                <button
                  onClick={() => {
                    setAvatarPreview(null);

                    setAvatarBase64("");
                  }}
                  className="text-xs font-bold text-gray-200 flex items-center gap-2 bg-gray-500 px-4 py-2 rounded-lg hover:bg-gray-600 transition-all cursor-pointer"
                >
                  <img src={trashIcon} alt="" className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <Input
                  legend="Nome"
                  defaultValue={name}
                  onChange={(e) => setName(e.target.value)}
                  className="focus:border-blue-dark border-b-gray-500"
                />
                <Input
                  type="email"
                  legend="E-mail"
                  defaultValue={auth.session?.user.email}
                  disabled
                  className="focus:border-blue-dark border-b-gray-500 opacity-60"
                />
                <div className="flex justify-between items-end gap-1">
                  <div className="flex-1">
                    <Input
                      type="password"
                      legend="Senha"
                      defaultValue="********"
                      disabled
                      className="focus:border-blue-dark border-b-gray-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(true)}
                    className="text-xs font-bold text-gray-200 bg-gray-500 rounded-lg h-9 px-3 hover:bg-gray-600 transition-all cursor-pointer"
                  >
                    Alterar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Input
                legend="Senha Atual"
                type="password"
                placeholder="Digite sua senha atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="focus:border-blue-dark border-b-gray-500"
              />
              <div className="flex flex-col gap-1">
                <Input
                  legend="Nova Senha"
                  type="password"
                  placeholder="Digite sua nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="focus:border-blue-dark border-b-gray-500"
                />
                <span className="text-[10px] italic text-gray-400">
                  Mínimo de 6 dígitos
                </span>
              </div>
            </div>
          )}

          {userRole === "TECHNICIAN" && !isChangingPassword && (
            <div className="text-gray-200 border-b border-gray-500">
              <p className="text-sm font-bold">Disponibilidade</p>
              <p className="text-xs text-gray-400">
                Horários de atendimento definidos pelo admin
              </p>
              <ul className="flex gap-1 flex-wrap m-4 text-gray-400">
                {userSchedule?.map((schedule) => (
                  <li className="cursor-pointer border py-1.5 px-3 rounded-2xl transition-all duration-200 text-xs md:text-sm">
                    {schedule}
                  </li>
                ))}
              </ul>
            </div>
          )}

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
