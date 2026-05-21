import { Outlet } from "react-router";
import logo from "../assets/Logo_IconDark.svg";
import backgroundImage from "../assets/Login_Background.png";

export function AuthLayout() {
  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex items-end md:items-center md:justify-end md:pt-3.5 overflow-x-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <main className="w-full h-[95%] bg-white rounded-t-3xl md:min-h-full md:h-auto md:w-[45%] md:rounded-l-3xl md:rounded-tr-none  flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 pt-8 md:pt-12">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <h1 className="text-blue-dark text-2xl font-bold">HelpDesk</h1>
        </div>

        <div className="w-full px-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
