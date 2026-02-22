import { create } from "zustand";
import { registerAddValueType, useSocketStore } from "../socketStore";

type monitorDataType = {
  readAddresses: number[];
  registers: registerAddValueType[];
};

type monitorStorType = {
  monitorData: monitorDataType[];
  MonitorPciProcess: (index: number) => Promise<boolean>;
  AddReadRegister: (index: number, values: number[]) => void;
  ResetMonitorData: (numOfMonitor: number) => void;
  _iniMonitorData: (numOfMonitor: number) => void;
};

const def_MaxMonitor = 5;

export const useMonitorStore = create<monitorStorType>((set, get) => ({
  monitorData: Array.from({ length: def_MaxMonitor }, () => {
    return {
      readAddresses: [],
      registers: [],
    };
  }),

  _iniMonitorData: (numOfMonitor) =>
    set(() => {
      const newMonitorData = Array.from({ length: numOfMonitor }, () => {
        return {
          readAddresses: [],
          registers: [],
        };
      });
      return { monitorData: newMonitorData };
    }),

  ResetMonitorData: (numOfMonitor) => get()._iniMonitorData(numOfMonitor),

  AddReadRegister: (index, values) =>
    set((state) => {
      const newMonitorData = [...state.monitorData];
      newMonitorData[index] = {
        ...newMonitorData[index],
        readAddresses: values,
      };
      return { monitorData: newMonitorData };
    }),

  MonitorPciProcess: async (index) => {
    const addresses = get().monitorData[index].readAddresses;
    //console.log(addresses);
    try {
      const res = await useSocketStore
        .getState()
        .PCI_Setting(addresses, [], false, true);

      let notFound = false;
      addresses.forEach((add) => {
        const found = res.registers.find((reg) => add === reg.add);
        if (!found) {
          notFound = true;
        }
      });

      if (!notFound) {
        set((state) => {
          const newMonitorData = [...state.monitorData];

          newMonitorData[index] = {
            ...newMonitorData[index],
            registers: res.registers,
          };

          return { monitorData: newMonitorData };
        });
        return true;
      }
      console.error(" MonitorPciProcess notFound All Registers ");
      return true;
    } catch (err) {
      throw err;
    }
  },

  /*set((state) => {
      const newMonitorData = [...state.monitorData];
      const newRegisters = [...state.monitorData[index].registers];
      newMonitorData[index].registers = newRegisters;
      return { monitorData: newMonitorData };
    }),*/
}));
