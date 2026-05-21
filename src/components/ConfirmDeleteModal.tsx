import closeIcon from "../assets/icons/x.svg";
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-70 p-3">
      <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between px-2 py-2 border-b border-gray-500 relative mb-8">
          <h2 className="text-xl font-bold text-gray-900">Excluir cliente</h2>
          <button onClick={onClose} className="p-1 cursor-pointer">
            <img src={closeIcon} alt="Fechar" />
          </button>
        </div>
        <p className="text-gray-200 mb-8">
          Deseja realmente excluir <strong>{userName}</strong>? <br /> <br />
          Ao excluir, todos os chamados deste cliente serão removidos e esta
          ação não poderá ser desfeita.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-500 rounded-xl font-bold text-gray-100 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-gray-200 text-white rounded-xl font-bold cursor-pointer"
          >
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
}
