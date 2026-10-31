import { Routes } from '@angular/router';
import { BoasVindas } from './features/pages/boas-vindas/boas-vindas';
import { Login } from './features/pages/login/login';
import { Cadastro } from './features/pages/cadastro/cadastro';
import { AtuacaoInstrutor } from './features/pages/atuacao-instrutor/atuacao-instrutor';
import { PreferenciasAluno } from './features/pages/preferencias-aluno/preferencias-aluno';
import { ValidacaoDocumental } from './features/pages/validacao-documental/validacao-documental';
import { authGuard } from './core/guards/auth-guard';
import { statusDocumentoGuard } from './core/guards/status-documento-guard';
import { CadastroSucesso } from './features/pages/cadastro-sucesso/cadastro-sucesso';
import { Vitrine } from './features/pages/vitrine/vitrine';
import { HomeInstrutor } from './features/pages/home-instrutor/home-instrutor';
import { MeuPerfil } from './features/pages/meu-perfil/meu-perfil';
import { MeusServicos } from './features/pages/meus-servicos/meus-servicos';
import { PerfilInstrutor } from './features/pages/perfil-instrutor/perfil-instrutor';
import { PainelAdmin } from './features/pages/painel-admin/painel-admin';

export const routes: Routes = [
  { path: '', redirectTo: 'boas-vindas', pathMatch: 'full' },

  // Rotas Públicas
  { path: 'boas-vindas', component: BoasVindas },
  { path: 'login', component: Login },
  { path: 'criar-conta', component: Cadastro },

  // Rotas Autenticadas de Onboarding e Validação Documental
  { path: 'preferencias-aluno', component: PreferenciasAluno, canActivate: [authGuard] },
  { path: 'atuacao-instrutor', component: AtuacaoInstrutor, canActivate: [authGuard] },
  { path: 'validacao-documental', component: ValidacaoDocumental, canActivate: [authGuard] },
  { path: 'cadastro-sucesso', component: CadastroSucesso, canActivate: [authGuard] },

  // Rotas Restritas de Negócio (Exigem Login + Documentação Aprovada - RF10)
  { path: 'vitrine', component: Vitrine, canActivate: [authGuard, statusDocumentoGuard] },
  {
    path: 'home-instrutor',
    component: HomeInstrutor,
    canActivate: [authGuard, statusDocumentoGuard],
  },
  {
    path: 'meus-servicos',
    component: MeusServicos,
    canActivate: [authGuard, statusDocumentoGuard],
  },

  {
    path: 'painel-admin',
    component: PainelAdmin,
    canActivate: [authGuard],
  },

  { path: 'perfil-instrutor', component: PerfilInstrutor, canActivate: [authGuard] },
  {
    path: 'perfil-instrutor/:id',
    component: PerfilInstrutor,
    canActivate: [authGuard, statusDocumentoGuard],
  },

  { path: 'meu-perfil', component: MeuPerfil, canActivate: [authGuard] },

  { path: '**', redirectTo: 'boas-vindas' },
];
