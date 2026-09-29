"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Square,
  Type,
  Image as ImageIcon,
  Download,
  Share2,
  ChevronDown,
} from "lucide-react";
import { EditorProvider, useEditor } from "../../../../contexts/EditorContext";

function EditorSidebar() {
  const { addText, addImageFromUrl } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          addImageFromUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <aside className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 gap-6 z-20">
        <button
          onClick={() => {
            /* Handled by Context or Shapes panel */
          }}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition"
          title="Elementos"
        >
          <Square className="w-5 h-5"/>
          <span className="text-[10px]">Formas</span>
        </button>

        <button
          onClick={() => addText()}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition"
          title="Texto"
        >
          <Type className="w-5 h-5"/>
          <span className="text-[10px]">Texto</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition"
          title="Upload de Imagem"
        >
          <ImageIcon className="w-5 h-5"/>
          <span className="text-[10px]">Mídia</span>
        </button>
      </aside>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageUpload}
      />
    </>
  );
}

function EditorHeader() {
  const { exportAsImage, exportAsJson } = useEditor();
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-20">
      <div className="flex items-center gap-4">
        <Link className="text-slate-400 hover:text-white transition" href="/dashboard">
          <ArrowLeft className="w-5 h-5"/>
        </Link>
        <span className="text-sm font-medium text-slate-200">
          Projeto sem título
        </span>
      </div>

      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4"/>
          Exportar
          <ChevronDown className="w-3 h-3"/>
        </button>

        {showExportMenu && (
          <div className="absolute right-0 top-10 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs text-slate-200">
            <button
              onClick={() => { exportAsImage("png"); setShowExportMenu(false); }}
              className="w-full text-left px-4 py-2 hover:bg-slate-700 transition"
            >
              Baixar PNG (Alta qualidade)
            </button>
            <button
              onClick={() => { exportAsImage("jpeg"); setShowExportMenu(false); }}
              className="w-full text-left px-4 py-2 hover:bg-slate-700 transition"
            >
              Baixar JPG
            </button>
            <hr className="border-slate-700 my-1" />
            <button
              onClick={() => { exportAsJson(); setShowExportMenu(false); }}
              className="w-full text-left px-4 py-2 hover:bg-slate-700 transition"
            >
              Exportar Projeto (JSON)
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EditorProvider>
      <div className="h-screen w-screen flex flex-col bg-slate-950 overflow-hidden select-none">
        <EditorHeader/>
        <div className="flex-1 flex overflow-hidden">
          <EditorSidebar/>
          <main className="flex-1 relative bg-slate-900 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </EditorProvider>
  );
}