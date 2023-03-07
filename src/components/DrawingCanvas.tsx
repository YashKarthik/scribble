import { Suspense } from "react";
import dynamic from "next/dynamic";
import { ExcalidrawProps, } from "@excalidraw/excalidraw/types/types";

export function ExcalidrawPage() {

  return (
    <div className="w-screen h-screen">
      <Suspense fallback={"loading..."}>
        <ExcalidrawClientCanvas
          viewModeEnabled={false}
          zenModeEnabled={false}
        >
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
    </div>
  );
}

const ExcalidrawClientCanvas = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw), {
    ssr: false,
  },
) as React.FC<ExcalidrawProps>;

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
