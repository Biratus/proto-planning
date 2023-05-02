"use client";
import { useCallback } from "react";
import { ZoomIn, ZoomOut } from "react-feather";
import { useZoom } from "./ZoomProvider";

export default function ZoomUI({ range }: { range: number }) {
  const { zoom, setZoom } = useZoom();

  const incZoom = useCallback(() => setZoom(zoom + 1), [zoom, setZoom]);
  const decZoom = useCallback(() => setZoom(zoom - 1), [zoom, setZoom]);
  return (
    <div className="btn-group">
      <button
        className="btn-outline btn btn-md"
        onClick={incZoom}
        disabled={zoom >= range}
      >
        <ZoomIn size={28} />
      </button>
      <button
        className="btn-outline btn btn-md"
        onClick={decZoom}
        disabled={zoom <= 0}
      >
        <ZoomOut size={28} />
      </button>
    </div>
  );
}
