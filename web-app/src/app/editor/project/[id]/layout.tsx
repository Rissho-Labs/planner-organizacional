"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Download,
  MousePointer2,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Cloud
} from "lucide-react";

interface EditorLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

type ToolType = "select" | "text" | "image" | "square" | "circle";

export default function EditorLayout({
  children,
  params,
}: EditorLayoutProps) {
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [projectName, setProjectName] = useState("Meu Novo Projeto");

  const tools: { id: ToolType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "select", label: "Selecionar", icon: MousePointer2 },
    { id: "text", label: "Texto", icon: Type },
    { id: "image", label: "Imagem", icon: ImageIcon },
    { id: "square", label: "Quadrado", icon: Square },
    { id: "circle", label: "Círculo", icon: Circle },
  ];

  return (
    <div 
      className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100 select-none"
      data-project-id={params.id}
    >
      {/* 1. TOPBAR (Barra Superior Compacta) */}
      <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-30 shrink-0">
        
        {/* Lado Esquerdo: Botão Voltar + Título do Projeto */}
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            aria-label="Voltar para a página inicial"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="h-5 w-px bg-gray-200" />

          {/* Título do Projeto (Mock com sensação de edição Canva) */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="text-sm font-semibold text-gray-800 bg-transparent hover:bg-gray-50 focus:bg-white px-2 py-1 rounded-md border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
              title={`Projeto #${params.id} - Clique para renomear`}
            />
            <span className="flex items-center text-[11px] text-gray-400 font-medium hidden sm:flex">
              <Cloud className="w-3.5 h-3.5 mr-1 text-emerald-500 inline" /> Salvo
            </span>
          </div>
        </div>

        {/* Lado Direito: Ações Rápidas (Compartilhar e Exportar) */}
        <div className="flex items-center space-x-2">
          {/* Botão Compartilhar */}
          <button
            type="button"
            onClick={() => alert("Link de compartilhamento copiado!")}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-500" />
            <span>Compartilhar</span>
          </button>

          {/* Botão Exportar */}
          <button
            type="button"
            onClick={() => alert("Preparando exportação do projeto...")}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Exportar</span>
          </button>
        </div>

      </header>

      {/* 2. ÁREA DE TRABALHO: Toolbar Lateral + Mesa de Trabalho (Children) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Toolbar Lateral Esquerda (Design Escuro / Alto Destaque) */}
        <aside className="w-18 bg-gray-900 text-white flex flex-col items-center py-4 px-2 space-y-3 shrink-0 z-20 border-r border-gray-800 shadow-md">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;

            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setActiveTool(tool.id)}
                title={tool.label}
                className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-150 relative group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5 mb-1 transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-medium leading-none tracking-tight">
                  {tool.label}
                </span>

                {/* Indicador sutil de seleção */}
                {isActive && (
                  <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-400 rounded-r-full" />
                )}
              </button>
            );
          })}
        </aside>

        {/* Mesa de Trabalho Infinita (Children) */}
        <main className="flex-1 flex overflow-hidden relative bg-gray-100">
          {children}
        </main>

      </div>
    </div>
  );
}
