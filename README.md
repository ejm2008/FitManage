# FitManage - Sistema de Gestão de Academia (Alunos, Treinos e Dietas)

Aplicação web completa desenvolvida em **React 19 + TypeScript + Vite + Tailwind CSS**, com foco na experiência do instrutor e praticante de musculação.

## 🚀 Funcionalidades Principais

- **Sem Login (Acesso Direto à Tela Inicial)**: A aplicação abre diretamente no painel de controle e lista de alunos.
- **Banco de Dados Mockado Persistente (LocalStorage)**:
  - Carregado inicialmente com dados realistas de demonstração (3 alunos com treinos e dietas completas).
  - Mantém todas as alterações (novos alunos, edições, treinos e dietas) salvas no navegador mesmo ao recarregar a página.
  - Botão de **Restaurar Demo** para retornar aos dados de exemplo a qualquer momento.
  - Botão de **Backup JSON** para exportar todos os dados e **Restaurar JSON** para importar de volta.
- **Cadastro e Gestão de Alunos**:
  - Dados coletados: Nome Completo, Idade, Peso (kg), Altura (cm).
  - Nível de experiência: **Iniciante**, **Intermediário** e **Avançado** (com badges visuais).
  - Objetivo principal: **Hipertrofia**, **Emagrecimento**, **Definição**, **Ganho de Força**, etc.
  - **Cálculo Automático de IMC** com classificação da OMS em tempo real no formulário e nos cards.
  - **Cálculo de Meta Hídrica Diária**: estimado automaticamente com base no peso (35ml/kg).
  - Campo para restrições médicas, lesões articulares e observações gerais.
- **Módulo de Treinos (Ficha Completa)**:
  - Divisão de rotinas: Treino A, Treino B, Treino C, Full Body, etc.
  - Cadastro de exercícios com: Grupo Muscular, Séries, Faixa de Repetições, Carga (kg), Descanso (s) e Instruções Técnicas.
  - Botão de impressão amigável da ficha de treino.
- **Módulo de Dieta & Nutrição**:
  - Cronograma de refeições por horário (Café da Manhã, Almoço, Lanches, Jantar, etc.).
  - Registro de alimentos, porções, calorias e proteínas.
  - Metas calóricas e de macronutrientes (Proteínas, Carboidratos e Gorduras).
  - Monitoramento da meta de água diária calculada.

## 🛠️ Como Executar o Projeto

No terminal dentro da pasta do projeto:

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Pré-visualizar build de produção
npm run preview
```

O aplicativo estará disponível em: `http://localhost:5173`
