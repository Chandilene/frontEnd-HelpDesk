type Props = React.ComponentProps<"a">;

export function LinkButton({ children, className, ...rest }: Props) {
  return (
    <a
      {...rest}
      className={`w-full flex items-center justify-center font-bold bg-gray-500 text-gray-200 py-2.5 rounded-lg hover:bg-gray-400 hover:text-100 cursor-pointer transition-colors duration-300 ease-in-out ${className ? className : ""}`}
    >
      {children}
    </a>
  );
}
