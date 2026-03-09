import { LoadingStatusType } from "@/context/canvas-context";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useCanvas } from "@/context/canvas-context";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import CanvasFloatingToolbar from "./canvas-floating-toolbar";
import { useCallback, useEffect, useRef, useState } from "react";
import { TOOL_MODE_ENUM, ToolModeType } from "@/constants/canvas";
import { Transform } from "stream";
import CanvasControls from "./canvas-controls";
import DeviceFrame from "./device-frame";
import { ifError } from "assert";
import DeviceFrameSkeleton from "./device-frame-skeleton";
import HtmlDialog from "./html-dialog";
import { toast } from "sonner";
import { _catch } from "zod/v4/core";
import axios from "axios";


const Canvas = ({
  projectId,
  isPending,
  projectName,
}: {
  projectId: string;
  isPending: boolean;
  projectName: string | null;
}) => {
  const { theme, loadingStatus, frames, selectedFrameId, setSelectedFrameId } =
    useCanvas();
  const [toolMode, setToolMode] = useState<ToolModeType>(TOOL_MODE_ENUM.SELECT);
  const [zoomPercent, setZoomPercent] = useState<number>(53);
  const [currentScale, setCurrentScale] = useState<number>(0.53);
  const [openHtmlDialog, setOpenHtmlDialog] = useState(false);

  const [isScreenshotting, setIsScreenshotting] = useState(false);
  const canvasRootRef = useRef<HTMLDivElement>(null);
  const selectedFrame = frames?.find((frame) => frame.id === selectedFrameId);
  const currentStatus = isPending
    ? "fetching"
    : loadingStatus !== "idle"
      ? loadingStatus
      : null;

  const saveThumbnailToProject = useCallback(
    async (projectId: string | null) => {
      try {
        if (!projectId) return null;
        const result = getCanvasHtmlContent();
        if (!result?.html) {
          return null;
        }
        setSelectedFrameId(null);

        const response = await axios.post("/api/screenshot", {
          html: result.html,
          width: result.element.scrollWidth,
          height: result.element.scrollHeight,
          projectId,
        });
        if (response.data) {
          console.log("Thumbnail saved", response.data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [setSelectedFrameId],
  );

  useEffect(() => {
    if (!projectId) return;
    if (loadingStatus !== "completed") return;
    saveThumbnailToProject(projectId);
  }, [loadingStatus, projectId, saveThumbnailToProject]);

  const onOpenHtmlDialog = () => {
    setOpenHtmlDialog(true);
  };

  function getCanvasHtmlContent() {
    const el = canvasRootRef.current;
    if (!el) {
      toast.error("Canvas element not found");
      return null;
    }
    let styles = "";
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) styles += rule.cssText;
      } catch {}
    }

    return {
      element: el,
      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{margin:0}
*{box-sizing:border-box}
${styles}
</style>
</head>
<body>${el.outerHTML}</body>
</html>
`,
    };
  }

  const handleCanvasScreenshot = useCallback(async () => {
    try {
      const result = getCanvasHtmlContent();
      if (!result?.html) {
        toast.error("Failed to get cnavas content");
        return null;
      }
      setSelectedFrameId(null);
      setIsScreenshotting(true);
      const response = await axios.post(
        "/api/screenshot",
        {
          html: result.html,
          width: result.element.scrollWidth,
          height: result.element.scrollHeight,
        },
        {
          responseType: "blob",
          validateStatus: (s) => (s >= 200 && s < 300) || s === 304,
        },
      );
      const title = projectName || "canvas";
      const blob = new Blob([response.data], { type: "image/png" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Screenshot downloaded");
    } catch (error) {
      console.log(error);
      toast.error("Failed to screenshot canvas");
    } finally {
      setIsScreenshotting(false);
    }
  }, [projectName, setSelectedFrameId]);

  return (
    <>
      <div className="relative w-full h-full overflow-hidden">
        <CanvasFloatingToolbar
          isScreenshotting={isScreenshotting}
          onScreenshot={handleCanvasScreenshot}
          projectId={projectId}
        />

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
                ref={canvasRootRef}
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
                  <div>
                    {frames?.map((frame, index: number) => {
                      const baseX = 100 + index * 480;
                      const y = 100;

                      // if (frame.isLoading) {
                      //   return (
                      //     <DeviceFrameSkeleton
                      //       key={index}
                      //       style={{
                      //         transform: `translate(${baseX}px, 100px)`,
                      //       }}
                      //     />
                      //   );
                      // }

                      return (
                        <DeviceFrame
                          key={frame.id}
                          frameId={frame.id}
                          title={frame.title}
                          html={frame.htmlContent}
                          isLoading={frame.isLoading}
                          scale={currentScale}
                          initialPosition={{
                            x: baseX,
                            y,
                          }}
                          toolMode={toolMode}
                          theme_style={theme?.style ?? ""}
                          onOpenHtmlDialog={onOpenHtmlDialog}
                        />
                      );
                    })}
                  </div>

                  {/* <DeviceFrame
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
                    onOpenHtmlDialog={onOpenHtmlDialog}
                  /> */}
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
      <HtmlDialog
        html={selectedFrame?.htmlContent || DEMO_HTML}
        theme_style={theme?.style}
        open={openHtmlDialog}
        onOpenChange={setOpenHtmlDialog}
      />
    </>
  );
};

function CanvasLoader({ status }: { status?: LoadingStatusType | "fetching" }) {
  return (
    <>
      <div
        className={cn(
          `absolute top-4 left-1/2 -translate-x-1/2 min-w-40
    max-w-full px-4 pt-1.5 pb-2
    rounded-br-xl rounded-bl-xl shadow-md
    flex items-center space-x-2 z-10`,
          status === "fetching" && "bg-gray-500 text-white",
          status === "running" && "bg-amber-500 text-white",
          status === "analyzing" && "bg-blue-500 text-white",
          status === "generating" && "bg-purple-500 text-white",
        )}
      >
        <Spinner className="w-4 h-4 stroke-3!" />
        <span className="text-sm font-medium capitalize">
          {status === "fetching" ? "Loading Project" : status}
        </span>
      </div>
    </>
  );
}

export default Canvas;
