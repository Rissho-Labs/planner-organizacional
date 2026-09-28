// src/contexts/EditorContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import * as fabric from "fabric";

interface EditorContextProps {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  selectedObject: fabric.Object | null;
  setSelectedObject: (obj: fabric.Object | null) => void;
}

const EditorContext = createContext<EditorContextProps | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  return (
    <EditorContext.Provider value={{ canvas, setCanvas, selectedObject, setSelectedObject }}>
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

export function deleteSelectedObject() {
  const { canvas, selectedObject, setSelectedObject } = useEditor();
  if (canvas && selectedObject) {
    canvas.remove(selectedObject);
    setSelectedObject(null);
    canvas.renderAll();
  }
}

export function duplicateSelectedObject() {
  const { canvas, selectedObject, setSelectedObject } = useEditor();
  if (canvas && selectedObject) {
    selectedObject.clone((cloned: fabric.Object) => {
      cloned.set({
        left: (selectedObject.left ?? 0) + 20,
        top: (selectedObject.top ?? 0) + 20,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      setSelectedObject(cloned);
      canvas.renderAll();
    });
  }
}
