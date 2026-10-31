import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { Header } from '../../../shared/components/header/header';
import { ContainerContent } from '../../../shared/components/container-content/container-content';
import { AuthService } from '../../auth/services/auth';
import { TipoConta } from '../../../core/enums/tipo-conta';

export interface PassoOnboarding {
  titulo: string;
  descricao: string;
}

export interface AtalhoRapido {
  rotulo: string;
  icone: string;
  rota: string;
}

@Component({
  selector: 'app-cadastro-sucesso',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, ContainerContent],
  templateUrl: './cadastro-sucesso.html',
  styleUrl: './cadastro-sucesso.css',
})
export class CadastroSucesso implements OnInit {
  private servicoAutenticacao = inject(AuthService);
  private roteador = inject(Router);

  readonly TipoConta = TipoConta;

  tipoUsuarioAtual: TipoConta = TipoConta.Instrutor;
  etiquetaPerfil: string = '';
  descricaoPrincipal: string = '';
  iconeCabecalhoPassos: string = '';
  textoBotaoPrincipal: string = '';

  proximosPassos: PassoOnboarding[] = [];
  atalhosRapidos: AtalhoRapido[] = [];

  ngOnInit(): void {
    const tipoSalvo = this.servicoAutenticacao.obterTipoUsuario();
    this.tipoUsuarioAtual = tipoSalvo === TipoConta.Aluno ? TipoConta.Aluno : TipoConta.Instrutor;

    this.configurarConteudoPorPerfil();
  }

  private configurarConteudoPorPerfil(): void {
    if (this.tipoUsuarioAtual === TipoConta.Instrutor) {
      this.etiquetaPerfil = 'CADASTRO INSTRUTOR';
      this.descricaoPrincipal =
        'Sua conta de instrutor está pronta. Após a aprovação dos documentos, você poderá receber alunos próximos a você.';
      this.iconeCabecalhoPassos = 'assets/icons/manage_icon.svg';
      this.textoBotaoPrincipal = 'Completar Perfil';

      this.proximosPassos = [
        {
          titulo: 'Complete seu perfil profissional',
          descricao: 'Adicione sua bio, experiência e fotos do veículo adaptado.',
        },
        {
          titulo: 'Aguarde a validação dos documentos',
          descricao: 'Sua credencial do Detran e o CRLV estão em análise pela nossa equipe.',
        },
        {
          titulo: 'Receba alunos próximos',
          descricao: 'Alunos da sua região poderão encontrar e contatar você via WhatsApp.',
        },
      ];

      this.atalhosRapidos = [
        { rotulo: 'Perfil', icone: 'assets/icons/profile_icon.svg', rota: '/perfil-instrutor' },
        {
          rotulo: 'Documentos',
          icone: 'assets/icons/document_icon.svg',
          rota: '/validacao-documental',
        },
        { rotulo: 'Agenda', icone: 'assets/icons/calendar_icon.svg', rota: '/meus-servicos' },
      ];
    } else {
      this.etiquetaPerfil = 'CADASTRO ALUNO';
      this.descricaoPrincipal =
        'Sua conta de aluno está pronta. Depois de aprovado os documentos, você poderá buscar e contatar instrutores verificados próximos.';
      this.iconeCabecalhoPassos = 'assets/icons/study_icon_generics.svg';
      this.textoBotaoPrincipal = 'Explorar Instrutores';

      this.proximosPassos = [
        {
          titulo: 'Encontre instrutores próximos',
          descricao: 'Use a busca por localização para ver instrutores na sua região.',
        },
        {
          titulo: 'Compare avaliações e preços',
          descricao: 'Veja perfis verificados, avaliações reais e valores por hora.',
        },
        {
          titulo: 'Contate via WhatsApp',
          descricao: 'Agende sua aula diretamente com o instrutor escolhido.',
        },
      ];

      this.atalhosRapidos = [
        { rotulo: 'Buscar', icone: 'assets/icons/search_icon.svg', rota: '/vitrine' },
        { rotulo: 'Próximos', icone: 'assets/icons/location_green_icon.svg', rota: '/vitrine' },
        { rotulo: 'Avaliados', icone: 'assets/icons/star_green_icon.svg', rota: '/vitrine' },
      ];
    }
  }

  executarAcaoPrincipal(): void {
    localStorage.setItem('statusDocumentacao', 'aprovado');

    if (this.tipoUsuarioAtual === TipoConta.Instrutor) {
      this.roteador.navigate(['/home-instrutor']);
    } else {
      this.roteador.navigate(['/vitrine']);
    }
  }

  navegarParaAtalho(rota: string): void {
    this.roteador.navigate([rota]);
  }

  voltarParaHome(): void {
    localStorage.setItem('statusDocumentacao', 'aprovado');

    if (this.tipoUsuarioAtual === TipoConta.Instrutor) {
      this.roteador.navigate(['/home-instrutor']);
    } else {
      this.roteador.navigate(['/vitrine']);
    }
  }
}
