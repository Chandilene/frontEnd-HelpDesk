import type React from "react";

type Props = React.ComponentProps<"select"> & {
  legend?: string;
  children?: React.ReactNode;
};

export function Select({ legend, className, children, ...rest }: Props) {
  return (
    <fieldset className="flex flex-1  text-gray-200 focus-within:text-blue-base ">
      {legend && (
        <legend
          className={`text-gray-400 text-xs font-bold uppercase ${className}`}
        >
          {legend}
        </legend>
      )}

      <select
        className={`w-full h-12 border-b border-gray-500 bg-transparent text-sm  outline-none focus:border-blue-dark transition-all cursor-pointer mb-5 ${className}`}
        {...rest}
      >
        <option
          value=""
          disabled
          selected
          className="bg-gray-600 text-gray-400"
        >
          Selecione a categoria de atendimento
        </option>

        {children}
      </select>
    </fieldset>
  );
}
