import blockIcon from "../assets/icons/ban.svg";
import blockRedIcon from "../assets/icons/TagStatusRed.svg";
import checkGreenIcon from "../assets/icons/TagStatusGreen.svg";
import checkIcon from "../assets/icons/circle-check.svg";

export const SERVICE_STATUS_VARIANTS = {
  active: {
    label: "Ativo",
    badgeClasses: "bg-green-100 text-green-700",
    badgeIcon: checkGreenIcon,
    buttonLabel: "Desativar",
    buttonIcon: blockIcon,
    buttonClasses: "hover:bg-red-50 text-gray-300",
  },
  inactive: {
    label: "Inativo",
    badgeClasses: "bg-red-100 text-red-700",
    badgeIcon: blockRedIcon,
    buttonLabel: "Reativar",
    buttonIcon: checkIcon,
    buttonClasses: "hover:bg-green-50 text-gray-300",
  },
};
