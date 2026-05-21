import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(dateString: string | undefined) {
  if (!dateString) {
    return "--/--/--";
  }
  const date = parseISO(dateString);

  return format(date, "dd/MM/yy HH:mm", {
    locale: ptBR,
  });
}
