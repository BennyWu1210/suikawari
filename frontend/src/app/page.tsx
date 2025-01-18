// src/page.tsx
import React from "react";
import Video from "./components/Video";
import Control from "./components/Control";
import Comment from "./components/Comment";

export default function Home() {
  return (
    <div className="grid grid-cols-3 min-h-screen p-8 gap-4">
      {/* Left Column */}
      <div className="col-span-1 space-y-4">
        <Video />
        <Control />
      </div>

      {/* Right Column */}
      <div className="col-span-2">
        <Comment />
      </div>
    </div>
  );
}
