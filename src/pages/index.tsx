import { ExcalidrawAPIRefValue } from "@excalidraw/excalidraw/types/types";
import { type NextPage } from "next";
import { useRef, useState } from "react";
import { ExcalidrawPage } from "~/components/DrawingCanvas";
import { PromptInput } from "~/components/PromptInput";

const Home: NextPage = () => {
  const excalidrawRef = useRef<ExcalidrawAPIRefValue|null>(null);

  const predictionId = useRef<string|null>(null);
  const predictionOutput = useRef<string|null>(null);
  const [predictionStatus, setPredictionStatus] = useState<
    "succeeded"| "starting"| "processing"| "failed"| "cancelled" | null
  >(null);

  return (
    <>
      <main className="flex flex-col min-h-screen">

        <h1 className="
          self-center my-2
          text-4xl font-black font-[Virgil]
          underline decoration-wavy decoration-indigo-400
          decoration-2 underline-offset-8
        ">Scribble!</h1>

        <div className="
          flex flex-col md:flex-row
          gap-2 p-4 h-[45rem]
        ">

          {/* Input div:
            * Excalidraw canvas
            * Prompt input box, submit button
          */}
          <div className="
            border-black border-2 border-solid
            w-1/2 rounded-md
          ">
            <ExcalidrawPage excalidrawRef={excalidrawRef} />
            <PromptInput 
              excalidrawRef={excalidrawRef}
              predictionId={predictionId}
              predictionOutput={predictionOutput}
              setPredictionStatus={setPredictionStatus}
            />
          </div>

          {/* Output div: */}
          <div className="
            border-black border-2 border-solid
            w-1/2 rounded-md
          ">
            <img src="https://www.yashkarthik.xyz/ogImage.png" alt="test" />
          </div>
        </div>

        <footer className="self-center">
          {[
            ["Github", "https://github.com/yashkarthik/scribble"],
            ["Blog", "https://yashkarthik.xyz/"],
            ["Twitter", "https://twitter.com/_yashkarthik/"],
            ["Farcaster", "https://warpcast.com/yashkarthik/"],
          ].map(link => <a target="_blank"
                href={link[1]}
                className="
                  mx-3
                  font-mono text-gray-500 text-sm
                  hover:underline decoration-wavy
                ">{link[0]}</a>
          )}
        </footer>
      </main>
    </>
  );
};

export default Home;
