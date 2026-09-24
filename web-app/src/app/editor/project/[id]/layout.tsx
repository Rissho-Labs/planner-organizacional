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

export default function EditorLayout({
  children,
  params,
}: EditorLayoutProps) {
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [projectName, setProjectName] = useState("Meu Novo Projeto");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
    <div 
      className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100 select-none"
      data-project-id={params.id}
    >
      {/* 1. TOPBAR (Barra Superior Compacta) */}
      <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-30 shrink-0">
        
        {/* Lado Esquerdo: Botão Voltar + Botão Alternar Sidebar + Título do Projeto */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link
            href="/"
            aria-label="Voltar para a página inicial"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* Botão de Alternância da Sidebar visível na Topbar */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={isSidebarOpen ? "Recolher barra lateral" : "Expandir barra lateral"}
            title={isSidebarOpen ? "Recolher barra lateral" : "Expandir barra lateral"}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="h-5 w-px bg-gray-200" />

          {/* Título do Projeto */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="text-sm font-semibold text-gray-800 bg-transparent hover:bg-gray-50 focus:bg-white px-2 py-1 rounded-md border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none max-w-[140px] sm:max-w-[240px] truncate"
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
            <span className="hidden sm:inline">Compartilhar</span>
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

      {/* 2. ÁREA DE TRABALHO: Toolbar Lateral com Transição Suave (Sem Layout Shift) + Mesa de Trabalho */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Toolbar Lateral Esquerda */}
        <aside
          className={`bg-gray-900 text-white flex flex-col justify-between p-3 shrink-0 z-20 border-r border-gray-800 shadow-md overflow-hidden transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          {/* Lista de Ferramentas com layout de linha unificado */}
          <div className="space-y-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;

              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setActiveTool(tool.id)}
                  title={tool.label}
                  className={`w-full h-12 flex items-center px-3 rounded-xl transition-colors duration-150 relative group overflow-hidden ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/80"
                  }`}
                >
                  {/* Container fixo do ícone (sempre centralizado na versão recolhida) */}
                  <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>

                  {/* 
                    Container de Texto:
                    1. Sempre presente no DOM (sem renderização condicional)
                    2. whitespace-nowrap impede quebra de linha
                    3. Transição de opacidade e leve deslocamento horizontal suave
                  */}
                  <div
                    className={`flex flex-col ml-3 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                      isSidebarOpen
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

                  {/* Indicador sutil de seleção lateral */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-400 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Botão de Alternância no Rodapé da Sidebar (ChevronLeft / ChevronRight) */}
          <div className="pt-2 border-t border-gray-800/80">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label={isSidebarOpen ? "Recolher barra lateral" : "Expandir barra lateral"}
              title={isSidebarOpen ? "Recolher barra lateral" : "Expandir barra lateral"}
              className="w-full h-11 flex items-center px-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors overflow-hidden group"
            >
              <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                {isSidebarOpen ? (
                  <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                )}
              </div>

              {/* Texto com transição suave de opacidade e sem renderização condicional */}
              <span
                className={`ml-3 text-xs font-medium text-gray-300 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isSidebarOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 pointer-events-none"
                }`}
              >
                Recolher painel
              </span>
            </button>
          </div>
        </aside>

        {/* Mesa de Trabalho Infinita: Ajusta-se suavemente ao espaço restante */}
        <main className="flex-1 min-w-0 flex overflow-hidden relative bg-gray-100 transition-all duration-300">
          {children}
        </main>

      </div>
    </div>
  );
}
