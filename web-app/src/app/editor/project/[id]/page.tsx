"use client";

import React, { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, Maximize, Lock, Unlock, Copy, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEditor } from "../../../../contexts/EditorContext";
import { getProject, updateProjectCanvas, type CanvasJson } from "../../../../lib/projects";
import { sanitizeCanvasSize } from "../../../../lib/formats";
import * as fabric from "fabric";

const SAVE_DEBOUNCE_MS = 1000;

function serializeCanvas(canvas: fabric.Canvas): CanvasJson {
  return JSON.parse(JSON.stringify(canvas.toJSON())) as CanvasJson;
}

export default function EditorPage() {
  const params = useParams() as { id: string };
  const projectId = params.id;

  const [zoomLevel, setZoomLevel] = useState(100);
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 });
  const [artboard, setArtboard] = useState<{ width: number; height: number; json: CanvasJson | null } | null>(null);

  const canvasInstance = useRef<fabric.Canvas | null>(null);
  const isHydrating = useRef(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Importamos apenas os estados primários do contexto
  const { setCanvas, selectedObject, setSelectedObject } = useEditor();

  useEffect(() => {
    let cancelled = false;
    getProject(projectId).then((project) => {
      if (cancelled) return;
      const size = sanitizeCanvasSize(project?.canvasWidth, project?.canvasHeight);
      const json = project?.canvasJson && typeof project.canvasJson === "object" ? project.canvasJson : null;
      setArtboard({ width: size.width, height: size.height, json });
    }).catch((error) => {
      if (!cancelled) {
        const size = sanitizeCanvasSize(undefined, undefined);
        setArtboard({ width: size.width, height: size.height, json: null });
      }
    });
    return () => { cancelled = true; };
  }, [projectId]);

  useEffect(() => {
    if (!artboard) return;

    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#ffffff";
    fabric.Object.prototype.cornerStrokeColor = "#8b5cf6";
    fabric.Object.prototype.cornerSize = 10;

    if (fabric.Object.prototype.controls && fabric.Object.prototype.controls.mtr) {
      fabric.Object.prototype.controls.mtr.y = 0.5;
      fabric.Object.prototype.controls.mtr.offsetY = 35;
    }

    isHydrating.current = true;
    const canvas = new fabric.Canvas("canvas-element", {
      width: artboard.width,
      height: artboard.height,
      backgroundColor: "#ffffff",
    });

    canvasInstance.current = canvas;
    setCanvas(canvas);

    const updateToolbarPos = (obj: fabric.Object | null) => {
      if (!obj || !canvas.wrapperEl) {
        setToolbarPos({ x: 0, y: 0 });
        return;
      }
      const rect = obj.getBoundingRect();
      const wrapperRect = canvas.wrapperEl.getBoundingClientRect();
      setToolbarPos({
        x: wrapperRect.left + rect.left + rect.width / 2,
        y: wrapperRect.top + rect.top - 15, // Mais espaço entre o botão e o objeto
      });
    };

    canvas.on("selection:created", (e) => {
      const obj = e?.selected?.[0] ?? null;
      setSelectedObject(obj);
      updateToolbarPos(obj);
    });

    canvas.on("selection:updated", (e) => {
      const obj = e?.selected?.[0] ?? null;
      setSelectedObject(obj);
      updateToolbarPos(obj);
    });

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
      setToolbarPos({ x: 0, y: 0 });
    });

    canvas.on("object:moving", (e) => {
      if (e.target === canvas.getActiveObject()) {
        updateToolbarPos(e.target as fabric.Object);
      }
    });

    canvas.on("mouse:wheel", (opt) => {
      const e = opt.e as WheelEvent;
      if (!e.ctrlKey) return;
      e.preventDefault();

      setZoomLevel((prev) => {
        const delta = e.deltaY < 0 ? 10 : -10;
        const newLevel = Math.min(Math.max(prev + delta, 25), 200);
        const zoomFactor = newLevel / 100;
        // Apply zoom to canvas and adjust dimensions based on artboard size
        canvas.setZoom(zoomFactor);
        if (artboard) {
          canvas.setDimensions({ width: artboard.width * zoomFactor, height: artboard.height * zoomFactor });
        }
        canvas.requestRenderAll();
        return newLevel;
      });
    });

    const persistCanvas = () => {
      if (isHydrating.current || !canvasInstance.current) return;
      void updateProjectCanvas(projectId, serializeCanvas(canvasInstance.current), {
        width: canvasInstance.current.getWidth(),
        height: canvasInstance.current.getHeight(),
      });
    };

    const scheduleSave = () => {
      if (isHydrating.current) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(persistCanvas, SAVE_DEBOUNCE_MS);
    };

    canvas.on("object:added", scheduleSave);
    canvas.on("object:modified", scheduleSave);
    canvas.on("object:removed", scheduleSave);

    const hydrate = async () => {
      if (artboard.json) {
        await canvas.loadFromJSON(artboard.json as Record<string, unknown>);
        canvas.requestRenderAll();
      }
      isHydrating.current = false;
    };
    void hydrate();

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      canvas.off(); // Limpa todos os eventos do canvas
      if (!isHydrating.current && canvasInstance.current) persistCanvas();
      canvas.dispose();
      setCanvas(null);
      canvasInstance.current = null;
    };
  }, [artboard, projectId, setCanvas]);

  // Controles Nativos Isolados
  const handleZoom = (newLevel: number) => {
    const canvas = canvasInstance.current;
    if (!canvas || !artboard) return;
    const zoomFactor = newLevel / 100;
    canvas.setZoom(zoomFactor);
    canvas.setDimensions({ width: artboard.width * zoomFactor, height: artboard.height * zoomFactor });
    canvas.requestRenderAll();
    setZoomLevel(newLevel);
  };

  const handleDuplicate = () => {
    const canvas = canvasInstance.current;
    const activeObject = canvas?.getActiveObject();
    if (!canvas || !activeObject) return;

    activeObject.clone().then((cloned: fabric.Object) => {
      canvas.discardActiveObject();
      cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    });
  };

  const handleDelete = () => {
    const canvas = canvasInstance.current;
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      canvas.discardActiveObject();
      activeObjects.forEach((obj) => canvas.remove(obj));
      setSelectedObject(null);
    }
  };

  const handleToggleLock = () => {
    const canvas = canvasInstance.current;
    const activeObject = canvas?.getActiveObject();

    if (!canvas || !activeObject) return;

    const isLocked = !!activeObject.lockMovementX;

    activeObject.set({
      lockMovementX: !isLocked,
      lockMovementY: !isLocked,
      lockScalingX: !isLocked,
      lockScalingY: !isLocked,
      lockRotation: !isLocked,
      hasControls: isLocked, // Oculta as bolinhas de redimensionamento quando bloqueado
    });

    canvas.requestRenderAll();

    // Dispara a re-renderização do React recriando a referência do estado da barra.
    // Isso atualiza o ícone do cadeado na hora sem quebrar a tipagem do Fabric.
    setToolbarPos(prev => ({ ...prev }));
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-gray-100" data-project-id={projectId}>
      {/* Container flexível seguro (evita corte no topo) */}
      <div className="flex-1 overflow-auto flex flex-col items-center justify-start p-12 min-h-full">
        <div className="my-auto shrink-0 shadow-2xl rounded-sm bg-white">
          {artboard ? (
            <canvas id="canvas-element" />
          ) : (
            <div className="w-[800px] h-[600px] flex items-center justify-center text-sm text-gray-400">
              Carregando prancheta...
            </div>
          )}
        </div>
      </div>

      {artboard && (
        <p className="absolute bottom-4 left-4 z-20 text-[11px] font-mono text-gray-400 pointer-events-none">
          {artboard.width} × {artboard.height} px
        </p>
      )}

      {/* Controles de Zoom */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center bg-white/95 backdrop-blur-sm border border-gray-200 shadow-md rounded-lg px-2 py-1 space-x-1.5 text-xs text-gray-600">
        <button type="button" onClick={() => handleZoom(Math.max(zoomLevel - 10, 25))} className="p-1 hover:bg-gray-100 rounded"><ZoomOut className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => handleZoom(100)} className="px-1.5 py-0.5 font-mono text-[11px] hover:text-indigo-600 rounded">{zoomLevel}%</button>
        <button type="button" onClick={() => handleZoom(Math.min(zoomLevel + 10, 200))} className="p-1 hover:bg-gray-100 rounded"><ZoomIn className="w-3.5 h-3.5" /></button>
        <div className="h-3 w-px bg-gray-200 mx-0.5" />
        <button type="button" onClick={() => handleZoom(100)} className="p-1 hover:bg-gray-100 rounded"><Maximize className="w-3.5 h-3.5" /></button>
      </div>

      {/* Barra Flutuante de Ferramentas */}
      {selectedObject && (
        <div
          className="absolute z-30 flex items-center bg-black/80 backdrop-blur-md rounded-lg shadow-xl px-2 py-1.5 space-x-2 transition-opacity duration-150"
          style={{ left: toolbarPos.x, top: toolbarPos.y, transform: "translate(-50%, -100%)" }}
        >
          <button type="button" onClick={handleDuplicate} title="Duplicar" className="p-1.5 hover:bg-white/20 rounded-md transition-colors"><Copy className="w-4 h-4 text-white" /></button>
          <button type="button" onClick={handleToggleLock} title={selectedObject.lockMovementX ? "Desbloquear" : "Bloquear"} className="p-1.5 hover:bg-white/20 rounded-md transition-colors">
            {selectedObject.lockMovementX ? <Lock className="w-4 h-4 text-white" /> : <Unlock className="w-4 h-4 text-white" />}
          </button>
          <div className="w-px h-4 bg-white/20" />
          <button type="button" onClick={handleDelete} title="Excluir" className="p-1.5 hover:bg-red-500/80 hover:text-white rounded-md transition-colors"><Trash2 className="w-4 h-4 text-white" /></button>
        </div>
      )}
    </div>
  );
}