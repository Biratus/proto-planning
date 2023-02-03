"use client";
import { MutableRefObject, useEffect } from "react";

export default function useOnClickOutside(
  ref: MutableRefObject<any>,
  callback: (event?: any) => void
) {
  useEffect(
    () => {
      console.log("useEffect");
      const listener = (event: any) => {
        // if the referenece is not present
        // or the target is descendant of the refefence
        // return
        if (!ref.current || ref!.current.contains(event.target)) {
          return;
        }
        // invoke the callback
        callback(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },

    // add ref and callback to effect dependencies
    [ref, callback]
  );
}
