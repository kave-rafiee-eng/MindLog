import { useEffect, useRef } from "react";
import { useMonitorStore } from "./../monitorStor";

type AddressesPoolType = number[];

export function useAddressesPool(id: number) {
  const AddReadRegister = useMonitorStore((state) => state.AddReadRegister);

  const addressesPool = useRef<AddressesPoolType>([]);

  const addToPool = (addresses: number[]) => {
    addresses.forEach((address) => {
      if (!addressesPool.current.includes(address)) {
        addressesPool.current.push(address);
      }
    });
  };

  useEffect(() => {
    console.log("Secction Render -- : " + id);
    if (addressesPool.current.length > 0) {
      AddReadRegister(id, [...addressesPool.current]);
      addressesPool.current.length = 0;
    }
  });

  return { addToPool };
}
