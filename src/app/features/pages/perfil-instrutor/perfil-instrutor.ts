import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Header } from '../../../shared/components/header/header';
import { ContainerContent } from '../../../shared/components/container-content/container-content';
import { BottomNav } from '../../../shared/components/bottom-nav/bottom-nav';
import { AuthService } from '../../auth/services/auth';
import { Perfil } from '../../perfis/services/perfil';
import { CategoriaCNH } from '../../../core/enums/categoria-cnh';
import { TipoConta } from '../../../core/enums/tipo-conta';
import { PerfilInstrutorDetalhe } from '../../perfis/models/perfil-instrutor-detalhe';

@Component({
  selector: 'app-perfil-instrutor',
  standalone: true,
  imports: [CommonModule, Header, ContainerContent, BottomNav],
  templateUrl: './perfil-instrutor.html',
  styleUrl: './perfil-instrutor.css',
})
export class PerfilInstrutor implements OnInit {
  private rotaAtiva = inject(ActivatedRoute);
  private roteador = inject(Router);
  private servicoAutenticacao = inject(AuthService);
  private servicoPerfil = inject(Perfil);

  readonly TipoConta = TipoConta;
  readonly listaCategorias: CategoriaCNH[] = [
    CategoriaCNH.A,
    CategoriaCNH.B,
    CategoriaCNH.C,
    CategoriaCNH.D,
    CategoriaCNH.E,
  ];

  readonly diasSemana: { chave: string; rotuloCurto: string; rotuloMaiusculo: string }[] = [
    { chave: 'Seg', rotuloCurto: 'Seg', rotuloMaiusculo: 'SEG' },
    { chave: 'Ter', rotuloCurto: 'Ter', rotuloMaiusculo: 'TER' },
    { chave: 'Qua', rotuloCurto: 'Qua', rotuloMaiusculo: 'QUA' },
    { chave: 'Qui', rotuloCurto: 'Qui', rotuloMaiusculo: 'QUI' },
    { chave: 'Sex', rotuloCurto: 'Sex', rotuloMaiusculo: 'SEX' },
    { chave: 'Sáb', rotuloCurto: 'Sáb', rotuloMaiusculo: 'SÁB' },
    { chave: 'Dom', rotuloCurto: 'Dom', rotuloMaiusculo: 'DOM' },
  ];

  readonly horariosPadrao: string[] = ['08h', '14h', '19h'];

  // Catálogo simulado dos instrutores da Vitrine para navegação sem backend
  private readonly catalogoInstrutoresSimulados: Record<string, PerfilInstrutorDetalhe> = {
    'instrutor-carlos': {
      id: 'instrutor-carlos',
      nomeCompleto: 'Carlos Mendes',
      telefone: '27999999999',
      fotoPerfilUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      avaliacaoMedia: 4.9,
      totalAvaliacoes: 128,
      localizacaoExibicao: 'Jardim Camburi, Vitória – ES',
      categoriasAtendidas: [CategoriaCNH.A, CategoriaCNH.B, CategoriaCNH.C, CategoriaCNH.D],
      biografia:
        'Instrutor credenciado pelo DETRAN-ES com mais de uma década de experiência em formação de condutores. Apaixonado por ensinar com paciência e clareza, ajudo alunos a conquistarem a CNH com segurança e confiança no trânsito de Vitória e região.',
      statusCrlv: 'Válido',
      statusCredenciamento: 'Credenciamento DETRAN-ES Ativo',
      tempoExperiencia: 'Experiência: 12 anos como instrutor',
      valorHoraAula: 80,
      disponibilidadeSemanal: {
        Seg: ['08h', '14h', '19h'],
        Ter: ['08h', '19h'],
        Qua: ['08h', '14h'],
        Qui: ['14h', '19h'],
        Sex: ['08h', '14h'],
        Sáb: ['08h'],
        Dom: [],
      },
    },
    'instrutor-ana': {
      id: 'instrutor-ana',
      nomeCompleto: 'Ana Paula Souza',
      telefone: '27988887777',
      fotoPerfilUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 94,
      localizacaoExibicao: 'Jardim Camburi, Vitória – ES',
      categoriasAtendidas: [CategoriaCNH.A, CategoriaCNH.B, CategoriaCNH.C],
      biografia:
        'Instrutora autônoma credenciada pelo DETRAN-ES, especialista em primeira habilitação e treinamento prático humanizado nas vias da Grande Vitória.',
      statusCrlv: 'Válido',
      statusCredenciamento: 'Credenciamento DETRAN-ES Ativo',
      tempoExperiencia: 'Experiência: 8 anos como instrutora',
      valorHoraAula: 75,
      disponibilidadeSemanal: {
        Seg: ['08h', '14h'],
        Ter: ['08h', '14h', '19h'],
        Qua: ['08h', '14h'],
        Qui: ['08h', '14h', '19h'],
        Sex: ['08h', '14h'],
        Sáb: ['08h', '14h'],
        Dom: [],
      },
    },
    'instrutor-roberto': {
      id: 'instrutor-roberto',
      nomeCompleto: 'Roberto Lima',
      telefone: '27997776666',
      fotoPerfilUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      avaliacaoMedia: 4.7,
      totalAvaliacoes: 212,
      localizacaoExibicao: 'Centro, Vitória – ES',
      categoriasAtendidas: [CategoriaCNH.C, CategoriaCNH.D, CategoriaCNH.E],
      biografia:
        'Instrutor especializado em adição e mudança de categorias pesadas (C, D e E), com veículo adaptado e foco nas rotas de exame prático da Grande Vitória.',
      statusCrlv: 'Válido',
      statusCredenciamento: 'Credenciamento DETRAN-ES Ativo',
      tempoExperiencia: 'Experiência: 15 anos como instrutor',
      valorHoraAula: 90,
      disponibilidadeSemanal: {
        Seg: ['08h', '14h'],
        Ter: ['08h', '14h'],
        Qua: ['08h', '14h'],
        Qui: ['08h', '14h'],
        Sex: ['08h', '14h'],
        Sáb: ['08h'],
        Dom: [],
      },
    },
  };

  visaoAluno: boolean = true;

  nomeCompleto: string = 'Carlos Mendes';
  telefoneInstrutor: string = '27999999999';
  fotoPerfilUrl: string = '';
  avaliacaoMedia: number = 4.9;
  totalAvaliacoes: number = 128;
  localizacaoExibicao: string = 'Jardim Camburi, Vitória – ES';
  categoriasAtendidas: CategoriaCNH[] = [];
  biografia: string = '';
  statusCrlv: string = 'Válido';
  statusCredenciamento: string = 'Credenciamento DETRAN-ES Ativo';
  tempoExperiencia: string = 'Experiência: 12 anos como instrutor';
  valorHoraAula: number = 80;
  disponibilidadeSemanal: Record<string, string[]> = {};

  ngOnInit(): void {
    const idParametroRota = this.rotaAtiva.snapshot.paramMap.get('id');
    const tipoUsuario = this.servicoAutenticacao.obterTipoUsuario();

    // Se houver ID na URL ou se o usuário logado for Aluno, exibe a visão do Aluno (com botão WhatsApp)
    this.visaoAluno = !!idParametroRota || tipoUsuario !== TipoConta.Instrutor;

    const idInstrutorAlvo =
      idParametroRota || localStorage.getItem('instrutorSelecionadoId') || 'instrutor-carlos';

    this.carregarDadosInstrutor(idInstrutorAlvo);
  }

  obterRotaVoltar(): string {
    return this.visaoAluno ? '/vitrine' : '/home-instrutor';
  }

  private carregarDadosInstrutor(instrutorId: string): void {
    const dadosBase =
      this.catalogoInstrutoresSimulados[instrutorId] ||
      this.catalogoInstrutoresSimulados['instrutor-carlos'];

    this.nomeCompleto = dadosBase.nomeCompleto;
    this.telefoneInstrutor = dadosBase.telefone;
    this.fotoPerfilUrl = dadosBase.fotoPerfilUrl ?? '';
    this.avaliacaoMedia = dadosBase.avaliacaoMedia;
    this.totalAvaliacoes = dadosBase.totalAvaliacoes;
    this.localizacaoExibicao = dadosBase.localizacaoExibicao;
    this.categoriasAtendidas = [...dadosBase.categoriasAtendidas];
    this.biografia = dadosBase.biografia ?? '';
    this.statusCrlv = dadosBase.statusCrlv;
    this.statusCredenciamento = dadosBase.statusCredenciamento;
    this.tempoExperiencia = dadosBase.tempoExperiencia;
    this.valorHoraAula = dadosBase.valorHoraAula;
    this.disponibilidadeSemanal = { ...dadosBase.disponibilidadeSemanal };

    // Se for o próprio instrutor visualizando seu perfil, sincroniza com o que ele editou no localStorage
    if (!this.visaoAluno) {
      this.sincronizarEdicoesLocaisDoInstrutor();
    }
  }

  private sincronizarEdicoesLocaisDoInstrutor(): void {
    const nomeSalvo = localStorage.getItem('nomeUsuario');
    if (nomeSalvo) this.nomeCompleto = nomeSalvo;

    const fotoSalva = localStorage.getItem('fotoUsuario');
    if (fotoSalva) this.fotoPerfilUrl = fotoSalva;

    const bioSalva = localStorage.getItem('biografiaUsuario');
    if (bioSalva && bioSalva.trim().length > 0) this.biografia = bioSalva;

    const categoriasSalvas = localStorage.getItem('categoriasInstrutor');
    if (categoriasSalvas) {
      const lista = JSON.parse(categoriasSalvas);
      if (Array.isArray(lista) && lista.length > 0) this.categoriasAtendidas = lista;
    }

    const valorSalvo = localStorage.getItem('valorHoraInstrutor');
    if (valorSalvo) this.valorHoraAula = Number(valorSalvo);

    const horariosSalvos = localStorage.getItem('disponibilidadeSemanalInstrutor');
    if (horariosSalvos) this.disponibilidadeSemanal = JSON.parse(horariosSalvos);
  }

  categoriaEstaAtiva(categoria: CategoriaCNH): boolean {
    return this.categoriasAtendidas.includes(categoria);
  }

  horarioEstaDisponivel(chaveDia: string, horario: string): boolean {
    return this.disponibilidadeSemanal[chaveDia]?.includes(horario) ?? false;
  }

  /**
   * RF17 e RF18: Formata a intenção de contato com os parâmetros do instrutor
   * e redireciona o aluno para a API externa do WhatsApp (wa.me).
   */
  contatarViaWhatsApp(): void {
    const categoriaPreferencial = this.categoriasAtendidas[0];
    const urlWhatsApp = this.servicoPerfil.gerarLinkWhatsApp(
      this.telefoneInstrutor,
      this.nomeCompleto,
      categoriaPreferencial,
    );

    window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
  }

  irParaEditarPerfil(): void {
    this.roteador.navigate(['/meu-perfil']);
  }
}
