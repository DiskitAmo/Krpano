// import { useMemo, useRef, useState } from "react";
// import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
// import { VirtualTourPlugin } from "@photo-sphere-viewer/virtual-tour-plugin";
// import "@photo-sphere-viewer/virtual-tour-plugin/index.css";

// /* 360 IMAGES */
// import img001 from "./assets/images/001.jpg"; // front gate / door
// import img01 from "./assets/images/01.jpg"; // front with surroundings
// import img02 from "./assets/images/02.jpg"; // right corner
// import img03 from "./assets/images/03.jpg"; // just inside the gate
// import img04 from "./assets/images/04.jpg"; // lobby
// import img004 from "./assets/images/004.jpg"; // cabins

// /* helpers */
// const TAU = Math.PI * 2;
// const toRad = (deg: number) => {
//   let r = (deg * Math.PI) / 180;
//   r %= TAU;
//   if (r < 0) r += TAU;
//   return r;
// };
// const rad2deg = (r: number) => (r * 180) / Math.PI;

// /* scenes (poseHeading rotates the pano itself) */
// const SCENES = [
//   { id: "front", title: "Front (surroundings)", src: img01, forwardYawDeg: 0 },
//   { id: "corner", title: "Right-corner view", src: img02, forwardYawDeg: 0 },
//   { id: "gate", title: "Main gate / door", src: img001, forwardYawDeg: 0 },
//   {
//     id: "inside",
//     title: "Just inside the gate",
//     src: img03,
//     forwardYawDeg: 0,
//     panoData: { poseHeading: 220 }, // your current working heading
//   },
//   {
//     id: "lobby",
//     title: "Lobby",
//     src: img04,
//     forwardYawDeg: 0,
//     panoData: { poseHeading: 180 },
//   },
//   { id: "cabins", title: "Cabins", src: img004, forwardYawDeg: 0 },
// ];
// const META = new Map(SCENES.map((s) => [s.id, s]));

// /* graph */
// const NEIGHBORS = {
//   gate: ["inside", "front", "corner"],
//   front: ["gate", "corner"],
//   corner: ["gate", "front"],
//   inside: ["lobby", "gate"],
//   lobby: ["cabins", "inside"],
//   cabins: ["lobby"],
// };

// /* HUD "Next" logic */
// // const NEXT_FWD  = { gate:"inside", inside:"lobby", lobby:"cabins", cabins:null, front:"gate", corner:"gate" };
// // const NEXT_EXIT = { cabins:"lobby", lobby:"inside", inside:"gate", gate:"front", front:"corner", corner:null };

// /* >>> Custom yaw offsets (degrees, relative to scene forward) to add SPACE */
// const CUSTOM_LINK_YAW = {
//   // spread the first three arrows at the entrance
//   gate: { inside: 0, front: -180, corner: 90 },

//   // (optional) examples if you want spacing elsewhere later:
//   inside: { lobby: 90, gate: 180 },
//   // corner: { gate: 0, front: -70 },
// };
// //type SceneId = keyof typeof CUSTOM_LINK_YAW | keyof typeof NEIGHBORS | string;
// /* place VT link arrows */
// function placeLinks({ sceneId, neighbors, forwardYawRad }: any) {
//   const out: {
//     nodeId: any;
//     position: { yaw: any; pitch: number };
//     tooltip: any;
//     targetYaw: number;
//   }[] = [];

//   // wider default spread than before (used when no custom offset defined)
//   const defaultPool = [
//     toRad(-70),
//     toRad(70),
//     toRad(-120),
//     toRad(120),
//     toRad(170),
//     toRad(-170),
//   ];
//   const taken = new Map();

//   // apply per-neighbor custom offsets first (if provided)
//   const custom : any = CUSTOM_LINK_YAW[sceneId] || {};
//   neighbors.forEach((n:any) => {
//     if (custom[n] !== undefined) {
//       taken.set(n, (forwardYawRad + toRad(custom[n])) % TAU);
//     }
//   });

//   // keep our helpful conventions if not overridden:
//   if (!taken.has("inside") && neighbors.includes("inside"))
//     taken.set("inside", forwardYawRad);
//   if (!taken.has("gate") && neighbors.includes("gate"))
//     taken.set("gate", (forwardYawRad + Math.PI) % TAU);

//   // assign remaining neighbors from the widened pool
//   neighbors.forEach((n:any) => {
//     if (!taken.has(n)) {
//       const off = defaultPool.length ? defaultPool.shift() : toRad(60);
//       taken.set(n, (forwardYawRad + off) % TAU);
//     }
//   });

//   // build VT link objects
//   neighbors.forEach((n:any) => {
//     const target = META.get(n);
//     out.push({
//       nodeId: n,
//       position: { yaw: taken.get(n), pitch: toRad(-4) },
//       tooltip: target?.title || n,
//       targetYaw: toRad(target?.forwardYawDeg ?? 0),
//     });
//   });

//   return out;
// }

// export default function App() {
//   const [currentId, setCurrentId] = useState("gate");
//   const viewerRef = useRef(null);
//   const historyRef = useRef(["gate"]);
//   const backJumpRef = useRef(false);
//   // const exitModeRef = useRef(false);

//   // const plugins = useMemo(() => [[VirtualTourPlugin, { renderMode: "3d" }]], []);

//   const buildNodes = () =>
//     SCENES.map((s) => {
//       const f = toRad(s.forwardYawDeg ?? 0);
//       return {
//         id: s.id,
//         name: s.title,
//         panorama: s.src,
//         links: placeLinks(s.id, NEIGHBORS[s.id] || [], f),
//         ...(s.panoData ? { panoData: s.panoData } : {}),
//       };
//     });

//   function faceScene(sceneId, dur = 0) {
//     const v = viewerRef.current;
//     const s = META.get(sceneId);
//     if (!v || !s) return;
//     const yaw = toRad(s.forwardYawDeg ?? 0);
//     try {
//       v.rotate?.({ yaw, pitch: 0 }, dur);
//     } catch {
//       /* empty */
//     }
//     try {
//       v.animate?.({ yaw, pitch: 0 }, dur);
//     } catch {
//       /* empty */
//     }
//     try {
//       v.animate?.({ longitude: yaw, latitude: 0 }, dur);
//     } catch {
//       /* empty */
//     }
//   }

//   // function gotoNode(targetId, { push = true, from = "other" } = {}) {
//   //   if (!targetId || targetId === currentId) return;
//   //   const v  = viewerRef.current;
//   //   const vt = v?.getPlugin(VirtualTourPlugin);

//   //   if (vt?.setCurrentNode) vt.setCurrentNode(targetId);
//   //   else if (vt?.setCurrentNodeId) vt.setCurrentNodeId(targetId);
//   //   else if (vt?.showNode) vt.showNode(targetId);

//   //   if (from !== "next") exitModeRef.current = false;
//   //   if (push) historyRef.current.push(targetId); else backJumpRef.current = true;

//   //   faceScene(targetId, 0);
//   // }

//   // function goBack() {
//   //   if (historyRef.current.length <= 1) return;
//   //   historyRef.current.pop();
//   //   const prev = historyRef.current[historyRef.current.length - 1];
//   //   exitModeRef.current = false;
//   //   gotoNode(prev, { push: false, from: "back" });
//   // }

//   // function goNext() {
//   //   let target = null;
//   //   if (exitModeRef.current || currentId === "cabins") {
//   //     exitModeRef.current = true;
//   //     target = NEXT_EXIT[currentId] || null;
//   //   } else {
//   //     target = NEXT_FWD[currentId] || null;
//   //   }
//   //   if (target) gotoNode(target, { from: "next" });
//   // }

//   function handleReady(instance) {
//     viewerRef.current = instance;
//     const vt = instance.getPlugin(VirtualTourPlugin);
//     vt.setNodes(buildNodes(), currentId);

//     instance.on("panorama-loaded", () => {
//       const id = vt.getCurrentNode()?.id || currentId;
//       setCurrentId(id);
//       if (backJumpRef.current) backJumpRef.current = false;
//       else {
//         const h = historyRef.current;
//         if (h[h.length - 1] !== id) h.push(id);
//       }
//       faceScene(id, 0);
//     });

//     faceScene(currentId, 0);
//   }

//   // HUD labels
//   // const nextTitle = (() => {
//   //   if (exitModeRef.current || currentId === "cabins") {
//   //     const t = NEXT_EXIT[currentId];
//   //     return t ? `Next: ${META.get(t)?.title}` : "Next";
//   //   } else {
//   //     const t = NEXT_FWD[currentId];
//   //     return t ? `Next: ${META.get(t)?.title}` : "Next";
//   //   }
//   // })();
//   // const backTitle =
//   //   historyRef.current.length > 1
//   //     ? `Back: ${META.get(historyRef.current[historyRef.current.length - 2])?.title}`
//   //     : "Back";

//   // click to read yaw/pitch for calibration
//   const handleClick = (_, data) => {
//     const yawDeg = ((rad2deg(data.longitude) + 540) % 360) - 180;
//     const pitchDeg = rad2deg(data.latitude);
//     console.log(
//       `[CALIBRATE] scene=${currentId} yaw=${yawDeg.toFixed(
//         1
//       )}°, pitch=${pitchDeg.toFixed(1)}°`
//     );
//   };

//   return (
//     <div className="viewer-wrap">
//       {/* Fixed HUD */}
//       {/* <div className="hud">
//         <button className="hud-btn left" onClick={goBack} disabled={historyRef.current.length <= 1} title={backTitle}>
//           <span className="chev">‹</span><span className="lbl">{backTitle}</span>
//         </button>
//         <button className="hud-btn right" onClick={goNext} title={nextTitle}>
//           <span className="lbl">{nextTitle}</span><span className="chev">›</span>
//         </button>
//       </div> */}

//       <ReactPhotoSphereViewer
//         src={META.get(currentId)?.src}
//         plugins={useMemo(() => [[VirtualTourPlugin, { renderMode: "3d" }]], [])}
//         height="100vh"
//         width="100vw"
//         onReady={handleReady}
//         onClick={handleClick}
//       />

//       <style>{`
//         body{margin:0; padding:0; overflow:hidden;}
//         .viewer-wrap{ position:relative }
//         .hud{
//           position:absolute; inset:0; display:flex; align-items:center; justify-content:space-between;
//           padding:0 16px; pointer-events:none; z-index:10;
//         }
//         .hud-btn{
//           pointer-events:auto; display:flex; align-items:center; gap:10px;
//           background:rgba(0,0,0,.5); color:#fff; border:1px solid rgba(255,255,255,.35);
//           padding:10px 14px; border-radius:999px; backdrop-filter:blur(6px);
//           font-weight:700; cursor:pointer; user-select:none;
//         }
//         .hud-btn .chev{ font-size:24px; line-height:1 }
//         .hud-btn .lbl{ font-size:14px }
//         .hud-btn:disabled{ opacity:.35; cursor:not-allowed }
//       `}</style>
//     </div>
//   );
// }
