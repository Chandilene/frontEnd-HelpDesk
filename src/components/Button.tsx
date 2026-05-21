type Props = React.ComponentProps<"button"> & {
  isLoading?: boolean;
};

export function Button({
  children,
  isLoading,
  type = "button",
  className,
  ...rest
}: Props) {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={`
        flex items-center justify-center py-2.5 rounded-lg text-gray-600 transition-all
        ${
          isLoading
            ? "bg-gray-400 opacity-70 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-100 cursor-pointer"
        }
        ${className} 
      `}
      {...rest}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
}
