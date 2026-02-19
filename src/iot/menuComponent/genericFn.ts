export function CalculateColorState({
  flash = false,
  userEngage = false,
  chnage = true,
  commFault = false,
}): string {
  if (flash) return "#cde6d5";
  else if (userEngage) {
    if (chnage) return "#ffcc80";
    else return "#fff3e0";
  } else if (commFault) return "error.light";
  else return "white";
}

type CalShowValueType = {
  value: number;
  factor: number;
  addition: number;
  offset: number;
};
export function CalShowValue({
  value,
  factor,
  addition,
  offset,
}: CalShowValueType) {
  let step = 1;
  if (factor == 0) step = 1;
  else if (factor > 0) step = factor;
  else step = 1 / Math.abs(factor);
  return ((value - offset) * step - addition).toFixed(2);
}
