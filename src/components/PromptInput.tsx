import React, { useState } from 'react'

export const PromptInput = () => {
  const [textPrompt, setTextPrompt] = useState("");

  return (
    <div className='bg-black'>
      <input
        type="text"
        name="text-prompt"
        id="prompt-input"
        placeholder="An image of a futuristic supercar."
        onChange={e => setTextPrompt(e.target.value)}
        className="
          mx-3 px-1
          border-2 rounded-md border-solid 
          bg-inherit border-gray-400
        ">
      </input>

      <button
        type="button"
        onClick={e => {
          e.preventDefault();
          console.log(textPrompt);
        }}
      >
        Generate!
      </button>
    </div>
  );
}
