"use client";

import React, { useState } from "react";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";

interface EditorPageProps {
  params: {
    id: string;
  };
}

export default function EditorPage({ params }: EditorPageProps) {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 25));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div 
      className="w-full h-full flex flex-col relative overflow-hidden"
      data-project-id={params.id}
    >
      {/* Mesa de Trabalho com Prancheta Centralizada */}
      <div className="flex-1 w-full h-full flex items-center justify-center p-8 sm:p-12 overflow-auto relative bg-gray-100">
        
        {/* Palco / Prancheta em Branco (800x600 px) */}
        <div
          id={`editor-artboard-${params.id}`}
          style={{ transform: `scale(${zoomLevel / 100})` }}
          className="w-[800px] h-[600px] bg-white shadow-xl rounded-sm border border-gray-200/80 relative transition-transform duration-100 origin-center flex flex-col shrink-0"
        >
          {/* 
            ÁREA DA PRANCHETA (CANVAS READY):
            Esta div estática representa o palco em branco pronto para a inserção da tag <canvas>
          */}
          <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
            {/* Marcador sutil de dimensões de prancheta */}
            <div className="text-center text-gray-300 pointer-events-none select-none">
              <span className="text-xs font-mono tracking-wider">800 × 600 px</span>
            </div>
          </div>

        </div>

      </div>

      {/* Controles de Zoom Flutuantes no Rodapé (Estilo Canva) */}
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
