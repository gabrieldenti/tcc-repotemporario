import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { statusDocumentoGuard } from './core/guards/status-documento-guard';
import { BoasVindas } from './features/pages/boas-vindas/boas-vindas';
import { Cadastro } from './features/pages/cadastro/cadastro';
import { Login } from './features/pages/login/login';
import { PreferenciasAluno } from './features/pages/preferencias-aluno/preferencias-aluno';
import { AtuacaoInstrutor } from './features/pages/atuacao-instrutor/atuacao-instrutor';

export const routes: Routes = [
  { path: '', redirectTo: 'boas-vindas', pathMatch: 'full' },

  // Rotas públicas
  { path: 'boas-vindas', component: BoasVindas, data: { titulo: 'Boas-vindas' } },
  { path: 'login', component: Login, data: { titulo: 'Login' } },
  { path: 'criar-conta', component: Cadastro, data: { titulo: 'Criar conta' } },

  // Rotas autenticadas de onboarding
  {
    path: 'preferencias-aluno',
    component: PreferenciasAluno,
    canActivate: [authGuard],
    data: { titulo: 'Preferências do aluno' },
  },
  {
    path: 'atuacao-instrutor',
    component: AtuacaoInstrutor,
    canActivate: [authGuard],
    data: { titulo: 'Atuação do instrutor' },
  },
  {
    path: 'validacao-documental',
    component: BoasVindas,
    canActivate: [authGuard],
    data: { titulo: 'Validação documental' },
  },

  // Rotas restritas do sistema
  {
    path: 'vitrine',
    component: BoasVindas,
    canActivate: [authGuard, statusDocumentoGuard],
    data: { titulo: 'Vitrine' },
  },
  {
    path: 'home-instrutor',
    component: BoasVindas,
    canActivate: [authGuard, statusDocumentoGuard],
    data: { titulo: 'Home do instrutor' },
  },
  {
    path: 'meus-servicos',
    component: BoasVindas,
    canActivate: [authGuard, statusDocumentoGuard],
    data: { titulo: 'Meus serviços' },
  },
  {
    path: 'meu-perfil',
    component: BoasVindas,
    canActivate: [authGuard],
    data: { titulo: 'Meu perfil' },
  },

  // Segurança final
  { path: '**', redirectTo: 'boas-vindas' },
];
