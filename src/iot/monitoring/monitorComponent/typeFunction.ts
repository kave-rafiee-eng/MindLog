import { registerType, picMonitorType } from "./../types";

export function getValueByAdd(
  registers: registerType[],
  add: number,
): number | null {
  const found = registers.find((reg) => reg.add === add);
  if (found) return found.value;
  return null;
}

export type componentMonitorPropType = {
  registers: registerType[];
  addToPoolAddressesFn: (addresses: number[]) => void;
};
