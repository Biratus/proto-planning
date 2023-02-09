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
}: { inputId: string; modalRef: RefObject<ModalRef> } & PropsWithChildren) {
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
      <label htmlFor={inputId} className="modal justify-end">
        <label
          className="modal-box max-w-none w-2/5 h-full max-h-screen rounded-none"
          htmlFor=""
        >
          {children}
        </label>
      </label>
    </>
  );
}
