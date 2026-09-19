import React, { useState, useEffect, useMemo } from 'react';
import { Student, StudentLevel, StudentGoal, Workout, DietPlan } from './types';
import { storageService } from './services/storageService';
import { authService, AuthUser } from './services/authService';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { StudentCard } from './components/StudentCard';
import { StudentModal } from './components/StudentModal';
import { StudentProfile } from './components/StudentProfile';
import { LoginScreen } from './components/LoginScreen';
import { Search, UserPlus, Filter, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  // Estado de Autenticação via Cookie
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'workouts' | 'diet'>('overview');
  const [currentWorkouts, setCurrentWorkouts] = useState<Workout[]>([]);
  const [currentDiet, setCurrentDiet] = useState<DietPlan | undefined>(undefined);
  
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
  const refreshData = async () => {
    try {
      const list = await storageService.getStudents();
      setStudents([...list]);

      // Se houver aluno selecionado, atualiza seus treinos e dieta
      if (selectedStudentId) {
        const [wList, dPlan] = await Promise.all([
          storageService.getWorkoutsByStudent(selectedStudentId),
          storageService.getDietByStudent(selectedStudentId),
        ]);
        setCurrentWorkouts(wList);
        setCurrentDiet(dPlan);
      }
    } catch (err) {
      console.error('Erro ao buscar dados da API:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser, selectedStudentId]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    refreshData();
    showToast(`Bem-vindo ao FitManage, ${user.username}!`, 'success');
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setSelectedStudentId(null);
    showToast('Sessão encerrada com sucesso.', 'info');
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
  const totalWorkoutsCount = useMemo(() => {
    return students.reduce((sum, s) => sum + (s.workoutCount || 0), 0);
  }, [students]);

  const totalDietsCount = useMemo(() => {
    return students.filter((s) => s.hasDiet).length;
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

  const handleSaveStudent = async (
    studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    try {
      const saved = await storageService.saveStudent(studentData);
      await refreshData();
      setIsStudentModalOpen(false);
      showToast(
        studentData.id
          ? `Cadastro de ${saved.name} atualizado!`
          : `Aluno ${saved.name} cadastrado com sucesso!`
      );
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar aluno.', 'error');
    }
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o aluno "${name}" e todos os seus treinos e dietas?`)) {
      try {
        await storageService.deleteStudent(id);
        if (selectedStudentId === id) {
          setSelectedStudentId(null);
        }
        await refreshData();
        showToast(`Aluno "${name}" excluído.`, 'info');
      } catch (err: any) {
        showToast(err.message || 'Erro ao excluir aluno.', 'error');
      }
    }
  };

  const handleSelectStudent = async (
    student: Student,
    defaultTab: 'overview' | 'workouts' | 'diet' = 'overview'
  ) => {
    setSelectedStudentId(student.id);
    setProfileTab(defaultTab);
    try {
      const [wList, dPlan] = await Promise.all([
        storageService.getWorkoutsByStudent(student.id),
        storageService.getDietByStudent(student.id),
      ]);
      setCurrentWorkouts(wList);
      setCurrentDiet(dPlan);
    } catch (err) {
      console.error(err);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers para Treinos
  const handleSaveWorkout = async (
    workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    try {
      await storageService.saveWorkout(workout);
      await refreshData();
      showToast('Treino salvo com sucesso!');
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar treino.', 'error');
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      await storageService.deleteWorkout(workoutId);
      await refreshData();
      showToast('Treino excluído com sucesso.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir treino.', 'error');
    }
  };

  // Handlers para Dietas
  const handleSaveDiet = async (
    diet: Omit<DietPlan, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    try {
      await storageService.saveDiet(diet);
      await refreshData();
      showToast('Plano nutricional atualizado!');
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar dieta.', 'error');
    }
  };

  const handleDeleteDiet = async (studentId: string) => {
    try {
      await storageService.deleteDiet(studentId);
      await refreshData();
      showToast('Dieta excluída com sucesso.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir dieta.', 'error');
    }
  };

  // Handlers de dados mockados (Reset / Backup)
  const handleResetData = async () => {
    if (confirm('Deseja restaurar a base de dados para o padrão de demonstração?')) {
      try {
        await storageService.resetToDefault();
        setSelectedStudentId(null);
        await refreshData();
        showToast('Dados de demonstração restaurados no servidor!', 'success');
      } catch (err: any) {
        showToast(err.message || 'Erro ao restaurar dados.', 'error');
      }
    }
  };

  const handleExportData = async () => {
    try {
      const jsonStr = await storageService.exportDatabaseJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fitmanage_backup_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Backup exportado da API com sucesso!');
    } catch (err: any) {
      showToast(err.message || 'Erro ao exportar dados.', 'error');
    }
  };

  const handleImportData = async (jsonString: string) => {
    try {
      const success = await storageService.importDatabaseJson(jsonString);
      if (success) {
        setSelectedStudentId(null);
        await refreshData();
        showToast('Dados restaurados na API com sucesso!', 'success');
      } else {
        showToast('Falha ao importar: arquivo JSON inválido ou incompatível.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao importar arquivo.', 'error');
    }
  };

  // Se o usuário não estiver autenticado pelo cookie, exibe a tela de login
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

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
        currentUser={currentUser}
        onLogout={handleLogout}
        onNewStudent={handleOpenNewStudent}
        onGoHome={() => setSelectedStudentId(null)}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8">
        {selectedStudent ? (
          /* Visualização da Ficha Completa do Aluno */
          <StudentProfile
            student={selectedStudent}
            workouts={currentWorkouts}
            dietPlan={currentDiet}
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
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 p-5 sm:p-8">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>FitManage Full Stack • Conectado como {currentUser.username}</span>
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Gestão Inteligente de Alunos & Prescrições
                </h1>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Cadastre novos alunos com dados biométricos, calcule automaticamente o IMC e estruture fichas personalizadas de treinos e dietas via API REST.
                </p>
              </div>
            </div>

            {/* Cards de Métricas */}
            <DashboardStats
              students={students}
              totalWorkouts={totalWorkoutsCount}
              totalDiets={totalDietsCount}
              selectedLevelFilter={levelFilter}
              onSelectLevelFilter={setLevelFilter}
            />

            {/* Barra de Busca e Filtros */}
            <div className="bg-slate-900/70 p-3.5 sm:p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
              {/* Campo de Busca */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome, objetivo ou contato..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Filtros por Nível e Objetivo */}
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filtrar:</span>
                </div>

                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value as StudentLevel | 'Todos')}
                  className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 flex-1 sm:flex-initial"
                >
                  <option value="Todos">Todos os Níveis</option>
                  <option value="Iniciante">Iniciantes</option>
                  <option value="Intermediário">Intermediários</option>
                  <option value="Avançado">Avançados</option>
                </select>

                <select
                  value={goalFilter}
                  onChange={(e) => setGoalFilter(e.target.value as StudentGoal | 'Todos')}
                  className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 flex-1 sm:flex-initial"
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
                  return (
                    <StudentCard
                      key={student.id}
                      student={student}
                      workoutCount={student.workoutCount || 0}
                      hasDiet={Boolean(student.hasDiet)}
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
          <span>FitManage Full Stack • API REST Express</span>
          {currentUser?.role === 'dev' ? (
            <a
              href="http://localhost:3001/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline font-medium"
            >
              Documentação Swagger (Acesso Dev Liberado) ↗
            </a>
          ) : (
            <span className="text-slate-500">
              Modo Administrador • Swagger exclusivo para Devs
            </span>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;
