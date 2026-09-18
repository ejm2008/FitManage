import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger.js';

import { authRoutes } from './routes/auth.routes.js';
import { studentsRoutes } from './routes/students.routes.js';
import { workoutsRoutes } from './routes/workouts.routes.js';
import { dietsRoutes } from './routes/diets.routes.js';
import { adminRoutes } from './routes/admin.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Middleware de controle de acesso: Apenas role 'dev' pode acessar o Swagger
const requireDevRole = (req: Request, res: Response, next: express.NextFunction) => {
  const cookieData = req.cookies?.['fitmanage_session'];
  if (!cookieData) {
    return res.status(403).send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <title>Acesso Restrito - Swagger UI</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #090d16; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #0f172a; padding: 2.5rem; border-radius: 1.5rem; border: 1px solid #dc2626; text-align: center; max-width: 480px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
            h1 { color: #f87171; margin-bottom: 0.5rem; font-size: 1.5rem; }
            p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; }
            a.btn { display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #1e293b; color: #38bdf8; font-weight: bold; text-decoration: none; border-radius: 0.75rem; border: 1px solid #334155; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>🔒 403 - Acesso Restrito ao Desenvolvedor</h1>
            <p>A documentação Swagger está restrita para usuários com o papel <strong>dev</strong> (Desenvolvedor).</p>
            <p>Você não está autenticado ou não possui permissão de desenvolvedor.</p>
            <a href="http://localhost:5173" class="btn">Voltar para o FitManage</a>
          </div>
        </body>
      </html>
    `);
  }

  try {
    const user = JSON.parse(cookieData);
    if (user.role === 'dev') {
      return next();
    }
  } catch {
    // Cookie malformado
  }

  return res.status(403).send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Acesso Restrito - Swagger UI</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #090d16; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { background: #0f172a; padding: 2.5rem; border-radius: 1.5rem; border: 1px solid #dc2626; text-align: center; max-width: 480px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
          h1 { color: #f87171; margin-bottom: 0.5rem; font-size: 1.5rem; }
          p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; }
          a.btn { display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #1e293b; color: #38bdf8; font-weight: bold; text-decoration: none; border-radius: 0.75rem; border: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🔒 403 - Acesso Negado</h1>
          <p>O seu perfil atual (<strong>admin</strong>) não possui permissão para acessar a documentação interna da API.</p>
          <p>Faça login com uma conta com papel <strong>dev</strong> para visualizar o Swagger.</p>
          <a href="http://localhost:5173" class="btn">Voltar para o FitManage</a>
        </div>
      </body>
    </html>
  `);
};

// Documentação Interativa Swagger UI (Apenas DEV)
app.use('/api-docs', requireDevRole, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas da API REST
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/workouts', workoutsRoutes);
app.use('/api/diets', dietsRoutes);
app.use('/api/admin', adminRoutes);

// Healthcheck e Rota Raiz
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>FitManage API</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #090d16; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { background: #0f172a; padding: 2.5rem; border-radius: 1.5rem; border: 1px solid #1e293b; text-align: center; max-width: 480px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
          h1 { color: #10b981; margin-bottom: 0.5rem; }
          p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; }
          a.btn { display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #10b981, #14b8a6); color: #022c22; font-weight: bold; text-decoration: none; border-radius: 0.75rem; transition: transform 0.2s; }
          a.btn:hover { transform: translateY(-2px); }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>FitManage API</h1>
          <p>Servidor backend ativo na porta ${PORT}. Acesse a documentação interativa Swagger para explorar e testar todas as rotas.</p>
          <a href="/api-docs" class="btn">Abrir Swagger UI (/api-docs)</a>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 FitManage API Server rodando na porta ${PORT}`);
  console.log(`📡 URL Base:   http://localhost:${PORT}`);
  console.log(`📑 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`=================================================\n`);
});
