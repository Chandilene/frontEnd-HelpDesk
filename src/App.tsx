import { Routes } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
// import { Header } from "./components/Header";

export function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
