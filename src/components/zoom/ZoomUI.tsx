"use client";
import { useCallback } from "react";
import { ZoomIn, ZoomOut } from "react-feather";
import { useZoom } from "./ZoomProvider";

export default function ZoomUI({ range }: { range: number }) {
  const { value: zoom, setValue: setZoom } = useZoom();

  const incZoom = useCallback(() => setZoom(zoom + 1), [zoom]);
  const decZoom = useCallback(() => setZoom(zoom - 1), [zoom]);
  return (
    <div className="btn-group">
      <button
        className="btn btn-lg btn-outline"
        onClick={incZoom}
        disabled={zoom >= range}
      >
        <ZoomIn size={32} />
      </button>
      <button
        className="btn btn-lg btn-outline"
        onClick={decZoom}
        disabled={zoom <= 0}
      >
        <ZoomOut size={32} />
      </button>
    </div>
  );
}
