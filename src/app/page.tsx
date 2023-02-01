import ZoomProvider from "@/components/zoom/ZoomProvider";
import ZoomUI from "@/components/zoom/ZoomUI";
import { zoom_calendar_full } from "@/hooks/localStorageStore";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <ZoomProvider zoomKey={zoom_calendar_full}>
        <ZoomUI range={5}/>
      </ZoomProvider>
    </>
  )
}
