import { useEffect } from "react";

export function useKey(key: string, action: () => void): void {
  useEffect(
    function () {
      function closeByEsc(e: KeyboardEvent): void {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      }

      document.addEventListener("keydown", closeByEsc);

      return function () {
        document.removeEventListener("keydown", closeByEsc);
      };
    },
    [action, key]
  );
}
