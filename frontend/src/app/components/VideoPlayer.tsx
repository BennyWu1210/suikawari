// src/components/VideoPlayer.tsx
"use client";

import { useEffect, useRef } from "react";

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // In a real implementation, you'd request camera access and set the srcObject:
    // navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    //   .then(stream => {
    //     if (videoRef.current) {
    //       videoRef.current.srcObject = stream;
    //     }
    //   })
    //   .catch(error => console.error(error));
  }, []);

  return (
    <video
      id="camera"
      ref={videoRef}
      autoPlay
      muted
      playsInline
      style={{ width: "100%", height: "auto", maxWidth: "100%", objectFit: "contain", }}
    />
  );
}
