// src/contexts/EditorContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import * as fabric from "fabric";

interface EditorContextProps {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
}

const EditorContext = createContext<EditorContextProps | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  return (
    <EditorContext.Provider value={{ canvas, setCanvas }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor(): EditorContextProps {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
}
