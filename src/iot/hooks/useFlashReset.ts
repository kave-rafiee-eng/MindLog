import { useEffect, useState, Dispatch, SetStateAction } from "react";

export function useFlashReset(
  initial: boolean = false,
  delay: number = 500,
): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [flash, setFlash] = useState<boolean>(initial);

  useEffect(() => {
    if (!flash) return;

    const timer = setTimeout(() => {
      setFlash(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [flash, delay]);

  return [flash, setFlash];
}
