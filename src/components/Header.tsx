import { Outlet } from "react-router";
import logo from "../assets/Logo_IconLight.svg";
import menu from "../assets/icons/menu.svg";

export function Header() {
  return (
    <header className="w-full h-32 bg-gray-100 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button className="bg-gray-100 p-2.5 rounded-lg hover:bg-gray-200 focus:bg-blue-dark active:bg-blue-dark transition-colors">
          <img src={menu} alt="Abrir menu" className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo HelpDesk" className="w-10 h-10" />

          <div className="flex flex-col justify-center">
            <h1 className="text-gray-600 text-xl font-bold leading-none">
              HelpDesk
            </h1>
            <span className="text-blue-light text-xs uppercase font-medium mt-1">
              CLIENTE
            </span>
          </div>
        </div>
      </div>

      <div className="w-12 h-12 rounded-full bg-blue-dark flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
        <span className="text-gray-600 font-bold text-sm">UC</span>
        {/* <img src="" alt="" /> */}
      </div>
      <Outlet />
    </header>
  );
}
