export function NotFound() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col">
        <h1 className="text-gray-100 font-semibold text-2xl">
          Op's! Essa paginá não existe.{" "}
        </h1>
        <a href="/" className="underline">
          Voltar ao inicio{" "}
        </a>
      </div>
    </div>
  );
}
