type Props = React.ComponentProps<"textarea"> & {
  legend?: string;
};

export function TextArea({ legend, className, ...rest }: Props) {
  return (
    <fieldset className="flex flex-col flex-1 justify-center mt-4 text-gray-400 focus-within:text-blue-base ">
      {legend && (
        <label
          className={`text-gray-300 text-xs font-bold uppercase ${className}`}
        >
          {legend}
        </label>
      )}

      <textarea
        rows={10}
        cols={10}
        className="w-full px-4 text-sm text-gray-100 bg-transparent outline-none focus:border-blue-dark  placeholder:text-gray-400"
        {...rest}
      />
    </fieldset>
  );
}
