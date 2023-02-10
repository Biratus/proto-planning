"use client";
import { useCallback } from "react";
import { ZoomIn, ZoomOut } from "react-feather";
import { useZoom } from "./ZoomProvider";

export default function ZoomUI({ range }: { range: number }) {
  const { zoom, setZoom } = useZoom();

  const incZoom = useCallback(() => setZoom(zoom + 1), [zoom]);
  const decZoom = useCallback(() => setZoom(zoom - 1), [zoom]);
  return (
    <div className="btn-group">
      <button
        className="btn-outline btn btn-lg"
        onClick={incZoom}
        disabled={zoom >= range}
      >
        <ZoomIn size={32} />
      </button>
      <button
        className="btn-outline btn btn-lg"
        onClick={decZoom}
        disabled={zoom <= 0}
      >
        <ZoomOut size={32} />
      </button>
    </div>
  );
}
