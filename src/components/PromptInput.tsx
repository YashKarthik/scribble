import { ExcalidrawAPIRefValue, ExportOpts } from '@excalidraw/excalidraw/types/types';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'

export function PromptInput({ excalidrawRef }:{
  excalidrawRef: MutableRefObject<ExcalidrawAPIRefValue|null>
}) {
  const [textPrompt, setTextPrompt] = useState("");
  const exportToCanvasRef = useRef<any>(null);
  const canvasUrl = useRef("");
  const [emptyCanvasError, setEmptyCanvasError] = useState(false);

  useEffect(() => {
    import('@excalidraw/excalidraw').then((comp) => {
      exportToCanvasRef.current = comp.exportToCanvas;
    });
  }, []);

  return (
    <div className="
      min-w-max my-2
    ">

      <input
        type="text"
        name="text-prompt"
        id="prompt-input"
        placeholder="An image of a futuristic supercar."
        onChange={e => setTextPrompt(e.target.value)}
        className="
          mx-3 p-2
          italic
          border-2 rounded-md border-solid 
          bg-inherit border-gray-400
          w-3/4
        ">
      </input>

      <button
        type="button"
        onClick={async () => {
          if (!excalidrawRef.current?.ready) return;

          const elements = excalidrawRef.current.getSceneElements();
          if (!elements || !elements.length) {
            setEmptyCanvasError(true);
            return;
          }

          setEmptyCanvasError(false);

          const canvas = await exportToCanvasRef.current({
            elements: elements,
            mimeType: "image/png",
            //appState: excalidrawRef.current.getAppState(),
            files: excalidrawRef.current.getFiles(),
            getDimensions: () => { return {width: 350, height: 350}}, // experiment with this for cheaper replicate API.
          });

          const ctx = canvas.getContext("2d");
          ctx.font = "30px Virgil";
          canvasUrl.current = canvas.toDataURL();
          console.log(canvasUrl.current);
        }}
        className={`
          bg-indigo-100 text-indigo-900
          border-2 rounded-md border-solid 
          ${emptyCanvasError ? "bg-red-100": "bg-indigo-100"}
          ${emptyCanvasError ? "border-red-100": "border-indigo-100"}
          ${emptyCanvasError ? "hover:border-red-200": "hover:border-indigo-200"}
          ${emptyCanvasError ? "hover:bg-red-200": "hover:bg-indigo-200"}
          p-2
        `}>
        Generate!
      </button>
    </div>
  );
}
