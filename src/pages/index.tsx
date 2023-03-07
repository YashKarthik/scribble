import { type NextPage } from "next";
import { useState, useEffect } from "react";
import { ExcalidrawPage } from "~/components/DrawingCanvas";

const Home: NextPage = () => {
  return (
    <>
      <ExcalidrawPage />
    </>
  );
};

export default Home;
