import { useAuth } from "../hooks/useAuth";
import { getTechnicians } from "../services/users";

import editIcon from "../assets/icons/pen-line.svg";
import plusWhiteIcon from "../assets/icons/plusWhite.svg";

import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { api } from "../services/api";
import { getInitialsName } from "../utils/getInitialsName";
import { useNavigate } from "react-router";

export function TableAllTechnician() {
  const navigate = useNavigate();
  const { session } = useAuth();
  console.log(session);
  const [technicians, setTechnicians] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  function handleEdit(id: string) {
    navigate(`/edit-technician/${id}`);
  }
  function handleCreateTech() {
    navigate("/users/admin");
  }

  useEffect(() => {
    let mounted = true;

    const loadAllTechnicians = async () => {
      try {
        const response = await getTechnicians();

        if (mounted) {
          setTechnicians(response);
        }
        console.log("tecnicos listados", response);
      } catch (error) {
        console.log("Erro :", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAllTechnicians();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Carregando tecnicos...</p>;

  return (
    <div>
      <div className="flex justify-between">
        {" "}
        <h1 className="text-blue-dark text-3xl font-bold mt-7">Técnicos</h1>
        <Button
          className="flex gap-2 justify-center px-4 mt-7"
          onClick={() => handleCreateTech()}
        >
          <img src={plusWhiteIcon} alt="" />
          <span className="hidden md:block">NOVO</span>
        </Button>
      </div>

      <div className="w-full border border-gray-500 rounded-2xl overflow-hidden mt-6 p-4">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="">
              <th className=" md:w-30 text-gray-400 text-sm text-left border-b border-gray-500">
                Nome
              </th>
              <th className="hidden md:text-gray-400 md:text-sm md:table-cell text-left border-b border-gray-500">
                E-mail
              </th>
              <th className=" text-gray-400 text-sm text-left border-b border-gray-500 ">
                Disponibilidade
              </th>
              <th className="border-b border-gray-500"> </th>
            </tr>
          </thead>

          <tbody className="w-full ">
            {technicians.map((technician) => (
              <tr key={technician.id}>
                <td className=" flex gap-1.5 items-center font-bold w-20 md:w-50 text-xs py-4 px-4 text-gray-200 border-b border-gray-500">
                  <div className="w-7 h-7 rounded-full bg-blue-dark flex items-center justify-center shrink-0 overflow-hidden">
                    {technician.avatar ? (
                      <img
                        src={`${api.defaults.baseURL}/files/${technician.avatar}`}
                        alt={technician.name}
                        className="w-full h-full object-cover rounded-4xl"
                      />
                    ) : (
                      <span className="text-gray-400 font-bold text-sm">
                        {getInitialsName(technician.name || "")}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-200 font-bold block whitespace-nowrap">
                    {technician.name}
                  </p>
                </td>
                <td className="hidden md:text-gray-200 md:text-xs md:table-cell font-semibold border-b border-gray-500">
                  {technician.email}
                </td>
                <td className=" text-sm text-gray-400 font-semibold w-36 md:table-cell md:w-52 border-b border-gray-500">
                  <ul className="flex gap-1">
                    {technician.schedule && technician.schedule.length > 0 ? (
                      <>
                        <li className="border border-gray-400 py-1 px-1.5 rounded-2xl">
                          {technician.schedule[0]}
                        </li>
                        <li className="border border-gray-400 py-1 px-1.5 rounded-2xl">
                          +{technician.schedule.length - 1}
                        </li>
                      </>
                    ) : (
                      <span className="text-gray-500 italic">Não definido</span>
                    )}
                  </ul>
                </td>

                <td className="table-cell border-b border-gray-500 text-center align-middle">
                  <div className="flex justify-center items-center h-full">
                    <button
                      onClick={() => technician.id && handleEdit(technician.id)}
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-gray-500"
                    >
                      <img src={editIcon} alt="" className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            <tr></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
