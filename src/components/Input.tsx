import { useState } from "react";
import eyePassword from "../assets/icons/showPassword.svg";
import hidePassword from "../assets/icons/hidePassword.svg";

type Props = React.ComponentProps<"input"> & {
  legend?: string;
};

export function Input({ legend, className, type = "text", ...rest }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";

  const currentType = isPasswordType && showPassword ? "text" : type;

  const togglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <fieldset
      className={`flex flex-1 justify-center max-h-20 text-gray-400 focus-within:text-blue-base ${className}`}
    >
      {legend && (
        <legend
          className={`text-gray-300 text-xs font-bold uppercase ${className}`}
        >
          {legend}
        </legend>
      )}
      <div className="relative w-full flex items-center">
        <input
          type={currentType}
          className={`w-full h-8  border-b border-gray-400 px-4 text-sm text-gray-100 bg-transparent outline-0 ${className}`}
          {...rest}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-2 text-gray-400 hover:text-gray-200 transition-colors focus:outline-0"
            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
          >
            <img
              src={showPassword ? eyePassword : hidePassword}
              alt={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="w-5 h-5 object-contain mb-2"
            />
          </button>
        )}
      </div>
    </fieldset>
  );
}
