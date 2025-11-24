import { useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";
import "@photo-sphere-viewer/gallery-plugin/index.css";

const PanoramaViewer = () => {
  const viewerRef = useRef<Viewer | null>(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Photo Sphere Viewer
    viewerRef.current = new Viewer({
      container: containerRef.current,
      panorama: "/images/01.jgp", // 🖼️ path to your 360° image
      //   defaultYaw: 0,
      //   touchmoveTwoFingers: true,
    });

    // Cleanup on unmount
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      //style="width: 100vw; height: 100vh;"
      style={{
        width: "100vw",
        height: "100vh", // adjust as needed
      }}
    />
  );
};

export default PanoramaViewer;
