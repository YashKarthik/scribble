import { ExcalidrawAPIRefValue } from '@excalidraw/excalidraw/types/types';
import React, {
  MutableRefObject,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react'
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
  setPredictionStatus: Dispatch<SetStateAction<"succeeded" | "starting" | "processing" | "failed" | "cancelled" | null>>
}) {
  useEffect(() => {
    import('@excalidraw/excalidraw').then((comp) => {
      exportToCanvasRef.current = comp.exportToCanvas;
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
    <div className="
      min-w-max my-2
      flex flex-row
    ">

      <input
        type="text"
        name="text-prompt"
        id="prompt-input"
        placeholder="An image of a futuristic supercar."
        onChange={e => setTextPrompt(e.target.value)}
        className="
          ml-3 mr- p-2
          italic
          border-2 rounded-md border-solid 
          bg-inherit border-gray-400
          w-3/4
        ">
      </input>

      <button
        type="button"
        title="Generate"
        className={`
          px-2 mr-3 ml-1 w-1/4 text-2xl
          bg-violet-100 text-indigo-700 font-semibold
          border-2 rounded-md border-solid 
          ${emptyCanvasError ? "bg-red-100": "bg-violet-100"}
          ${emptyCanvasError ? "hover:bg-red-200": "hover:bg-violet-200"}
          ${emptyCanvasError ? "border-red-100": "border-violet-100"}
          ${emptyCanvasError ? "hover:border-red-200": "hover:border-violet-200"}
        `}
        onClick={async () => {
          const canvasUrl = await getCanvasUrl();
          if (!canvasUrl) {
            setEmptyCanvasError(true);
            return;
          }

          const data = await t.replicate.createPrediction.fetch({
            textPrompt,
            canvasUrl,
          });

          predictionId.current = data.predictionId;
          predictionOutput.current = data.predictionOutput;
          setPredictionStatus(data.predictionStatus);
        }}>
          🧠 🧪 🎨👩‍🔬
          {/* Brain, Testtub, color pallete, lab scientist */}
      </button>
    </div>
  );
}
