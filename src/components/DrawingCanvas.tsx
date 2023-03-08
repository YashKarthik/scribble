import { MutableRefObject, Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { ExcalidrawProps, ExcalidrawAPIRefValue } from "@excalidraw/excalidraw/types/types";
import { PromptInput } from "./PromptInput";

export function ExcalidrawPage({ excalidrawAPI: excalidrawRef }:{
  excalidrawAPI: MutableRefObject<ExcalidrawAPIRefValue|null>
}) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawAPIRefValue|null>(null);

  return (
    <div className=" w-full h-[90%] ">
      <Suspense fallback={"loading..."}>
        <ExcalidrawClientCanvas ref={setExcalidrawAPI} >
          <WelcomeScreen>
            <HintsToolbar />

            <LandingPageCenter>
              <Heading>
                  Welcome to Scribble!
              </Heading>

              <div>
                <p className="text-gray-400">1. Scribble together a rough idea.</p>
                <p className="text-gray-400">2. Describe it.</p>
                <p className="text-gray-400">3. AI-ify it!</p>
              </div>
            </LandingPageCenter>

          </WelcomeScreen>
        </ExcalidrawClientCanvas>
      </Suspense>
      <PromptInput excalidrawRef={excalidrawAPI}/>
    </div>
  );
}

const ExcalidrawClientCanvas = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw), {
    ssr: false,
  },
)

const WelcomeScreen = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.WelcomeScreen), {
    ssr: false,
  },
) as React.FC<ExcalidrawProps>;

const HintsToolbar = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.WelcomeScreen.Hints.ToolbarHint), {
    ssr: false,
  },
) as React.FC<ExcalidrawProps>;

const LandingPageCenter = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.WelcomeScreen.Center), {
    ssr: false,
  },
);

const Heading = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.WelcomeScreen.Center.Heading), {
    ssr: false,
  },
);
