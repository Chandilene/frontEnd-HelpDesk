import openIcon from "../assets/icons/circle-help.svg";
import inProgressIcon from "../assets/icons/clock-2.svg";
import closedIcon from "../assets/icons/circle-check-big.svg";

export const STATUS_VARIANTS = {
  OPEN: {
    label: "Aberto",
    classes: "bg-feedback-bg-open text-feedback-open",
    icon: openIcon,
  },
  IN_PROGRESS: {
    label: "Em atendimento",
    classes: "bg-feedback-bg-progress text-feedback-progress",
    icon: inProgressIcon,
  },
  CLOSED: {
    label: "Encerrado",
    classes: "bg-feedback-bg-done text-feedback-done",
    icon: closedIcon,
  },
};
