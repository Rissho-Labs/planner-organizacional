"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "../lib/projects";
import {
  X,
  Search,
  SlidersHorizontal,
  Upload,
  FileText,
  Presentation,
  Infinity as InfinityIcon,
  Sparkles,
  LayoutDashboard,
  Calendar,
  Share2,
  Workflow,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";

export interface FormatOption {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
  dimensions?: string;
}

export interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFormat?: (format: FormatOption) => void;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: "infinite-canvas",
    title: "Canvas Infinito",
    description: "Espaço ilimitado e livre para ideação e diagramação",
    category: "Geral",
    icon: InfinityIcon,
    color: "from-blue-500 to-indigo-600",
    badge: "Popular",
    dimensions: "Sem limites",
  },
  {
    id: "a4-report",
    title: "Relatório A4",
    description: "Padrão para documentos, impressões oficiais e relatórios",
    category: "Documentos",
    icon: FileText,
    color: "from-emerald-500 to-teal-600",
    badge: "A4",
    dimensions: "210 × 297 mm",
  },
  {
    id: "presentation",
    title: "Apresentação",
    description: "Slides profissionais em formato widescreen 16:9",
    category: "Apresentações",
    icon: Presentation,
    color: "from-amber-500 to-orange-600",
    badge: "16:9",
    dimensions: "1920 × 1080 px",
  },
  {
    id: "whiteboard",
    title: "Quadro Branco",
    description: "Brainstorming colaborativo, post-its e mapas mentais",
    category: "Colaboração",
    icon: LayoutDashboard,
    color: "from-purple-500 to-violet-600",
    dimensions: "Flexível",
  },
  {
    id: "social-post",
    title: "Post para Redes",
    description: "Quadrado perfeito para publicações no feed do Instagram",
    category: "Redes Sociais",
    icon: Share2,
    color: "from-pink-500 to-rose-600",
    badge: "1:1",
    dimensions: "1080 × 1080 px",
  },
  {
    id: "weekly-planner",
    title: "Planejador Semanal",
    description: "Organização de sprints, metas semanais e rotinas",
    category: "Produtividade",
    icon: Calendar,
    color: "from-cyan-500 to-blue-600",
    dimensions: "Organizador",
  },
  {
    id: "workflow-diagram",
    title: "Diagrama de Fluxo",
    description: "Mapeamento visual de processos de negócio e arquitetura",
    category: "Produtividade",
    icon: Workflow,
    color: "from-violet-500 to-fuchsia-600",
    dimensions: "Fluxograma",
  },
  {
    id: "web-banner",
    title: "Banner Digital",
    description: "Headers para websites, newsletters e comunicados",
    category: "Marketing",
    icon: Sparkles,
    color: "from-rose-500 to-red-600",
    dimensions: "1200 × 630 px",
  },
];

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSelectFormat,
}: CreateProjectModalProps) {
  const router = useRouter();

  // Estados locais
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [customWidth, setCustomWidth] = useState("1920");
  const [customHeight, setCustomHeight] = useState("1080");
  const [customUnit, setCustomUnit] = useState<"px" | "mm" | "cm">("px");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fecha com ESC e trava o scroll quando o modal estiver aberto
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  // Limpa estados ao fechar ou reabrir
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ["Todos", "Geral", "Documentos", "Apresentações", "Colaboração", "Produtividade"];

  // Função assíncrona principal de criação e roteamento
  const handleCreate = async (type: string) => {
    if (isLoading) return;

    // Valida se o título foi informado; caso contrário, define título padrão
    const projectTitle = title.trim() ? title.trim() : "Projeto sem título";
    setIsLoading(true);

    try {
      if (onSelectFormat) {
        const selectedFormat = FORMAT_OPTIONS.find((f) => f.title === type);
        if (selectedFormat) {
          onSelectFormat(selectedFormat);
        }
      }

      const projectId = await createProject(projectTitle, type);
      router.push('/editor/project/' + projectId);
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  // Filtros de formato: busca inteligente que preserva os formatos da categoria caso o título digitado seja um nome personalizado
  const searchedFormats = FORMAT_OPTIONS.filter((format) => {
    const searchTerms = title.toLowerCase().trim().split(/\s+/);
    const matchesSearch = searchTerms.some(
      (term) =>
        format.title.toLowerCase().includes(term) ||
        format.description.toLowerCase().includes(term) ||
        (format.dimensions && format.dimensions.toLowerCase().includes(term))
    );

    const matchesCategory =
      selectedCategory === "Todos" || format.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categoryFormats = FORMAT_OPTIONS.filter(
    (format) => selectedCategory === "Todos" || format.category === selectedCategory
  );

  const formatsToDisplay =
    !title.trim() || searchedFormats.length > 0
      ? (title.trim() ? searchedFormats : categoryFormats)
      : categoryFormats;

  const handleCustomSizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    await handleCreate(`Personalizado (${customWidth} × ${customHeight} ${customUnit})`);
  };

  const handleFileImportClick = () => {
    if (isLoading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !isLoading) {
      const importedTitle = file.name.replace(/\.[^/.]+$/, "");
      setTitle(importedTitle);
      await handleCreate("Arquivo Importado");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 transition-all animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[740px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Overlay translúcido de carregamento */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center animate-in fade-in duration-150">
            <div className="flex items-center space-x-3 bg-gray-900 text-white px-6 py-3.5 rounded-xl shadow-2xl border border-gray-800">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
              <span className="text-sm font-medium tracking-tight">Criando seu projeto no Firebase...</span>
            </div>
          </div>
        )}

        {/* Botão de Fechar no topo direito */}
        <button
          onClick={onClose}
          disabled={isLoading}
          aria-label="Fechar modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Input de arquivo invisível */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg,.svg,.json"
          className="hidden"
          disabled={isLoading}
        />

        {/* 1. BARRA LATERAL ESQUERDA ESCURA (ESTILO CANVA) */}
        <aside className="w-full md:w-72 bg-gray-900 text-white p-6 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-gray-800">
          <div>
            {/* Header da Sidebar */}
            <div className="flex items-center space-x-2.5 mb-8">
              <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 id="modal-title" className="text-lg font-bold tracking-tight text-white leading-tight">
                  Criar Design
                </h2>
                <p className="text-xs text-gray-400">Escolha como começar</p>
              </div>
            </div>

            {/* Ações Rápidas da Lateral */}
            <div className="space-y-3">
              {/* Botão: Tamanho Personalizado */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setShowCustomSize((prev) => !prev)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed ${
                  showCustomSize
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                    : "bg-gray-800/80 hover:bg-gray-800 border-gray-700/70 text-gray-200 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                  <span>Tamanho Personalizado</span>
                </div>
                <span className="text-xs text-gray-400">{showCustomSize ? "▲" : "▼"}</span>
              </button>

              {/* Painel Expansível de Dimensões Personalizadas */}
              {showCustomSize && (
                <form
                  onSubmit={handleCustomSizeSubmit}
                  className="bg-gray-800/60 p-3.5 rounded-xl border border-gray-700/60 space-y-3 animate-in fade-in duration-150"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-400 mb-1">
                        Largura
                      </label>
                      <input
                        type="number"
                        min="1"
                        disabled={isLoading}
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-400 mb-1">
                        Altura
                      </label>
                      <input
                        type="number"
                        min="1"
                        disabled={isLoading}
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 mb-1">
                      Unidade
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {(["px", "mm", "cm"] as const).map((unit) => (
                        <button
                          key={unit}
                          type="button"
                          disabled={isLoading}
                          onClick={() => setCustomUnit(unit)}
                          className={`py-1 text-xs rounded font-medium transition-colors disabled:opacity-50 ${
                            customUnit === unit
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-900/80 text-gray-400 hover:text-white"
                          }`}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Criando...</span>
                      </>
                    ) : (
                      <span>Criar novo design</span>
                    )}
                  </button>
                </form>
              )}

              {/* Botão: Importar arquivo */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleFileImportClick}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-800/80 hover:bg-gray-800 border border-gray-700/70 rounded-xl text-sm font-medium text-gray-200 hover:text-white transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>Importar arquivo</span>
              </button>
            </div>
          </div>

          {/* Dica / Card Informativo na base da barra lateral */}
          <div className="pt-4 border-t border-gray-800/80">
            <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/40">
              <p className="text-[11px] font-medium text-indigo-400 mb-1 flex items-center">
                <Check className="w-3 h-3 mr-1 text-indigo-400 inline" /> Dica de Criação
              </p>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Você pode redimensionar qualquer projeto livremente dentro do editor a qualquer momento.
              </p>
            </div>
          </div>
        </aside>

        {/* 2. ÁREA PRINCIPAL (BUSCA/TÍTULO + FORMATOS RÁPIDOS) */}
        <main className="flex-1 flex flex-col min-w-0 bg-white p-6 sm:p-8 overflow-hidden relative">
          
          {/* Campo de Entrada de Título / Busca */}
          <div className="mb-6">
            <label htmlFor="search-formats" className="block text-xl font-bold text-gray-900 mb-2 tracking-tight">
              O que você quer criar?
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Dê um nome ao seu projeto ou filtre os formatos recomendados
            </p>
            <div className="relative">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              ) : (
                <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}
              <input
                id="search-formats"
                type="text"
                placeholder={isLoading ? "Criando projeto..." : "Digite o nome do projeto (ex: Apresentação Q3, Canvas Infinito...)"}
                value={title}
                disabled={isLoading}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all outline-none disabled:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {title && !isLoading && (
                <button
                  type="button"
                  onClick={() => setTitle("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filtros de Categoria em Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                disabled={isLoading}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Feedback amigável caso seja um título personalizado */}
          {title.trim() && formatsToDisplay === categoryFormats && (
            <div className="mb-3 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium flex items-center justify-between animate-in fade-in">
              <span>
                Projeto: <strong className="font-semibold">&quot;{title}&quot;</strong> — Escolha um formato abaixo para criá-lo:
              </span>
            </div>
          )}

          {/* Grid de Opções de Formatos Rápidos */}
          <div className="flex-1 overflow-y-auto pr-1 pb-2">
            {formatsToDisplay.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <Search className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-700">Nenhum formato encontrado</p>
                <p className="text-xs text-gray-400 mt-1">
                  Tente buscar por outro termo ou escolha uma categoria diferente.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formatsToDisplay.map((format) => {
                  const Icon = format.icon;
                  return (
                    <div
                      key={format.id}
                      onClick={() => !isLoading && handleCreate(format.title)}
                      className={`group bg-white rounded-xl border border-gray-200/80 p-4 transition-all duration-200 flex flex-col justify-between relative transform ${
                        isLoading
                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                          : "cursor-pointer hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                      }`}
                    >
                      <div>
                        {/* Topo do card: Ícone estilizado + Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${format.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          {format.badge && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                              {format.badge}
                            </span>
                          )}
                        </div>

                        {/* Título e Descrição */}
                        <h3 className="font-semibold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {format.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {format.description}
                        </p>
                      </div>

                      {/* Rodapé do card: Dimensões e Indicador de ação */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                        <span>{format.dimensions || format.category}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
