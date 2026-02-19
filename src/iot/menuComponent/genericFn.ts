export function CalculateColorState({
  flash = false,
  userEngage = false,
  chnage = true,
  commFault = false,
}): string {
  if (flash) return "success.light";
  else if (userEngage) {
    if (chnage) return "#ffcc80";
    else return "#fff3e0";
  } else if (commFault) return "error.light";
  else return "white";
}
