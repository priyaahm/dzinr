"use client";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { CodeIcon, Download, DownloadIcon, GripVertical } from "lucide-react";
import { Spinner } from "../ui/spinner";



type PropsType = {
  title: string;
  isSelected?: boolean;
  disabled?: boolean;
  isDownloading: boolean;
  onOpenHtmlDialog: () => void;
  onDownloadPng?: () => void;
};

const DeviceFrameToolbar = ({
  title,
  isSelected,
  disabled,
  isDownloading,
  onOpenHtmlDialog,
  onDownloadPng,
}: PropsType) => {
  return ( 
  <div className={cn(
    `absolute flex items-center gap-2 rounded-full z-50

    `,
    isSelected ? `left-1/2 -translate-x-1/2 border bg-card 
    dark:bg-muted pl-2 pr-4 py-1 shadow-sm 
     min-w-[260px] h-[35px]
     `
     : "w-[150px h-auto] left-10"
  )}
    style = {{
        top: isSelected ? "-70px" : "-38px",
        transformOrigin: "center top",  
    }}>
        <div className="flex flex-[0.8] cursor-grab items-center
        justify-start gap-1.5 active:cursor-grabbing"
        role="button">
            <GripVertical className="size-4 text-muted-foreground" />

<div
  className={cn(
    "min-w-20 font-medium text-sm mx-px truncate",
    isSelected && "w-[100px]"
  )}
>
  {title}
</div>

        </div>
        {isSelected && (
            <>
             <Separator orientation="vertical" className="h-5! bg-border" />
             <Button
             disabled={disabled}
             size="icon-sm"
             variant="ghost"
             className="rounded-full dark:hover:bg-white/20 
             hover:bg-muted cursor-pointer"
             onClick={onOpenHtmlDialog}>
                <CodeIcon />
             </Button>
             <Button
             disabled={disabled || isDownloading}
             size="icon-sm"
             variant="ghost"
             className="rounded-full dark:hover:bg-white/20 
             hover:bg-muted cursor-pointer"
             onClick={onDownloadPng}>
               {isDownloading ? <Spinner /> : <DownloadIcon /> }  
             </Button>
            </>
        )}
  </div>
  );
};

export default DeviceFrameToolbar;