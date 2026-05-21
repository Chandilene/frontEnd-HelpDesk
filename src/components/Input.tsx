type Props = React.ComponentProps<"input"> & {
  legend?: string;
};

export function Input({ legend, className, ...rest }: Props) {
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

      <input
        type="text"
        className={`w-full h-8  border-b border-gray-400 px-4 text-sm text-gray-100 bg-transparent outline-0 ${className}`}
        {...rest}
      />
    </fieldset>
  );
}
