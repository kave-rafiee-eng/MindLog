import { useEffect, useRef } from "react";

type UseAutoUpdateProps = {
  ProcessRead: () => void;
  StopFn: () => boolean;
  interval?: number;
  max?: number;
};

export function useAutoUpdate({
  ProcessRead,
  StopFn,
  interval = 500,
  max = 8,
}: UseAutoUpdateProps): void {
  const counterRef = useRef<number>(0);

  useEffect(() => {
    if (!ProcessRead || !StopFn) return;

    ProcessRead();

    const timer: ReturnType<typeof setInterval> = setInterval(() => {
      if (StopFn()) {
        counterRef.current = 0;
        return;
      }

      counterRef.current++;

      if (counterRef.current >= max) {
        counterRef.current = 0;
        ProcessRead();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [interval, max]);
}
