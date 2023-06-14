"use client";
import { useCallback } from "react";
import { ZoomIn, ZoomOut } from "react-feather";
import { useZoom } from "./ZoomProvider";

export default function ZoomUI({ range }: { range: number }) {
  const { zoom, setZoom } = useZoom();

  const incZoom = useCallback(() => setZoom(zoom + 1), [zoom, setZoom]);
  const decZoom = useCallback(() => setZoom(zoom - 1), [zoom, setZoom]);
  return (
    <div className="join">
      <button
        className="join-item btn-outline btn-md btn"
        onClick={incZoom}
        disabled={zoom >= range}
      >
        <ZoomIn size={28} />
      </button>
      <button
        className="join-item btn-outline btn-md btn"
        onClick={decZoom}
        disabled={zoom <= 0}
      >
        <ZoomOut size={28} />
      </button>
    </div>
  );
}
