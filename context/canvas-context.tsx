import { THEME_LIST, ThemeType } from "@/lib/themes";
import { FrameType } from "@/types/project";
import { ReactNode, useCallback, useEffect, useState, createContext, useContext } from "react";


export type LoadingStatusType = "idle" | "running " | "analyzing" | "generating" | "completed";

interface CanvasContextType {
    theme?: ThemeType;
    setTheme: (id: string) => void;
    themes: ThemeType[];

    frames: FrameType[];
    setFrames: (frames: FrameType[]) => void;
    updateFrame: (id: string, data: Partial<FrameType>) => void;
    addFrame: (frame: FrameType) => void;

    selectedFrameId: string | null;
    selectedFrame: FrameType | null;
    setSelectedFrameId: (id: string | null) => void;

    loadingStatus: LoadingStatusType
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({
    children,
    initialFrames,
    initialThemeId,
    hasInitialData,
    projectId,
}
        : { children: ReactNode
            initialFrames: FrameType[];
            initialThemeId?: string;
            hasInitialData: boolean;
            projectId: string | null;
         }) => {
            const [themeId, setThemeId] = useState<string>(
                initialThemeId || THEME_LIST[0].id
            );
            const [frames, setFrames] = useState<FrameType[]>(initialFrames);
            const [selectedFrameId, setSelectedFrameId] = 
            useState<string | null>(null); 
            const [loadingStatus, setLoadingStatus] = 
            useState<LoadingStatusType>(
                hasInitialData ? "idle" : "running ");

            const theme = THEME_LIST.find((t) => t.id === themeId);
            const selectedFrame = selectedFrameId && frames.length !== 0 ? frames.find((f) => f.id === selectedFrameId) || null : null;


            // Update the LoadingState Ingest Realtime event 


            const addFrame = useCallback((frame: FrameType) => {
                setFrames((prev) => [...prev, frame]);
            }, []);

            const updateFrame = useCallback((id: string, data: Partial<FrameType>) => {
                setFrames((prev) => {
                   return prev.map((frame) => (frame.id === id ? { ...frame, ...data } : frame))});
            }, []);

            return (
                <CanvasContext.Provider
                value={{
                    theme, 
                    setTheme: setThemeId,
                    themes: THEME_LIST,
                    frames,
                    setFrames,
                    selectedFrameId,
                    selectedFrame,
                    setSelectedFrameId,
                    addFrame,
                    updateFrame,
                    loadingStatus, 
                }}
                >
                {children}
                </CanvasContext.Provider>
            );
        };

        export const useCanvas = () => {
            const context = useContext(CanvasContext);
            if (!context) {
                throw new Error("useCanvas must be used within a CanvasProvider");
            }
            return context;
        };