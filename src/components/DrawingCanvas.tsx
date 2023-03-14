import { Suspense, MutableRefObject, useState, useEffect, useRef, MemoExoticComponent, ForwardRefExoticComponent } from "react";
import dynamic from "next/dynamic";
import { ExcalidrawProps, ExcalidrawAPIRefValue } from "@excalidraw/excalidraw/types/types";

export function ExcalidrawPage({ excalidrawRef }:{
  excalidrawRef: MutableRefObject<ExcalidrawAPIRefValue|null>
}) {

  // MemoExoticComponent<ForwardRefExoticComponent<PublicExcalidrawProps & RefAttributes<ExcalidrawAPIRefValue>>>

  const [Excalidraw, setExcalidraw] = useState<any>(null);
  const exportToCanvasRef = useRef<any>(null);

  useEffect(() => {
    import('@excalidraw/excalidraw').then((comp) => {
      setExcalidraw(comp.Excalidraw)
      exportToCanvasRef.current = comp.exportToCanvas;
    }).catch(e => {
      console.log("Error while building whiteboard.", e);
    })
  }, []);

  return (
    <div className=" w-full h-[90%] ">
      <Suspense fallback={"loading..."}>
        {Excalidraw &&
          <Excalidraw ref={excalidrawRef}>
            <WelcomeScreen>
              <HintsToolbar />

              <LandingPageCenter>
                <Heading>
                  <p className="text-4xl"> Welcome to Scribble! </p>
                </Heading>

                <div className="font-[Virgil] text-sm">
                  <p className="text-gray-400">1. Scribble together a rough idea.</p>
                  <p className="text-gray-400">2. Describe it.</p>
                  <p className="text-gray-400">3. AI-ify it!</p>
                </div>
              </LandingPageCenter>

            </WelcomeScreen>
          </Excalidraw>
        }
      </Suspense>
    </div>
  );
}

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
