import { ExcalidrawAPIRefValue } from "@excalidraw/excalidraw/types/types";
import { type NextPage } from "next";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { ExcalidrawPage } from "~/components/DrawingCanvas";
import { PromptInput } from "~/components/PromptInput";

const Home: NextPage = () => {
  const excalidrawAPI = useRef<ExcalidrawAPIRefValue|null>(null);
  const excalidrawRef = useMemo(
    () => ({
      current: {
        readyPromise: new Promise<ExcalidrawAPIRefValue|null>(() => {
          setTimeout(() => excalidrawAPI, 1000);
          return excalidrawAPI;
        })
      }
    }), []);

  const testRef = new Promise<MutableRefObject<ExcalidrawAPIRefValue|null>>(() => {
    setTimeout(() => excalidrawAPI, 1000);
    return excalidrawAPI;
  });

  return (
    <>
      <main className="flex flex-col min-h-screen">

        <h1 className="
          self-center my-4
          text-4xl font-black
          underline decoration-wavy decoration-indigo-400
          decoration-0 hover:decoration-2
        ">Scribble!</h1>

        <div className="
          flex flex-col md:flex-row
          gap-2 p-4 h-[45rem]
        ">

          <div className="
            border-black border-2 border-solid
            w-1/2 rounded-md
          ">
            <ExcalidrawPage excalidrawAPI={excalidrawAPI} />
          </div>

          <div className="
            border-black border-2 border-solid
            w-1/2 rounded-md
          ">
            <img src="https://www.yashkarthik.xyz/ogImage.png" alt="test" />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const resolvablePromise = () => {
  let resolve;
  let reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  // @ts-expect-error
  promise.resolve = resolve;
  // @ts-expect-error
  promise.reject = reject;
  return promise;
};
