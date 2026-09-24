"use client";

import React, { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { useEditor } from "../../../../contexts/EditorContext";
import * as fabric from 'fabric';


interface EditorPageProps {
  params: {
    id: string;
  };
}

export default function EditorPage({ params }: EditorPageProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const canvasInstance = useRef<fabric.Canvas | null>(null);

  const { setCanvas } = useEditor();

  useEffect(() => {
    // Configurações globais dos objetos no Fabric
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = '#ffffff';
    fabric.Object.prototype.cornerStrokeColor = '#8b5cf6';
    fabric.Object.prototype.cornerSize = 10;

    // Move o ícone de rotação para baixo
    if (fabric.Object.prototype.controls && fabric.Object.prototype.controls.mtr) {
      fabric.Object.prototype.controls.mtr.y = 0.5;
      fabric.Object.prototype.controls.mtr.offsetY = 35;
    }

    // Inicializa o Fabric canvas
    const canvas = new fabric.Canvas('canvas-element', {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
    });

    canvasInstance.current = canvas;
    setCanvas(canvas);

    // Aplica a sombra imediatamente após a criação do canvas
    if (canvasInstance.current.wrapperEl) {
      canvasInstance.current.wrapperEl.classList.add("shadow-2xl");
    }

    return () => {
      canvasInstance.current?.dispose();
      setCanvas(null);
      canvasInstance.current = null;
    };
  }, [setCanvas]);

  const handleZoomIn = (): void => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  };
  const handleZoomOut = (): void => {
    setZoomLevel((prev) => Math.max(prev - 10, 25));
  };
  const handleResetZoom = (): void => {
    setZoomLevel(100);
  };

  return (
    <div
      className="w-full h-full flex flex-col relative overflow-hidden"
      data-project-id={params.id}
    >
      {/* Mesa de Trabalho com Prancheta Centralizada */}
      <div className="flex items-center justify-center overflow-auto w-full h-full p-8 bg-gray-100">
        <canvas id="canvas-element" />
      </div>

      {/* Controles de Zoom Flutuantes no Rodapé */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center bg-white/95 backdrop-blur-sm border border-gray-200 shadow-md rounded-lg px-2 py-1 space-x-1.5 text-xs text-gray-600">
        <button
          type="button"
          onClick={handleZoomOut}
          title="Diminuir Zoom"
          className="p-1 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleResetZoom}
          title="Restaurar 100%"
          className="px-1.5 py-0.5 font-mono text-[11px] hover:text-indigo-600 rounded transition-colors"
        >
          {zoomLevel}%
        </button>

        <button
          type="button"
          onClick={handleZoomIn}
          title="Aumentar Zoom"
          className="p-1 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="h-3 w-px bg-gray-200 mx-0.5" />

        <button
          type="button"
          onClick={handleResetZoom}
          title="Ajustar à tela"
          className="p-1 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}