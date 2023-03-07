import { type NextPage } from "next";
import { ExcalidrawPage } from "~/components/DrawingCanvas";
import { PromptInput } from "~/components/PromptInput";

const Home: NextPage = () => {
  return (
    <>
      <main className="flex flex-col min-h-screen">
        <div className="flex flex-col md:flex-row">
          <div>
            <ExcalidrawPage />
            <PromptInput />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
