import { LoadingStatusType } from "@/context/canvas-context";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useCanvas } from "@/context/canvas-context";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import CanvasFloatingToolbar from "./canvas-floating-toolbar";
import { useState } from "react";
import { TOOL_MODE_ENUM, ToolModeType } from "@/constants/canvas";
import { Transform } from "stream";
import CanvasControls from "./canvas-controls";
import DeviceFrame from "./device-frame";
import { ifError } from "assert";
import DeviceFrameSkeleton from "./device-frame-skeleton";

const DEMO_HTML = `
<div class="flex flex-col w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-6 pb-24 px-6 overflow-y-auto relative">

  <!-- Header -->
  <header class="flex justify-between items-center mb-8">
    <div>
      <p class="text-[var(--muted-foreground)] text-xs uppercase tracking-widest font-semibold mb-1">
        Welcome Back
      </p>
      <h1 class="text-2xl font-bold tracking-tight text-[var(--foreground)]">
        Alex Runner
      </h1>
    </div>

    <div class="h-12 w-12 rounded-full border-2 border-[var(--primary)] p-1 overflow-hidden shadow-[0_0_10px_var(--primary)]">
      <img
        src="https://i.pravatar.cc/150?img=11"
        alt="User"
        class="w-full h-full object-cover rounded-full"
      />
    </div>
  </header>

  <!-- Central Circular Progress -->
  <div class="relative flex items-center justify-center mb-10">

    <!-- Glow -->
    <div class="absolute inset-0 bg-[var(--primary)] opacity-20 blur-3xl rounded-full transform scale-75"></div>

    <div class="relative w-64 h-64">

      <svg class="w-full h-full transform -rotate-90">

        <!-- Background -->
        <circle
          cx="128"
          cy="128"
          r="120"
          stroke="var(--muted)"
          stroke-width="8"
          fill="transparent"
        />

        <!-- Progress -->
        <circle
          cx="128"
          cy="128"
          r="120"
          stroke="var(--primary)"
          stroke-width="8"
          fill="transparent"
          stroke-dasharray="753.6"
          stroke-dashoffset="188"
          stroke-linecap="round"
          class="drop-shadow-[0_0_8px_var(--primary)]"
        />

        <!-- Inner -->
        <circle
          cx="128"
          cy="128"
          r="100"
          stroke="var(--muted)"
          stroke-width="6"
          fill="transparent"
        />

        <circle
          cx="128"
          cy="128"
          r="100"
          stroke="var(--accent)"
          stroke-width="6"
          fill="transparent"
          stroke-dasharray="628"
          stroke-dashoffset="200"
          stroke-linecap="round"
          class="drop-shadow-[0_0_8px_var(--accent)]"
        />
      </svg>

      <!-- Center Text -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <iconify-icon icon="lucide:footprints" class="text-[var(--primary)] text-3xl mb-1"></iconify-icon>

        <span class="text-5xl font-black italic tracking-tighter text-[var(--foreground)]">
          8,432
        </span>

        <span class="text-[var(--muted-foreground)] text-sm font-medium uppercase tracking-widest">
          Steps
        </span>

        <div class="mt-2 flex items-center gap-1 text-[var(--accent)]">
          <iconify-icon icon="lucide:flame" width="14"></iconify-icon>
          <span class="text-sm font-bold">420 kcal</span>
        </div>
      </div>

    </div>
  </div>

  <!-- Heart Rate Graph -->
  <div class="mb-6">

    <div class="flex justify-between items-end mb-4">
      <h2 class="text-lg font-bold flex items-center gap-2">
        <iconify-icon icon="lucide:activity" class="text-[var(--accent)]"></iconify-icon>
        Heart Rate
      </h2>

      <span class="text-[var(--accent)] font-mono font-bold text-xl drop-shadow-[0_0_5px_var(--accent)]">
        112 BPM
      </span>
    </div>

    <div class="h-32 w-full bg-[var(--card)] rounded-[var(--radius)] border border-[var(--muted)] relative overflow-hidden p-4 flex items-end">

      <!-- Grid -->
      <div class="absolute inset-0 grid grid-rows-4 opacity-10 pointer-events-none">
        <div class="border-b border-[var(--foreground)]"></div>
        <div class="border-b border-[var(--foreground)]"></div>
        <div class="border-b border-[var(--foreground)]"></div>
      </div>

      <svg class="w-full h-full overflow-visible" preserveAspectRatio="none">

        <!-- Line -->
        <path
          d="M0,80 C20,80 40,50 60,60 S100,20 120,40 S160,80 180,70 S220,10 240,30 S280,60 350,50"
          fill="none"
          stroke="var(--accent)"
          stroke-width="3"
          class="drop-shadow-[0_0_6px_var(--accent)]"
        />

        <!-- Area -->
        <path
          d="M0,80 C20,80 40,50 60,60 S100,20 120,40 S160,80 180,70 S220,10 240,30 S280,60 350,50 V150 H0 Z"
          fill="var(--accent)"
          fill-opacity="0.1"
        />

      </svg>

    </div>
  </div>

  <!-- Metrics Grid -->
  <div class="grid grid-cols-2 gap-4">

    <!-- Water Card -->
    <button class="bg-[var(--card)] p-5 rounded-[var(--radius)] border border-[var(--muted)] flex flex-col items-start active:scale-95 transition-transform">
      <div class="bg-[var(--muted)] p-2 rounded-full mb-3 text-[var(--accent)]">
        <iconify-icon icon="lucide:droplets" width="24" height="24"></iconify-icon>
      </div>

      <span class="text-[var(--muted-foreground)] text-xs font-bold uppercase">
        Water
      </span>

      <span class="text-xl font-bold text-[var(--foreground)]">
        1,250ml
      </span>
    </button>

    <!-- SpO2 -->
    <button class="col-span-2 bg-[var(--card)] p-4 rounded-[var(--radius)] border border-[var(--muted)] flex items-center justify-between active:scale-95 transition-transform">

      <div class="flex items-center gap-4">

        <div class="bg-[var(--muted)] p-2 rounded-full text-white">
          <iconify-icon icon="lucide:wind" width="24" height="24"></iconify-icon>
        </div>

        <div class="flex flex-col text-left">
          <span class="text-[var(--muted-foreground)] text-xs font-bold uppercase">
            SpO2 Level
          </span>

          <span class="text-lg font-bold text-[var(--foreground)]">
            98% Normal
          </span>
        </div>

      </div>

      <div class="h-2 w-24 bg-[var(--muted)] rounded-full overflow-hidden">
        <div class="h-full w-[98%] bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"></div>
      </div>

    </button>

  </div>

  <!-- Bottom Navigation -->
  <nav class="mobile-bottom-nav">

    <a href="#" class="mobile-bottom-nav-item active">
      <iconify-icon icon="lucide:home"></iconify-icon>
      <span>Home</span>
      <div class="nav-indicator"></div>
    </a>

    <a href="#" class="mobile-bottom-nav-item">
      <iconify-icon icon="lucide:activity"></iconify-icon>
      <span>Stats</span>
      <div class="nav-indicator"></div>
    </a>

    <a href="#" class="mobile-bottom-nav-item">
      <iconify-icon icon="lucide:dumbbell"></iconify-icon>
      <span>Gym</span>
      <div class="nav-indicator"></div>
    </a>

    <a href="#" class="mobile-bottom-nav-item">
      <iconify-icon icon="lucide:user"></iconify-icon>
      <span>Profile</span>
      <div class="nav-indicator"></div>
    </a>

  </nav>

</div>
`;

const Canvas = ({
  projectId,
  isPending,
  projectName,
}: {
  projectId: string;
  isPending: boolean;
  projectName: string | null;
}) => {
  const { theme, loadingStatus, frames } =
    useCanvas();
  const [toolMode, setToolMode] = useState<ToolModeType>(TOOL_MODE_ENUM.SELECT);
  const [zoomPercent, setZoomPercent] = useState<number>(53);
  const [currentScale, setCurrentScale] = useState<number>(0.53);

  const currentStatus = isPending
    ? "fetching"
    : loadingStatus !== "idle" && loadingStatus !== "completed"
      ? loadingStatus
      : null;

  return (
    <>
      <div className="relative w-full h-full overflow-hidden">
        <CanvasFloatingToolbar />

        {currentStatus && <CanvasLoader status={currentStatus} />}

        <TransformWrapper
          initialScale={0.53}
          initialPositionX={40}
          initialPositionY={5}
          minScale={0.1}
          maxScale={3}
          wheel={{ step: 0.1 }}
          pinch={{ step: 0.1 }}
          doubleClick={{ disabled: true }}
          centerZoomedOut={false}
          centerOnInit={false}
          smooth={true}
          limitToBounds={false}
          panning={{ disabled: toolMode !== TOOL_MODE_ENUM.HAND }}
          onTransformed={(ref) => {
            setZoomPercent(Math.round(ref.state.scale * 100));
            setCurrentScale(ref.state.scale);
          }}
        >
          {({ zoomIn, zoomOut }) => (
            <>
              <div
                className={cn(
                  `absolute inset-0 w-full h-full bg-[#eee]
        dark:bg-[#242423] p-3
        `,
                  toolMode === TOOL_MODE_ENUM.HAND
                    ? "cursor-grab active:cursor-grabbing"
                    : "cursor-default",
                )}
                style={{
                  backgroundImage:
                    "radial-gradient(circle, var(--primary)) 1px, transparent 1px",
                  backgroundSize: "20px 20px",
                }}
              >
                <TransformComponent
                  wrapperStyle={{
                    width: "100%",
                    height: "100%",
                    overflow: "unset",
                    
                  }}
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                    
                  }}
                >
              <div>{frames?.map((frame, index: number) => {
                const baseX = 100 + index * 480;
                const y = 100;
                if(frame.isLoading){
                  return (
                    <DeviceFrameSkeleton
                    key={index}
                    style = {{
                      transform: `translate(${baseX}px, 100px)`,
                    }}
                    />
                  )
                }
                  return (
                <DeviceFrame
                  key={frame.id}
                  frameId={frame.id}
                  title={frame.title}
                  html={frame.htmlContent}
                  scale={currentScale}
                  initialPosition={{
                    x: baseX,
                    y,
                  }}
                  toolMode={toolMode}
                  theme_style={theme?.style ?? ""}
                />
                );
              })}</div>

                <DeviceFrame
  frameId="demo"
  title="Demo Screen 345"
  html={DEMO_HTML}
  scale={currentScale}
  initialPosition={{
    x: 1000,
    y: 100,
  }}
  toolMode={toolMode}
  theme_style={theme?.style ?? ""}
/>

                </TransformComponent>
              </div>
              <CanvasControls
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                zoomPercent={zoomPercent}
                toolMode={toolMode}
                setToolMode={setToolMode}
              />
            </>
          )}
        </TransformWrapper>
      </div>
    </>
  );
};

function CanvasLoader({ status }: { status?: LoadingStatusType | "fetching" }) {
  return (
    <div
      className={cn(
        `absolute top-4 left-1/2 -translate-x-1/2 min-w-40
    max-w-full px-4 pt-1.5 pb-2
    rounded-br-xl rounded-bl-xl shadow-md
    flex items-center space-x-2 z-10`,
        status === "fetching" && "bg-gray-500 text-white",
        status === "running " && "bg-amber-500 text-white",
        status === "analyzing" && "bg-blue-500 text-white",
        status === "generating" && "bg-purple-500 text-white",
      )}
    >
      <Spinner className="w-4 h-4 stroke-3!" />
      <span className="text-sm font-medium capitalize">
        {status === "fetching" ? "Loading Project" : status}
      </span>
    </div>
  );
}

export default Canvas;
