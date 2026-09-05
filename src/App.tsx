import React, { useState, useEffect, useMemo } from 'react';
import { Student, StudentLevel, StudentGoal, Workout, DietPlan } from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { StudentCard } from './components/StudentCard';
import { StudentModal } from './components/StudentModal';
import { StudentProfile } from './components/StudentProfile';
import { Search, UserPlus, Filter, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'workouts' | 'diet'>('overview');
  
  // Modais e edição
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Filtros de busca
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<StudentLevel | 'Todos'>('Todos');
  const [goalFilter, setGoalFilter] = useState<StudentGoal | 'Todos'>('Todos');

  // Notificações / Toasts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Carregar dados na inicialização
  const refreshData = () => {
    const list = storageService.getStudents();
    setStudents([...list]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const selectedStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  // Alunos filtrados por busca, nível e objetivo
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.goal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.phone && s.phone.includes(searchTerm)) ||
        (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchLevel = levelFilter === 'Todos' || s.level === levelFilter;
      const matchGoal = goalFilter === 'Todos' || s.goal === goalFilter;

      return matchSearch && matchLevel && matchGoal;
    });
  }, [students, searchTerm, levelFilter, goalFilter]);

  // Contadores globais
  const allWorkouts = useMemo(() => {
    return students.flatMap((s) => storageService.getWorkoutsByStudent(s.id));
  }, [students]);

  const allDietsCount = useMemo(() => {
    return students.filter((s) => !!storageService.getDietByStudent(s.id)).length;
  }, [students]);

  // Handlers para Aluno
  const handleOpenNewStudent = () => {
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (
    studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    const saved = storageService.saveStudent(studentData);
    refreshData();
    setIsStudentModalOpen(false);
    showToast(
      studentData.id
        ? `Cadastro de ${saved.name} atualizado com sucesso!`
        : `Aluno ${saved.name} cadastrado com sucesso!`
    );
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o aluno "${name}" e todos os seus treinos e dietas?`)) {
      storageService.deleteStudent(id);
      if (selectedStudentId === id) {
        setSelectedStudentId(null);
      }
      refreshData();
      showToast(`Aluno "${name}" excluído.`, 'info');
    }
  };

  const handleSelectStudent = (
    student: Student,
    defaultTab: 'overview' | 'workouts' | 'diet' = 'overview'
  ) => {
    setSelectedStudentId(student.id);
    setProfileTab(defaultTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers para Treinos
  const handleSaveWorkout = (
    workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    storageService.saveWorkout(workout);
    refreshData();
    showToast('Treino salvo com sucesso!');
  };

  const handleDeleteWorkout = (workoutId: string) => {
    storageService.deleteWorkout(workoutId);
    refreshData();
    showToast('Treino excluído com sucesso.', 'info');
  };

  // Handlers para Dietas
  const handleSaveDiet = (
    diet: Omit<DietPlan, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    storageService.saveDiet(diet);
    refreshData();
    showToast('Plano nutricional atualizado!');
  };

  const handleDeleteDiet = (studentId: string) => {
    storageService.deleteDiet(studentId);
    refreshData();
    showToast('Dieta excluída com sucesso.', 'info');
  };

  // Handlers de dados mockados (Reset / Backup)
  const handleResetData = () => {
    if (confirm('Deseja restaurar a base de dados para o padrão de demonstração? Seus novos registros serão substituídos pelos exemplos.')) {
      storageService.resetToDefault();
      setSelectedStudentId(null);
      refreshData();
      showToast('Dados de demonstração restaurados!', 'success');
    }
  };

  const handleExportData = () => {
    const jsonStr = storageService.exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitmanage_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado com sucesso!');
  };

  const handleImportData = (jsonString: string) => {
    const success = storageService.importDatabaseJson(jsonString);
    if (success) {
      setSelectedStudentId(null);
      refreshData();
      showToast('Dados restaurados com sucesso a partir do arquivo!', 'success');
    } else {
      showToast('Falha ao importar: arquivo JSON inválido ou incompatível.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/95 border-rose-500/40 text-rose-200'
                : 'bg-slate-900/95 border-slate-700 text-slate-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Barra de Navegação Superior */}
      <Navbar
        onNewStudent={handleOpenNewStudent}
        onGoHome={() => setSelectedStudentId(null)}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedStudent ? (
          /* Visualização da Ficha Completa do Aluno */
          <StudentProfile
            student={selectedStudent}
            workouts={storageService.getWorkoutsByStudent(selectedStudent.id)}
            dietPlan={storageService.getDietByStudent(selectedStudent.id)}
            initialTab={profileTab}
            onBack={() => setSelectedStudentId(null)}
            onEditStudent={handleOpenEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onSaveWorkout={handleSaveWorkout}
            onDeleteWorkout={handleDeleteWorkout}
            onSaveDiet={handleSaveDiet}
            onDeleteDiet={handleDeleteDiet}
          />
        ) : (
          /* Tela Inicial / Dashboard de Alunos */
          <div className="space-y-6">
            {/* Banner de Boas-Vindas */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 p-6 sm:p-8">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Painel do Instrutor • Acesso Direto</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Gestão Inteligente de Alunos & Prescrições
                </h1>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Cadastre novos alunos com dados biométricos, calcule automaticamente o IMC e estruture fichas personalizadas de treinos e dietas.
                </p>
              </div>
            </div>

            {/* Cards de Métricas */}
            <DashboardStats
              students={students}
              totalWorkouts={allWorkouts.length}
              totalDiets={allDietsCount}
              selectedLevelFilter={levelFilter}
              onSelectLevelFilter={setLevelFilter}
            />

            {/* Barra de Busca e Filtros */}
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Campo de Busca */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome, objetivo ou contato..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Filtros por Nível e Objetivo */}
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filtrar:</span>
                </div>

                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value as StudentLevel | 'Todos')}
                  className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Todos">Todos os Níveis</option>
                  <option value="Iniciante">Iniciantes</option>
                  <option value="Intermediário">Intermediários</option>
                  <option value="Avançado">Avançados</option>
                </select>

                <select
                  value={goalFilter}
                  onChange={(e) => setGoalFilter(e.target.value as StudentGoal | 'Todos')}
                  className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Todos">Todos os Objetivos</option>
                  <option value="Hipertrofia">Hipertrofia</option>
                  <option value="Emagrecimento">Emagrecimento</option>
                  <option value="Definição Muscular">Definição Muscular</option>
                  <option value="Ganho de Força">Ganho de Força</option>
                  <option value="Condicionamento Físico">Condicionamento Físico</option>
                  <option value="Saúde & Longevidade">Saúde & Longevidade</option>
                  <option value="Reabilitação Postural">Reabilitação Postural</option>
                </select>

                {(searchTerm || levelFilter !== 'Todos' || goalFilter !== 'Todos') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setLevelFilter('Todos');
                      setGoalFilter('Todos');
                    }}
                    className="text-xs text-emerald-400 hover:underline px-2 whitespace-nowrap"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {/* Listagem de Alunos em Grade */}
            {filteredStudents.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                <p className="text-base font-semibold text-slate-300">Nenhum aluno encontrado</p>
                <p className="text-xs text-slate-500 mt-1">
                  Tente alterar os termos da busca ou cadastre um novo aluno.
                </p>
                <button
                  onClick={handleOpenNewStudent}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-950"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Cadastrar Aluno</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStudents.map((student) => {
                  const studentWorkouts = storageService.getWorkoutsByStudent(student.id);
                  const hasDiet = !!storageService.getDietByStudent(student.id);
                  return (
                    <StudentCard
                      key={student.id}
                      student={student}
                      workoutCount={studentWorkouts.length}
                      hasDiet={hasDiet}
                      onSelect={handleSelectStudent}
                      onEdit={handleOpenEditStudent}
                      onDelete={handleDeleteStudent}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Aluno (Cadastrar / Editar) */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        initialStudent={editingStudent}
      />

      {/* Rodapé do Sistema */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>FitManage • Sistema de Gestão de Academia (Treinos & Dietas)</span>
          <span className="text-slate-400">Banco de Dados Mockado Persistente (LocalStorage)</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
