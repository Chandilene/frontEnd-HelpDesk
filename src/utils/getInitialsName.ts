export const getInitialsName = (name: string) => {
  if (!name) return "??";

  const names = name.split(" ");
  const first = names[0]?.[0] || "";
  const last = names.length > 1 ? names[names.length - 1][0] : "";
  return (first + last).toUpperCase();
};
