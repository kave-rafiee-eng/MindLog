import { useMonitorStore } from "./monitorStor";

const SectionTest = () => {
  const readAddresses0 = useMonitorStore(
    (state) => state.monitorData[0]?.readAddresses ?? [],
  );

  const readAddresses1 = useMonitorStore(
    (state) => state.monitorData[1]?.readAddresses ?? [],
  );

  const readAddresses: number[][] = [readAddresses0, readAddresses1];

  //console.log("SectionTest rendered");
  //console.log(readAddresses);

  return <></>;
};

export default SectionTest;
