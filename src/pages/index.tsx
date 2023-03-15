import { ExcalidrawAPIRefValue } from "@excalidraw/excalidraw/types/types";
import { type NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { ExcalidrawPage } from "~/components/DrawingCanvas";
import { PromptInput } from "~/components/PromptInput";
import { api } from "~/utils/api";


const Home: NextPage = () => {
  const t = api.useContext();

  const excalidrawRef = useRef<ExcalidrawAPIRefValue|null>(null);

  const predictionId = useRef<string|null>(null);
  const predictionOutput = useRef<string|null>(null);
  const oldPredictionOutputs = useRef<string[]|null>(null);
  const [predictionStatus, setPredictionStatus] = useState<
    "succeeded"| "starting"| "processing"| "failed" | null
  >(null);

  function pollPrediction() {
    if (!predictionId.current) return;
    if (predictionStatus == "succeeded") return;

    t.replicate.pollPrediction.fetch({
      predictionId: predictionId.current
    }).then(data => {
      if ( data.predictionStatus == "starting" ) return;
      if ( data.predictionStatus == "processing") return;

      predictionOutput.current = data.predictionOutput;
      setPredictionStatus(data.predictionStatus);

    }).catch(err => {
      console.log("Error while polling prediction: \n", err);
      return;
    })
  }

  useInterval(pollPrediction, 5000);

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
          flex md:flex-row flex-col
          gap-2 p-2 h-[45rem]
        ">

          {/* Input div:
            * Excalidraw canvas
            * Prompt input box, submit button
          */}
          <div className={`
            flex flex-col
            border-black border-2 border-solid
            md:h-full ${predictionStatus ? "md:w-1/2 w-full min-h-full" : "w-full h-5/6"} 
            p-4 rounded-md
          `}>
            <ExcalidrawPage excalidrawRef={excalidrawRef} />
            <PromptInput 
              excalidrawRef={excalidrawRef}
              predictionId={predictionId}
              predictionOutput={predictionOutput}
              setPredictionStatus={setPredictionStatus}
            />
          </div>

          {/* Output div: */}
          {predictionStatus && 
            <div className="
              flex flex-col
              justify-center items-center
              border-black border-2 border-solid
              md:w-1/2 w-full rounded-md
            ">
              { (predictionStatus == "succeeded" && predictionOutput.current) &&
                <img src={predictionOutput.current} alt="Your generated image" />
              }

              { predictionStatus == "failed" &&
                <p className="
                  self-center
                  p-2 rounded-md
                  border-2 border-solid border-red-600
                  font-semibold text-2xl
                  bg-red-200 text-red-700
                ">Generation Failed</p>
              }

              { (predictionStatus == "starting" || predictionStatus == "processing") &&
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="
                    w-12 h-12
                    animate-spin
                    stroke-2 stroke-indigo-700
                ">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              }

            </div>
          }
        </div>

        <footer className="self-center">
          {[
            ["Github", "https://github.com/yashkarthik/scribble"],
            ["Blog", "https://yashkarthik.xyz/"],
            ["Twitter", "https://twitter.com/_yashkarthik/"],
            ["Farcaster", "https://warpcast.com/yashkarthik/"],
          ].map(link => <a key={link[1]!.length / link[0]!.length}
              target="_blank"
              href={link[1]}
              className="
                mx-3
                font-[Virgil] text-gray-500 text-sm
                hover:underline decoration-wavy decoration-indigo-400
              ">{link[0]}</a>
          )}
        </footer>
      </main>
    </>
  );
};

export default Home;

function useInterval(callbackFn: () => void, delayMs: number) {
  const savedCallback = useRef<() => void | null>();

  useEffect(() => {
    savedCallback.current = callbackFn;
  }, [callbackFn])

  useEffect(() => {
    function tick() {
      if (!savedCallback.current) return;
      savedCallback.current();
    }

    const intervalId = setInterval(tick, delayMs);

    return () => {
      clearInterval(intervalId);
    }
  }, [callbackFn, delayMs]);
}
