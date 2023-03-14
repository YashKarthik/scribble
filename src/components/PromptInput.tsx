import { ExcalidrawAPIRefValue } from '@excalidraw/excalidraw/types/types';
import { useQuery } from '@tanstack/react-query';
import React, {
  MutableRefObject,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react'
import { PredictionOutput } from '~/pages/api/createPrediction';
import { api } from '~/utils/api';

export function PromptInput({ 
  excalidrawRef,
  predictionId,
  predictionOutput,
  setPredictionStatus,
}:{
  excalidrawRef: MutableRefObject<ExcalidrawAPIRefValue|null>
  predictionId: MutableRefObject<string|null>
  predictionOutput: MutableRefObject<string|null>
  setPredictionStatus: Dispatch<SetStateAction<"succeeded" | "starting" | "processing" | "failed" | null>>
}) {
  useEffect(() => {
    import('@excalidraw/excalidraw').then((comp) => {
      exportToCanvasRef.current = comp.exportToCanvas;
    }).catch(e => {
      console.log("Error while import Excalidraw exportToCanvas:", e);
    });
  }, []);

  const [textPrompt, setTextPrompt] = useState("");
  const exportToCanvasRef = useRef<any>(null);
  const [emptyCanvasError, setEmptyCanvasError] = useState(false);

  const t = api.useContext();
  // Hiding all the madness in a function.
  async function getCanvasUrl() {
    if (!excalidrawRef.current?.ready) return;

    const elements = excalidrawRef.current.getSceneElements();
    if (!elements || !elements.length) {
      setEmptyCanvasError(true);
      return;
    }

    setEmptyCanvasError(false);

    const canvas: HTMLCanvasElement = await exportToCanvasRef.current({
      elements: elements,
      mimeType: "image/png",
      //appState: excalidrawRef.current.getAppState(),
      files: excalidrawRef.current.getFiles(),
      getDimensions: () => { return {width: 350, height: 350}}, // experiment with this for cheaper replicate API.
    });

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.font = "30px Virgil";
    return canvas.toDataURL();
  }


  return (
    <form className="
      min-w-max my-2
      flex md:flex-row flex-col gap-3 "
      onSubmit={async e => {
        e.preventDefault();
        console.log("createPrediction.....");

        const canvasUrl = await getCanvasUrl();
        if (!canvasUrl) {
          setEmptyCanvasError(true);
          return;
        }

        const res = await fetch("/api/createPrediction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            textPrompt: textPrompt,
            canvasUrl: canvasUrl
          })
        });
        if (!res.ok) {
          setPredictionStatus("failed")
          return;
        }

        const data: PredictionOutput = await res.json();

        predictionId.current = data.predictionId;
        predictionOutput.current = data.predictionOutput;
        setPredictionStatus(data.predictionStatus);
      }}
      >

      <input
        type="text"
        name="text-prompt"
        id="prompt-input"
        value={textPrompt}
        placeholder="An image of a futuristic supercar."
        onChange={e => setTextPrompt(e.target.value)}
        className="
          mx-3 p-2
          italic
          border-2 rounded-md border-solid 
          bg-inherit border-gray-400
          md:w-3/4 w-full
        ">
      </input>

      <button
        type="submit"
        title="Generate"
        className={`
          px-4 mx-3 md:w-fit w-full
          bg-violet-100 text-indigo-700 font-semibold
          border-2 rounded-md border-solid 
          ${predictionId.current ? "lg:text-xl" : "lg:text-3xl"}
          text-3xl
          ${emptyCanvasError ? "bg-red-100": "bg-violet-100"}
          ${emptyCanvasError ? "hover:bg-red-200": "hover:bg-violet-200"}
          ${emptyCanvasError ? "border-red-100": "border-violet-100"}
          ${emptyCanvasError ? "hover:border-red-200": "hover:border-violet-200"}
        `} >
          🧠 🧪 🎨👩‍🔬
          {/* Brain, Testtub, color pallete, lab scientist */}
      </button>
    </form>
  );
}
