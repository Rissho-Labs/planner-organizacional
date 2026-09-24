"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProject, updateProjectTitle } from "../../../../lib/projects";
import { EditorProvider, useEditor } from "../../../../contexts/EditorContext";
import * as fabric from 'fabric'; // Importação do Fabric para usar na Toolbar
import {
  ArrowLeft,
  Share2,
  Download,
  MousePointer2,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Cloud,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";

interface EditorLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

type ToolType = "select" | "text" | "image" | "square" | "circle";

// EXTRAÍMOS A SIDEBAR PARA UM COMPONENTE FILHO PARA PODER CONSUMIR O CONTEXTO
function EditorSidebar() {
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { canvas } = useEditor();

  const tools: {
    id: ToolType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
      { id: "select", label: "Selecionar", description: "Mover e transformar objetos", icon: MousePointer2 },
      { id: "text", label: "Texto", description: "Títulos e caixas de texto", icon: Type },
      { id: "image", label: "Imagem", description: "Uploads e fotos", icon: ImageIcon },
      { id: "square", label: "Quadrado", description: "Retângulos e cartões", icon: Square },
      { id: "circle", label: "Círculo", description: "Círculos e elipses", icon: Circle },
    ];

  const handleToolClick = (toolId: ToolType) => {
    setActiveTool(toolId);

    if (toolId === "square" && canvas) {
      const rect = new fabric.Rect({
        width: 100,
        height: 100,
        fill: "#3b82f6",
        left: 100,
        top: 100,
        cornerStyle: "circle",
      });
      canvas.add(rect);
      canvas.renderAll();
    }
  };

  return (
    <aside
      className={`bg-gray-900 text-white flex flex-col justify-between p-3 shrink-0 z-20 border-r border-gray-800 shadow-md overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64" : "w-20"
        }`}
    >
      <div className="space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => handleToolClick(tool.id)}
              title={tool.label}
              className={`w-full h-12 flex items-center px-3 rounded-xl transition-colors duration-150 relative group overflow-hidden ${isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/80"
                }`}
            >
              <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              </div>
              <div
                className={`flex flex-col ml-3 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${isSidebarOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2 pointer-events-none"
                  }`}
              >
                <span className="text-sm font-medium leading-tight text-white">
                  {tool.label}
                </span>
                <span className="text-[11px] text-gray-400 mt-0.5">
                  {tool.description}
                </span>
              </div>
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-400 rounded-r-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-gray-800/80">
        <button
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="w-full h-11 flex items-center px-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors overflow-hidden group"
        >
          <div className="w-8 h-8 shrink-0 flex items-center justify-center">
            {isSidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            )}
          </div>
          <span
            className={`ml-3 text-xs font-medium text-gray-300 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 pointer-events-none"
              }`}
          >
            Recolher painel
          </span>
        </button>
      </div>
    </aside>
  );
}

// COMPONENTE PRINCIPAL
export default function EditorLayout({ children }: EditorLayoutProps) {
  const params = useParams() as { id: string };
  const [title, setTitle] = useState("Meu Novo Projeto");
  const [saveStatus, setSaveStatus] = useState("Salvo");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (params.id) {
      // Adicionamos a tipagem "any" (ou flexível) para o TypeScript aceitar os campos do Firebase
      getProject(params.id).then((project: any) => {
        if (project && project.title) {
          setTitle(project.title);
        }
      }).catch((error) => {
        console.error("Erro ao carregar o projeto:", error);
      });
    }
  }, [params.id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSaveStatus("Salvando...");

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        await updateProjectTitle(params.id, newTitle);
        setSaveStatus("Salvo");
      } catch (error) {
        setSaveStatus("Erro");
      }
    }, 1000);
  };

  return (
    <EditorProvider>
      <div
        className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100 select-none"
        data-project-id={params.id}
      >
        {/* TOPBAR */}
        <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="text-sm font-semibold text-gray-800 bg-transparent hover:bg-gray-50 focus:bg-white px-2 py-1 rounded-md border border-transparent hover:border-gray-200 focus:border-indigo-500 transition-all outline-none max-w-[140px] sm:max-w-[240px] truncate"
              />
              <span className={`flex items-center text-[11px] font-medium hidden sm:flex ${saveStatus === 'Erro' ? 'text-red-500' : 'text-gray-400'}`}>
                <Cloud className={`w-3.5 h-3.5 mr-1 inline ${saveStatus === 'Salvo' ? 'text-emerald-500' : 'text-gray-400'}`} /> {saveStatus}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg">
              <Share2 className="w-4 h-4 text-gray-500" />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
            <button className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">
              <Download className="w-4 h-4 text-white" />
              <span>Exportar</span>
            </button>
          </div>
        </header>

        {/* ÁREA DE TRABALHO */}
        <div className="flex flex-1 overflow-hidden relative">
          <EditorSidebar />
          <main className="flex-1 min-w-0 flex overflow-hidden relative bg-gray-100">
            {children}
          </main>
        </div>
      </div>
    </EditorProvider>
  );
}