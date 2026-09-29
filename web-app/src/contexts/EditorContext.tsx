// src/contexts/EditorContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import * as fabric from "fabric";

interface EditorContextProps {
  // Canvas instance
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  // Currently selected object on the canvas
  selectedObject: fabric.Object | null;
  setSelectedObject: (obj: fabric.Object | null) => void;
  // Styling helpers
  changeFillColor: (color: string) => void;
  changeStrokeColor: (color: string) => void;
  changeStrokeWidth: (width: number) => void;
  changeOpacity: (opacity: number) => void;
  // Text tool and typography
  addText: (text?: string) => void;
  changeFontFamily: (font: string) => void;
  changeFontSize: (size: number) => void;
  changeFontWeight: (weight: string) => void;
  changeFontStyle: (style: string) => void;
  changeTextAlign: (align: string) => void;
  // Image upload
  addImageFromUrl: (url: string) => void;
  // Export functions
  exportAsImage: (format: 'png' | 'jpeg', quality?: number) => void;
  exportAsJson: () => void;
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
    <EditorContext.Provider value={{
        canvas,
        setCanvas,
        selectedObject,
        setSelectedObject,
        changeFillColor: (color: string) => {
          if (canvas && selectedObject) {
            selectedObject.set('fill', color);
            canvas.renderAll();
          }
        },
        changeStrokeColor: (color: string) => {
          if (canvas && selectedObject) {
            selectedObject.set('stroke', color);
            canvas.renderAll();
          }
        },
        changeStrokeWidth: (width: number) => {
          if (canvas && selectedObject) {
            selectedObject.set('strokeWidth', width);
            canvas.renderAll();
          }
        },
        changeOpacity: (opacity: number) => {
          if (canvas && selectedObject) {
            selectedObject.set('opacity', opacity);
            canvas.renderAll();
          }
        },
        // Text tool
        addText: (text = "Clique duas vezes para editar") => {
          if (!canvas) return;
          const iText = new fabric.IText(text, {
            left: 100,
            top: 100,
            fontSize: 24,
            fontFamily: "sans-serif",
            fill: "#000000",
          });
          canvas.add(iText);
          canvas.setActiveObject(iText);
          setSelectedObject(iText);
          canvas.requestRenderAll();
        },
        // Typography helpers
        changeFontFamily: (font: string) => {
          const obj = canvas?.getActiveObject();
          if (obj && (obj.type === "i-text" || obj.type === "textbox")) {
            (obj as any).set('fontFamily', font);
            canvas?.requestRenderAll();
          }
        },
        changeFontSize: (size: number) => {
          const obj = canvas?.getActiveObject();
          if (obj && (obj.type === "i-text" || obj.type === "textbox")) {
            (obj as any).set('fontSize', size);
            canvas?.requestRenderAll();
          }
        },
        changeFontWeight: (weight: string) => {
          const obj = canvas?.getActiveObject();
          if (obj && (obj.type === "i-text" || obj.type === "textbox")) {
            (obj as any).set('fontWeight', weight);
            canvas?.requestRenderAll();
          }
        },
        changeFontStyle: (style: string) => {
          const obj = canvas?.getActiveObject();
          if (obj && (obj.type === "i-text" || obj.type === "textbox")) {
            (obj as any).set('fontStyle', style);
            canvas?.requestRenderAll();
          }
        },
        changeTextAlign: (align: string) => {
          const obj = canvas?.getActiveObject();
          if (obj && (obj.type === "i-text" || obj.type === "textbox")) {
            (obj as any).set('textAlign', align);
            canvas?.requestRenderAll();
          }
        },
        addImageFromUrl: (url: string) => {
          if (!canvas) return;
          fabric.Image.fromURL(url, (img) => {
            if (!img) return;
            const maxW = canvas.width! * 0.5;
            const maxH = canvas.height! * 0.5;
            if (img.width && img.height) {
              const scale = Math.min(maxW / img.width, maxH / img.height, 1);
              img.set({ scaleX: scale, scaleY: scale });
            }
            canvas.centerObject(img);
            canvas.add(img);
            canvas.setActiveObject(img);
            setSelectedObject(img);
            canvas.requestRenderAll();
          });
        },
        exportAsImage: (format, quality) => {
          if (!canvas) return;
          const dataUrl = canvas.toDataURL({ format, multiplier: 2, quality: quality ?? 1 });
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `artboard.${format}`;
          link.click();
        },
        exportAsJson: () => {
          if (!canvas) return;
          const json = JSON.stringify(canvas.toJSON());
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'artboard.json';
          link.click();
          URL.revokeObjectURL(url);
        },
      }}>
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
