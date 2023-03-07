import { Suspense } from "react";
import dynamic from "next/dynamic";
import {
  ExcalidrawProps,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types/types";

export function ExcalidrawPage() {

  return (
    <div className="w-screen h-screen">
      <Suspense fallback={"loading..."}>
        <DynamicExcalidraw
          viewModeEnabled={false}
          zenModeEnabled={false}
          initialData={initialData}
        />
      </Suspense>
    </div>
  );
}

const DynamicExcalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw), {
    ssr: false,
  },
) as React.FC<ExcalidrawProps>;

const initialData = [{
  type: "rectangle",
  version: 141,
  versionNonce: 361174001,
  isDeleted: false,
  id: "oDVXy8D6rom3H1-LLH2-f",
  fillStyle: "hachure",
  strokeWidth: 1,
  strokeStyle: "solid",
  roughness: 1,
  opacity: 100,
  angle: 0,
  x: 100.50390625,
  y: 93.67578125,
  strokeColor: "#000000",
  backgroundColor: "transparent",
  width: 186.47265625,
  height: 141.9765625,
  seed: 1968410350,
  groupIds: [],
}];
