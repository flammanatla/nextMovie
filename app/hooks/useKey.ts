import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(
    function () {
      function closeByEsc(e) {
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
