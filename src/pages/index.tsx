import { ExcalidrawAPIRefValue } from "@excalidraw/excalidraw/types/types";
import { type NextPage } from "next";
import { MutableRefObject, useState, useEffect, useMemo, useRef, MemoExoticComponent, ForwardRefExoticComponent, RefAttributes, ComponentType } from "react";
import { ExcalidrawPage } from "~/components/DrawingCanvas";

//const Home: NextPage = () => {
//  const excalidrawAPI = useRef<ExcalidrawAPIRefValue|null>(null);
//
//  return (
//    <>
//      <main className="flex flex-col min-h-screen">
//
//        <h1 className="
//          self-center my-4
//          text-4xl font-black
//          underline decoration-wavy decoration-indigo-400
//          decoration-0 hover:decoration-2
//        ">Scribble!</h1>
//
//        <div className="
//          flex flex-col md:flex-row
//          gap-2 p-4 h-[45rem]
//        ">
//
//          <div className="
//            border-black border-2 border-solid
//            w-1/2 rounded-md
//          ">
//            <ExcalidrawPage excalidrawAPI={excalidrawAPI} />
//          </div>
//
//          <div className="
//            border-black border-2 border-solid
//            w-1/2 rounded-md
//          ">
//            <img src="https://www.yashkarthik.xyz/ogImage.png" alt="test" />
//          </div>
//        </div>
//      </main>
//    </>
//  );
//};

import { FC, ReactElement, Fragment } from 'react';

const Home: FC = (): ReactElement => {
  const [Excalidraw, setExcalidraw] = useState<any>(null);
  const excalidrawRef = useRef<ExcalidrawAPIRefValue>(null);
  const exportToCanvasRef = useRef<any>(null);

  useEffect(() => {
    import('@excalidraw/excalidraw').then((comp) => {
      setExcalidraw(comp.Excalidraw)
      exportToCanvasRef.current = comp.exportToCanvas;
    });
  }, []);

  return (
    <Fragment>
      {!Excalidraw ? (
        <div>Hello</div>
      ) : (
        <div className="App">
          <h1> Excalidraw Example</h1>
          <div className="w-screen h-screen">
            <Excalidraw ref={excalidrawRef} />
          </div>

          <button type="button" onClick={async () => {
            if (!excalidrawRef) return;
            if (!excalidrawRef.current) return;
            if (!excalidrawRef.current.ready) return;

            const elements = excalidrawRef.current.getSceneElements();
            if (!elements || !elements.length) return;

            const canvas = await exportToCanvasRef.current({
              elements: elements,
              appState: excalidrawRef.current.getAppState(),
              files: excalidrawRef.current.getFiles(),
              getDimensions: () => { return {width: 350, height: 350}}
            });
            const ctx = canvas.getContext("2d");
            ctx!.font = "30px Virgil";
            console.log('hello', canvas.toDataURL());
          }}>
            Export
          </button>
        </div>
      )}
    </Fragment>
  );
};


export default Home;
