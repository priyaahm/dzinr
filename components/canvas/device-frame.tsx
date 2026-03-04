"use client";

import { TOOL_MODE_ENUM, ToolModeType } from "@/constants/canvas";
import { useCanvas } from "@/context/canvas-context";
import { getHTMLWrapper } from "@/lib/frame-wrapper";
import { cn } from "@/lib/utils";
import { tool } from "ai";
import { Handlee } from "next/font/google";
import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import DeviceFrameToolbar from "./device-frame-toolbar";

type PropsType = {
  html: string;
  title?: string;
  width?: number;
  minHeight?: number | string;
  initialPosition?: { x: number; y: number };
  frameId: string;
  scale?: number;
  toolMode: ToolModeType;
  theme_style: string;
};

const DeviceFrame = ({
    html,
    title = "Untitled",
    width = 420,
    minHeight = 800,
    initialPosition = { x: 0, y: 0 },
    frameId,
    scale = 1,
    toolMode,
    theme_style,
} : PropsType) => {

    const { selectedFrameId, setSelectedFrameId } = useCanvas();
    const [frameSize, setFrameSize] = useState({ width, 
        height: minHeight, });
    
        const iframeRef = useRef<HTMLIFrameElement>(null);
        const isSelected = selectedFrameId === frameId;
        const fullHtml = getHTMLWrapper(
            html,
            title,
            theme_style,
            frameId);
        
           

  return (
    <Rnd
    default={{
        x:initialPosition.x,
        y:initialPosition.y,
        width,
        height: frameSize.height
    }}
    minWidth={width}
    minHeight={minHeight}
    size={{
        width: frameSize.width,
        height: frameSize.height,
    }}
    disableDragging = {toolMode === TOOL_MODE_ENUM.HAND}
    enableResizing = {isSelected && toolMode !== TOOL_MODE_ENUM.HAND}
    scale={scale}
    onClick={(e: any) => {
        e.stopPropagation();
        if(toolMode === TOOL_MODE_ENUM.HAND){
            setSelectedFrameId(frameId);
        }
    }}
    resizeHandleComponent={{
        topLeft: isSelected ? <Handle /> : undefined,
        topRight: isSelected ? <Handle /> : undefined,
        bottomLeft: isSelected ? <Handle /> : undefined,
        bottomRight: isSelected ? <Handle /> : undefined,
    }}
    resizeHandleStyles={{
        top: {cursor: "ns-resize"},
        bottom: {cursor: "ns-resize"},
        left: {cursor: "ew-resize"},
        right: {cursor: "ew-resize"},
    }}
    onResize={(e,direction,ref)=>{
        setFrameSize(
            {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
            }
        );
    }}
    className={cn(
  "relative z-10",
  isSelected &&
    toolMode !== TOOL_MODE_ENUM.HAND &&
    "ring-3 ring-blue-400 ring-offset-1",
  toolMode === TOOL_MODE_ENUM.HAND
    ? "cursor-grab! active:cursor-grabbing!"
    : "cursor-move"
)}    
>
<div className="w-full h-full">
    <DeviceFrameToolbar
    title={title}
    isSelected={isSelected && toolMode !== TOOL_MODE_ENUM.HAND}
    disabled={false}
    isDownloading = {false}  
    onDownloadPng={()=> { }}
    onOpenHtmlDialog={()=> { }}
    />

    <div className={cn(
        `relative w-full h-auto shadow-sm 
        rounded-[36px] overflow-hidden`,
        isSelected && toolMode !== TOOL_MODE_ENUM.HAND && "rounded-none"
    )}>


       <iframe
  ref={iframeRef}
  srcDoc={fullHtml}
  title={title}
  sandbox="allow-scripts allow-same-origin"
  style={{
    width: "100%",
    minHeight: `${minHeight}px`,
    height: `${frameSize.height}px`,
    border: "none",
    pointerEvents: "none",
    display: "block",
    background: "white",
  }}
/> 

</div>
</div>
    </Rnd>
    
  )
};
 const Handle = () => (
                <div className="z-30 h-4 w-4 bg-white border-blue-500" />
            );

export default DeviceFrame;