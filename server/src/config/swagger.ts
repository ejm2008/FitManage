export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'FitManage API',
    version: '1.0.0',
    description: 'API REST completa para o sistema de gestão de alunos, treinos e dietas FitManage. Inclui persistência de dados mockados e autenticação por cookie de sessão.',
    contact: {
      name: 'FitManage Development Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor Local da API',
    },
  ],
  tags: [
    { name: 'Autenticação', description: 'Endpoints de autenticação com cookie de sessão' },
    { name: 'Alunos', description: 'Gestão de alunos, dados biométricos e objetivos' },
    { name: 'Treinos', description: 'Divisões de treinamento e cadastro de exercícios' },
    { name: 'Dietas', description: 'Planos nutricionais, refeições e meta hídrica' },
    { name: 'Administração', description: 'Restauração de dados mockados e backup' },
  ],
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Realizar login no sistema',
        description: 'Autentica o usuário (admin / 123456) e define o cookie de sessão fitmanage_session.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string', example: 'admin' },
                  password: { type: 'string', example: '123456' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login efetuado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    user: { $ref: '#/components/schemas/AuthUser' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Credenciais inválidas',
          },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Autenticação'],
        summary: 'Encerrar sessão (Logout)',
        description: 'Remove o cookie de sessão do navegador.',
        responses: {
          200: {
            description: 'Logout realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Sessão encerrada com sucesso' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Autenticação'],
        summary: 'Obter dados do usuário ativo',
        description: 'Lê o cookie de sessão para retornar o usuário conectado.',
        responses: {
          200: {
            description: 'Usuário autenticado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    authenticated: { type: 'boolean', example: true },
                    user: { $ref: '#/components/schemas/AuthUser' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Não autenticado',
          },
        },
      },
    },
    '/api/students': {
      get: {
        tags: ['Alunos'],
        summary: 'Listar todos os alunos',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Termo para busca por nome ou objetivo' },
          { name: 'level', in: 'query', schema: { type: 'string', enum: ['Iniciante', 'Intermediário', 'Avançado', 'Todos'] }, description: 'Filtro por nível' },
          { name: 'goal', in: 'query', schema: { type: 'string' }, description: 'Filtro por objetivo' },
        ],
        responses: {
          200: {
            description: 'Lista de alunos cadastrados',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Student' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Alunos'],
        summary: 'Cadastrar novo aluno',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StudentInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Aluno cadastrado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Student' },
              },
            },
          },
          400: { description: 'Campos obrigatórios faltando' },
        },
      },
    },
    '/api/students/{id}': {
      get: {
        tags: ['Alunos'],
        summary: 'Buscar aluno por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Dados do aluno',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Student' },
              },
            },
          },
          404: { description: 'Aluno não encontrado' },
        },
      },
      put: {
        tags: ['Alunos'],
        summary: 'Atualizar dados de um aluno',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StudentInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Aluno atualizado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Student' },
              },
            },
          },
          404: { description: 'Aluno não encontrado' },
        },
      },
      delete: {
        tags: ['Alunos'],
        summary: 'Excluir aluno',
        description: 'Remove o aluno e todos os treinos e dietas associados.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Aluno excluído com sucesso' },
          404: { description: 'Aluno não encontrado' },
        },
      },
    },
    '/api/workouts/student/{studentId}': {
      get: {
        tags: ['Treinos'],
        summary: 'Listar treinos de um aluno',
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Lista de treinos cadastrados para o aluno',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Workout' },
                },
              },
            },
          },
        },
      },
    },
    '/api/workouts': {
      post: {
        tags: ['Treinos'],
        summary: 'Cadastrar ou atualizar treino',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WorkoutInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Treino salvo com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Workout' },
              },
            },
          },
        },
      },
    },
    '/api/workouts/{id}': {
      delete: {
        tags: ['Treinos'],
        summary: 'Excluir divisão de treino',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Treino excluído com sucesso' },
          404: { description: 'Treino não encontrado' },
        },
      },
    },
    '/api/diets/student/{studentId}': {
      get: {
        tags: ['Dietas'],
        summary: 'Obter plano nutricional de um aluno',
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Plano nutricional do aluno',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DietPlan' },
              },
            },
          },
          404: { description: 'Dieta não encontrada para este aluno' },
        },
      },
      delete: {
        tags: ['Dietas'],
        summary: 'Excluir plano nutricional do aluno',
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Dieta excluída com sucesso' },
          404: { description: 'Dieta não encontrada' },
        },
      },
    },
    '/api/diets': {
      post: {
        tags: ['Dietas'],
        summary: 'Salvar ou atualizar plano nutricional',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DietPlanInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Plano nutricional salvo com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DietPlan' },
              },
            },
          },
        },
      },
    },
    '/api/admin/reset': {
      post: {
        tags: ['Administração'],
        summary: 'Restaurar banco mockado de demonstração',
        description: 'Recarrega os 3 alunos de exemplo com treinos e dietas completas.',
        responses: {
          200: {
            description: 'Dados restaurados para o padrão de demonstração',
          },
        },
      },
    },
    '/api/admin/export': {
      get: {
        tags: ['Administração'],
        summary: 'Exportar backup completo em JSON',
        responses: {
          200: {
            description: 'Snapshot do banco de dados mockado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DatabaseState' },
              },
            },
          },
        },
      },
    },
    '/api/admin/import': {
      post: {
        tags: ['Administração'],
        summary: 'Importar backup em formato JSON',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DatabaseState' },
            },
          },
        },
        responses: {
          200: { description: 'Dados importados com sucesso' },
          400: { description: 'Estrutura JSON inválida' },
        },
      },
    },
  },
  components: {
    schemas: {
      AuthUser: {
        type: 'object',
        properties: {
          username: { type: 'string', example: 'admin' },
          role: { type: 'string', example: 'Instrutor Chefe' },
          loginTime: { type: 'string', example: '2026-03-01T14:30:00.000Z' },
        },
      },
      Student: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'student-1' },
          name: { type: 'string', example: 'Carlos Henrique Silva' },
          age: { type: 'number', example: 26 },
          weight: { type: 'number', example: 78.5 },
          height: { type: 'number', example: 178 },
          goal: { type: 'string', example: 'Hipertrofia' },
          level: { type: 'string', enum: ['Iniciante', 'Intermediário', 'Avançado'], example: 'Intermediário' },
          phone: { type: 'string', example: '(11) 98765-4321' },
          email: { type: 'string', example: 'carlos.silva@email.com' },
          notes: { type: 'string', example: 'Foco em hipertrofia de peitorais' },
          medicalConditions: { type: 'string', example: 'Sem restrições articulares' },
          createdAt: { type: 'string', example: '2026-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2026-03-01T14:30:00.000Z' },
        },
      },
      StudentInput: {
        type: 'object',
        required: ['name', 'age', 'weight', 'height', 'goal', 'level'],
        properties: {
          id: { type: 'string', example: 'student-1' },
          name: { type: 'string', example: 'Carlos Henrique Silva' },
          age: { type: 'number', example: 26 },
          weight: { type: 'number', example: 78.5 },
          height: { type: 'number', example: 178 },
          goal: { type: 'string', example: 'Hipertrofia' },
          level: { type: 'string', enum: ['Iniciante', 'Intermediário', 'Avançado'], example: 'Intermediário' },
          phone: { type: 'string', example: '(11) 98765-4321' },
          email: { type: 'string', example: 'carlos.silva@email.com' },
          notes: { type: 'string', example: 'Foco em hipertrofia' },
          medicalConditions: { type: 'string', example: 'Sem restrições' },
        },
      },
      Exercise: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'ex-1' },
          name: { type: 'string', example: 'Supino Reto com Barra' },
          muscleGroup: { type: 'string', example: 'Peito' },
          sets: { type: 'number', example: 4 },
          reps: { type: 'string', example: '8 - 10' },
          loadKg: { type: 'string', example: '70kg' },
          restSeconds: { type: 'number', example: 90 },
          notes: { type: 'string', example: 'Fase excêntrica controlada' },
        },
      },
      Workout: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'workout-1' },
          studentId: { type: 'string', example: 'student-1' },
          name: { type: 'string', example: 'Treino A - Peito & Tríceps' },
          division: { type: 'string', example: 'A' },
          targetMuscles: { type: 'string', example: 'Peitoral maior e tríceps' },
          notes: { type: 'string', example: 'Descanso de 60 a 90s' },
          exercises: {
            type: 'array',
            items: { $ref: '#/components/schemas/Exercise' },
          },
        },
      },
      WorkoutInput: {
        type: 'object',
        required: ['studentId', 'name', 'division'],
        properties: {
          id: { type: 'string', example: 'workout-1' },
          studentId: { type: 'string', example: 'student-1' },
          name: { type: 'string', example: 'Treino A - Peito & Tríceps' },
          division: { type: 'string', example: 'A' },
          targetMuscles: { type: 'string', example: 'Peito e Tríceps' },
          notes: { type: 'string', example: 'Descanso moderado' },
          exercises: {
            type: 'array',
            items: { $ref: '#/components/schemas/Exercise' },
          },
        },
      },
      MealItem: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'i-1' },
          name: { type: 'string', example: 'Ovos mexidos' },
          portion: { type: 'string', example: '4 unidades' },
          calories: { type: 'number', example: 290 },
          proteinG: { type: 'number', example: 24 },
        },
      },
      Meal: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'm-1' },
          name: { type: 'string', example: 'Café da Manhã' },
          time: { type: 'string', example: '07:30' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/MealItem' },
          },
        },
      },
      DietPlan: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'diet-1' },
          studentId: { type: 'string', example: 'student-1' },
          title: { type: 'string', example: 'Plano Hipertrofia Limpa' },
          dailyWaterMl: { type: 'number', example: 2750 },
          targetCalories: { type: 'number', example: 2850 },
          targetProteinG: { type: 'number', example: 165 },
          targetCarbsG: { type: 'number', example: 360 },
          targetFatsG: { type: 'number', example: 75 },
          meals: {
            type: 'array',
            items: { $ref: '#/components/schemas/Meal' },
          },
        },
      },
      DietPlanInput: {
        type: 'object',
        required: ['studentId', 'title', 'dailyWaterMl'],
        properties: {
          id: { type: 'string', example: 'diet-1' },
          studentId: { type: 'string', example: 'student-1' },
          title: { type: 'string', example: 'Plano Hipertrofia' },
          dailyWaterMl: { type: 'number', example: 2750 },
          targetCalories: { type: 'number', example: 2800 },
          targetProteinG: { type: 'number', example: 160 },
          targetCarbsG: { type: 'number', example: 350 },
          targetFatsG: { type: 'number', example: 70 },
          notes: { type: 'string', example: 'Evitar frituras' },
          meals: {
            type: 'array',
            items: { $ref: '#/components/schemas/Meal' },
          },
        },
      },
      DatabaseState: {
        type: 'object',
        properties: {
          students: { type: 'array', items: { $ref: '#/components/schemas/Student' } },
          workouts: { type: 'array', items: { $ref: '#/components/schemas/Workout' } },
          diets: { type: 'array', items: { $ref: '#/components/schemas/DietPlan' } },
        },
      },
    },
  },
};
