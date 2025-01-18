// src/page.tsx
import React from "react";
import Video from "./components/Video";
import Control from "./components/Control";
import Comment from "./components/Comment";

export default function Home() {
  return (
    <div className="grid grid-cols-5 min-h-screen p-8 gap-4 items-stretch">
      {/* Left Column */}
      <div className="col-span-3 grid grid-rows-2 gap-4">
        <div className="row-span-2">
          <Video />
        </div>
        <div className="row-span-1">
          <Control />
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-2 row-span-2">
        <Comment />
      </div>
    </div>

  );
}
