"use client";
import { PropsWithChildren, RefObject, useRef } from "react";

export type ModalRef = {
  close?: () => void;
  isClosed?: () => boolean;
};

export default function CommonModal({
  inputId,
  children,
  modalRef,
  side = "right",
}: {
  inputId: string;
  side?: "left" | "right";
  modalRef: RefObject<ModalRef>;
} & PropsWithChildren) {
  const toggleRef = useRef<HTMLInputElement>(null);

  modalRef.current!.close = () => {
    toggleRef.current!.checked = false;
  };
  modalRef.current!.isClosed = () => toggleRef.current!.checked == false;

  return (
    <>
      <input
        ref={toggleRef}
        type="checkbox"
        id={inputId}
        className="modal-toggle"
      />
      <label htmlFor={inputId} className={`modal-drawer modal drawer-${side}`}>
        <label
          className="modal-box h-full max-h-screen w-[35vw] max-w-none rounded-none"
          htmlFor=""
        >
          {children}
        </label>
      </label>
    </>
  );
}
