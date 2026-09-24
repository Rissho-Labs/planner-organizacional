"use client";

import { useState } from "react";
import { 
  Home, 
  LayoutTemplate, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Plus, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";
import CreateProjectModal from "@/components/CreateProjectModal";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: "Início", icon: Home, active: true },
    { label: "Templates", icon: LayoutTemplate, active: false },
    { label: "Meu Time", icon: Users, active: false },
    { label: "Amigos", icon: Users, active: false },
  ];

  const bottomItems = [
    { label: "Configurações", icon: Settings, isDanger: false },
    { label: "Sair", icon: LogOut, isDanger: true },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden select-none">
      
      {/* Sidebar Esquerda (Colapsável com Transição Suave) */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 z-20 shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div>
          {/* Header do Logo Planner (Padding rigorosamente padronizado com os itens de navegação) */}
          <div className="h-16 flex items-center px-3 border-b border-gray-100 overflow-hidden shrink-0">
            <div className="flex items-center w-full px-3">
              {/* Caixa do Logo "P" com dimensões fixas (32x32px), perfeitamente centrada no eixo dos ícones */}
              <div className="w-8 h-8 shrink-0 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg leading-none">P</span>
              </div>
              
              {/* Texto do Logo mantido no DOM com fade suave */}
              <span
                className={`ml-3 font-bold text-xl tracking-tight text-gray-900 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isSidebarOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 pointer-events-none"
                }`}
              >
                Planner
              </span>
            </div>
          </div>
          
          {/* Links de Navegação */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href="#"
                  title={item.label}
                  className={`w-full h-11 flex items-center px-3 rounded-xl transition-colors duration-150 relative group overflow-hidden ${
                    item.active
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {/* Container fixo do ícone (sempre centralizado no modo recolhido) */}
                  <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>

                  {/* Texto do menu com retenção no DOM e transição de opacidade */}
                  <span
                    className={`ml-3 text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                      isSidebarOpen
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2 pointer-events-none"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Indicador sutil de item ativo */}
                  {item.active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 rounded-r-full" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar: Configurações, Sair e Botão de Alternância */}
        <div>
          <div className="p-3 space-y-1.5 border-t border-gray-100">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href="#"
                  title={item.label}
                  className={`w-full h-10 flex items-center px-3 rounded-xl transition-colors duration-150 relative group overflow-hidden ${
                    item.isDanger
                      ? "text-gray-600 hover:bg-red-50 hover:text-red-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>

                  <span
                    className={`ml-3 text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                      isSidebarOpen
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2 pointer-events-none"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Botão de Alternância da Sidebar no Rodapé */}
          <div className="p-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label={isSidebarOpen ? "Recolher menu lateral" : "Expandir menu lateral"}
              title={isSidebarOpen ? "Recolher menu lateral" : "Expandir menu lateral"}
              className="w-full h-10 flex items-center px-3 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors overflow-hidden group"
            >
              <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                {isSidebarOpen ? (
                  <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-800 transition-colors" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-800 transition-colors" />
                )}
              </div>

              <span
                className={`ml-3 text-xs font-medium text-gray-600 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isSidebarOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 pointer-events-none"
                }`}
              >
                Recolher menu
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Área Principal (Expande/Contrai automaticamente com preenchimento total) */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
        
        {/* Topbar com Busca e Botão de Alternância da Sidebar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-8 shrink-0">
          <div className="flex items-center w-full max-w-2xl">
            {/* Botão de Menu para alternar a Sidebar pela Topbar */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label={isSidebarOpen ? "Recolher menu lateral" : "Expandir menu lateral"}
              title={isSidebarOpen ? "Recolher menu lateral" : "Expandir menu lateral"}
              className="p-2 mr-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Pesquisar templates ou projetos..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center ml-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0">
              {/* Avatar Placeholder */}
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Chief" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Bem-vindo de volta, Chief</h1>

          {/* Filtros */}
          <div className="flex space-x-3 mb-8 overflow-x-auto pb-1">
            {['Social', 'Corporativo', 'Religioso', 'Caridade'].map((filter) => (
              <button key={filter} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors whitespace-nowrap">
                {filter}
              </button>
            ))}
          </div>

          {/* Grid de Projetos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* Card: Criar Novo Projeto */}
            <div 
              onClick={() => setIsModalOpen(true)}
              className="group cursor-pointer flex flex-col items-center justify-center h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-medium">Criar Novo Projeto</span>
            </div>

            {/* Card Mockup 1 */}
            <div className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden flex flex-col">
              <div className="h-32 bg-gray-800 relative">
                {/* Imagem de Capa Placeholder */}
                <div className="absolute top-2 right-2 p-1 bg-white/10 hover:bg-white/30 rounded-md backdrop-blur-sm transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-semibold text-gray-900">Retiro de Jovens 2026</h3>
                <p className="text-xs text-gray-500 mt-1">Editado há 2 horas</p>
              </div>
            </div>

            {/* Card Mockup 2 */}
            <div className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden flex flex-col">
              <div className="h-32 bg-orange-100 relative">
                <div className="absolute top-2 right-2 p-1 bg-black/5 hover:bg-black/10 rounded-md transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-semibold text-gray-900">Festa de Halloween</h3>
                <p className="text-xs text-gray-500 mt-1">Editado ontem</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Modal de Criação de Projetos */}
      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}