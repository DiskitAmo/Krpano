import { useEffect, useRef } from "react";

declare global {
  interface Window {
    embedpano?: (opts?: any) => void;
    removepano?: (id?: string) => void;
  }
}

const VirtualViewer = ({ page }: { page: number }) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // dynamically load the krpano script
    const script = document.createElement("script");
    script.src = "/vtour/tour.js";
    script.async = true;
    script.onload = () => {
      if (window.embedpano) {
        window.embedpano({
          swf: null, // we don’t need flash
          xml: `/vtour/tour${page}.xml`,
          target: "krpanoContainer",
          html5: "only",
          passQueryParameters: true,
          consolelog: true,
        });
      }
    };
    document.body.appendChild(script);

    // cleanup on unmount
    return () => {
      if (window.removepano) {
        window.removepano("krpanoContainer");
      }
    };
  }, []);
  return (
    <div
      id="krpanoContainer"
      ref={viewerRef}
      style={{ width: "100%", height: "100vh", background: "#000" }}
    />
  );
};

export default VirtualViewer;
