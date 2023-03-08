import { exportToBlob, exportToCanvas } from '@excalidraw/excalidraw';
import { ExcalidrawAPIRefValue } from '@excalidraw/excalidraw/types/types';
import React, { MutableRefObject, useEffect, useState } from 'react'

export function PromptInput({ excalidrawRef: excalidrawAPI }:{
  excalidrawRef: MutableRefObject<ExcalidrawAPIRefValue|null>
}) {
  const [textPrompt, setTextPrompt] = useState("");

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
          if (!excalidrawAPI) return;
          if (!excalidrawAPI.current?.ready) return;
          console.log("PromptInput initialized.");

          //const elements = excalidrawAPI.current.getSceneElements();
          //if (!elements || !elements.length) return;

          //const canvas = await exportToCanvas({
          //  elements: elements,
          //  appState: excalidrawAPI.current.getAppState(),
          //  files: excalidrawAPI.current.getFiles(),
          //  getDimensions: () => { return {width: 350, height: 350}}
          //});
          //const ctx = canvas.getContext("2d");
          //ctx!.font = "30px Virgil";
          //console.log('hello', canvas.toDataURL());
        }}
        className="
          bg-indigo-100 text-indigo-900
          border-2 rounded-md border-solid 
          border-indigo-100
          hover:bg-indigo-200 hover:border-indigo-200
          p-2
        ">
        Generate!
      </button>
    </div>
  );
}
