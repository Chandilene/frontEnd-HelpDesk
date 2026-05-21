import { useState } from "react";
import { Outlet } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";

import { Sidebar } from "./Sidebar";
import { ProfileModal } from "./ProfileModal";

import { getInitialsName } from "../utils/getInitialsName";

import logo from "../assets/Logo_IconLight.svg";
import menuIcon from "../assets/icons/menu.svg";
import userIcon from "../assets/icons/circle-user.svg";
import logoutIcon from "../assets/icons/log-out.svg";

export function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const auth = useAuth();

  const roleTranslations: Record<string, string> = {
    ADMIN: "ADMIN",
    TECHNICIAN: "TÉCNICO",
    CUSTOMER: "CLIENTE",
  };

  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col md:flex-row overflow-hidden">
      <header
        className={`
        w-full bg-gray-900 flex flex-col items-center px-6 transition-all duration-300
        md:h-full md:w-64 md:py-10 md:items-start
        ${isMenuOpen ? "h-screen" : "h-24"} 
      `}
      >
        <div className="w-full h-24 flex items-center justify-between md:h-auto md:flex-col md:items-start md:gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-100 p-2.5 rounded-lg md:hidden"
            >
              <img src={menuIcon} alt="Menu" className="w-6 h-6" />
            </button>

            <img src={logo} alt="Logo" className="w-10 h-10" />
            <div className="flex flex-col">
              <h1 className="text-white text-xl font-bold leading-none">
                HelpDesk
              </h1>
              <span className="text-blue-light text-[10px] uppercase font-medium mt-1">
                {auth.session?.user?.role
                  ? roleTranslations[auth.session.user.role] ||
                    "ROLE NÃO MAPEADA"
                  : "CARREGANDO..."}
              </span>
            </div>
          </div>

          {!isMenuOpen && (
            <div className="relative md:hidden">
              <div
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-12 h-12 rounded-full bg-blue-dark flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {auth.session?.user.avatar ? (
                  <img
                    src={`${api.defaults.baseURL}/files/${auth.session.user.avatar}`}
                    alt={auth.session.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-sm">
                    {getInitialsName(auth.session?.user.name || "")}
                  </span>
                )}
              </div>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-14 w-48 bg-gray-800 rounded-xl p-4 flex flex-col gap-4 shadow-2xl border border-gray-700 z-50">
                  <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                    Opções
                  </p>
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-gray-600 hover:text-gray-400 transition-colors cursor-pointer"
                  >
                    <img src={userIcon} alt="" className="w-5 h-5" />
                    <span className="text-sm">Perfil</span>
                  </button>
                  <button
                    onClick={() => auth.remove()}
                    className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <img src={logoutIcon} alt="" className="w-5 h-5" />
                    <span className="text-sm">Sair</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className={`${isMenuOpen ? "flex" : "hidden"} md:flex w-full flex-1`}
        >
          <Sidebar onCloseMenu={() => setIsMenuOpen(false)} />
        </div>

        <div className="hidden md:flex w-full flex-col relative mt-auto border-t border-gray-800 pt-6">
          {isProfileMenuOpen && (
            <div className="absolute bottom-24 left-0 w-full bg-black rounded-xl p-4 flex flex-col gap-4 shadow-lg border border-gray-800 z-50">
              <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                Opções
              </p>
              <button
                onClick={() => {
                  setIsProfileModalOpen(true);
                  setIsProfileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-gray-600 hover:text-gray-400 transition-colors cursor-pointer"
              >
                <img src={userIcon} alt="" className="w-5 h-5" />
                <span className="text-sm">Perfil</span>
              </button>
              <button
                onClick={() => auth.remove()}
                className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
              >
                <img src={logoutIcon} alt="" className="w-5 h-5" />
                <span className="text-sm">Sair</span>
              </button>
            </div>
          )}

          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-4 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-blue-dark flex items-center justify-center overflow-hidden shrink-0">
              {auth.session?.user?.avatar ? (
                <img
                  src={`${api.defaults.baseURL}/files/${auth.session.user.avatar}`}
                  alt={auth.session.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {getInitialsName(auth.session?.user.name || "")}
                </span>
              )}
            </div>
            <div className="flex flex-col text-sm truncate">
              <h4 className="text-white font-medium truncate">
                {auth.session?.user.name}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                {auth.session?.user.email}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main
        className={`
        flex-1 bg-white rounded-t-3xl md:rounded-l-[40px] md:rounded-tr-none md:my-4 md:mr-4 flex flex-col overflow-y-auto
        ${isMenuOpen ? "hidden md:flex" : "flex"} 
      `}
      >
        <div className="w-full px-5 flex-1">
          <Outlet />
        </div>
      </main>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
