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
  MoreHorizontal 
} from "lucide-react";
import CreateProjectModal from "@/components/CreateProjectModal";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* Sidebar Esquerda */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Planner</span>
          </div>
          
          <nav className="p-4 space-y-1">
            <a href="#" className="flex items-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
              <Home className="w-5 h-5 mr-3" /> Início
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <LayoutTemplate className="w-5 h-5 mr-3" /> Templates
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <Users className="w-5 h-5 mr-3" /> Meu Time
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <Users className="w-5 h-5 mr-3" /> Amigos
            </a>
          </nav>
        </div>

        <div className="p-4 space-y-1 border-t border-gray-100">
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5 mr-3" /> Configurações
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Sair
          </a>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Topbar com Busca */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="relative w-full max-w-2xl">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Pesquisar templates ou projetos..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
            />
          </div>
          <div className="flex items-center ml-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white shadow-sm overflow-hidden">
              {/* Avatar Placeholder */}
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Chief" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto p-8">
          
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Bem-vindo de volta, Chief</h1>

          {/* Filtros */}
          <div className="flex space-x-3 mb-8">
            {['Social', 'Corporativo', 'Religioso', 'Caridade'].map((filter) => (
              <button key={filter} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
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