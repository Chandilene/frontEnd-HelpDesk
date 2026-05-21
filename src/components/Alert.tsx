import { useEffect } from "react";

interface AlertProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export function Alert({ message, type, onClose, duration = 3000 }: AlertProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div className="fixed top-30 self-center-safe z-100 animate-bounce-in">
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-75`}
      >
        <span className="flex-1 font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white font-bold text-xl ml-4 cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  );
}
