import React from "react";

export default function GodotGameIframe() {
  return (
    <div style={{ width: "100%", height: "100vh", background: "#000" }}>
      <iframe
        src="/godot/index.html"
        title="Godot Game"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      />
    </div>
  );
}



// import { useEffect, useRef, useState } from "react";

// export default function GodotGame() {
//   const canvasRef = useRef(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Prevent loading multiple times
//     if (window.__godotLoaded) return;
//     window.__godotLoaded = true;

//     // Create script tag
//     const script = document.createElement("script");
//     script.src = "/godot/index.js";  // Your Godot JS file
//     script.async = true;

//     script.onload = async () => {
//       console.log("✅ Godot script loaded");

//       // Wait for Engine to exist
//       const waitForEngine = () =>
//         new Promise((resolve, reject) => {
//           let attempts = 0;
//           const interval = setInterval(() => {
//             if (window.Engine && typeof window.Engine.create === "function") {
//               clearInterval(interval);
//               resolve(window.Engine);
//             } else if (attempts++ > 50) {
//               clearInterval(interval);
//               reject("Engine not found");
//             }
//           }, 100);
//         });

//       try {
//         const Engine = await waitForEngine();

//         // Initialize Godot engine
//         const engine = await Engine.create({
//           canvas: canvasRef.current,
//           basePath: "/godot/",
//           args: [],
//         });

//         await engine.start();
//         setLoading(false);
//         console.log("🚀 Godot engine started!");
//       } catch (err) {
//         console.error("❌ Failed to initialize Godot engine:", err);
//       }
//     };

//     script.onerror = () => console.error("❌ Failed to load Godot script.");
//     document.body.appendChild(script);

//     return () => {
//       // Optional cleanup
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <div style={{ width: "100%", height: "100vh", background: "#000" }}>
//       {loading && (
//         <div style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>
//           Loading game...
//         </div>
//       )}
//       <canvas
//         ref={canvasRef}
//         style={{ width: "100%", height: "100%", display: loading ? "none" : "block" }}
//       />
//     </div>
//   );
// }
