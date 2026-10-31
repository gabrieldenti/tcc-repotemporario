import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Header } from '../../../shared/components/header/header';
import { ContainerContent } from '../../../shared/components/container-content/container-content';
import { BottomNav } from '../../../shared/components/bottom-nav/bottom-nav';
import { AuthService } from '../../auth/services/auth';
import { Perfil } from '../../perfis/services/perfil';
import { TipoConta } from '../../../core/enums/tipo-conta';
import { CategoriaCNH } from '../../../core/enums/categoria-cnh';
import { PerfilInstrutor } from '../../perfis/models/perfil-instrutor';
import { CardInstrutorVitrine } from '../../perfis/models/card-instrutor-vitrine';

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header, ContainerContent, BottomNav],
  templateUrl: './vitrine.html',
  styleUrl: './vitrine.css',
})
export class Vitrine implements OnInit {
  private servicoAutenticacao = inject(AuthService);
  private servicoPerfil = inject(Perfil);
  private roteador = inject(Router);

  readonly TipoConta = TipoConta;
  readonly todasCategorias: CategoriaCNH[] = [
    CategoriaCNH.A,
    CategoriaCNH.B,
    CategoriaCNH.C,
    CategoriaCNH.D,
    CategoriaCNH.E,
  ];

  tipoUsuarioAtual: TipoConta = TipoConta.Aluno;

  // Estado da Visão do Instrutor
  nomeInstrutorLogado: string = 'Carlos';
  fotoInstrutorLogado: string =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  avaliacaoInstrutorLogado: number = 4.9;
  totalAvaliacoesInstrutorLogado: number = 128;
  disponivelParaNovosAlunos: boolean = true;

  // Estado da Vitrine do Aluno (RF14, RF15, RF16)
  cidadeSelecionada: string = 'Vitória, ES';
  termoBusca: string = '';

  // Estado do Modal "Filtrar e Ordenar"
  exibirModalFiltros: boolean = false;
  categoriasFiltroMultiplas: CategoriaCNH[] = [];
  criterioOrdenacao: 'menor_preco' | 'maior_avaliacao' | 'mais_proximo' | 'mais_recente' =
    'menor_preco';
  precoMinimo: number = 50;
  precoMaximo: number = 150;
  avaliacaoMinima: number = 4; // 4 estrelas ou mais

  listaInstrutores: CardInstrutorVitrine[] = [
    {
      id: 'instrutor-carlos',
      nomeCompleto: 'Carlos Mendes',
      fotoPerfilUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      avaliacaoMedia: 4.9,
      totalAvaliacoes: 128,
      bairroRegiao: 'Praia do Canto · Grande Vitória',
      valorHora: 80,
      categoriasAtendidas: [CategoriaCNH.A, CategoriaCNH.B, CategoriaCNH.D],
    },
    {
      id: 'instrutor-ana',
      nomeCompleto: 'Ana Paula Souza',
      fotoPerfilUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 94,
      bairroRegiao: 'Jardim Camburi · Grande Vitória',
      valorHora: 75,
      categoriasAtendidas: [CategoriaCNH.A, CategoriaCNH.B, CategoriaCNH.C],
    },
    {
      id: 'instrutor-roberto',
      nomeCompleto: 'Roberto Lima',
      fotoPerfilUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      avaliacaoMedia: 4.7,
      totalAvaliacoes: 212,
      bairroRegiao: 'Centro · Grande Vitória',
      valorHora: 90,
      categoriasAtendidas: [CategoriaCNH.C, CategoriaCNH.D, CategoriaCNH.E],
    },
  ];

  ngOnInit(): void {
    const tipoSalvo = this.servicoAutenticacao.obterTipoUsuario();
    this.tipoUsuarioAtual =
      tipoSalvo === TipoConta.Instrutor ? TipoConta.Instrutor : TipoConta.Aluno;

    const regiaoSalvaAluno = localStorage.getItem('regiaoBuscaAluno');
    if (regiaoSalvaAluno) {
      this.cidadeSelecionada = `${regiaoSalvaAluno}, ES`;
    }

    if (this.tipoUsuarioAtual === TipoConta.Aluno) {
      this.carregarInstrutoresDaApi();
    }
  }

  private carregarInstrutoresDaApi(): void {
    this.servicoPerfil
      .listarInstrutoresDisponiveis({
        regiao: this.cidadeSelecionada,
      })
      .subscribe({
        next: (instrutoresApi: PerfilInstrutor[]) => {
          if (instrutoresApi && instrutoresApi.length > 0) {
            this.listaInstrutores = instrutoresApi.map((inst) => ({
              id: inst.id,
              nomeCompleto: inst.nomeCompleto,
              fotoPerfilUrl:
                inst.fotoPerfilUrl ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
              avaliacaoMedia: inst.avaliacaoMedia,
              totalAvaliacoes: inst.totalAvaliacoes,
              bairroRegiao: inst.regioesAtendimento?.join(', ') || 'Grande Vitória',
              valorHora: inst.valorHora,
              categoriasAtendidas: inst.categoriasAtendidas,
            }));
          }
        },
        error: () => {},
      });
  }

  // --- Lógica do Modal de Filtros (RF15 e RF16) ---

  abrirModalFiltros(): void {
    this.exibirModalFiltros = true;
  }

  fecharModalFiltros(): void {
    this.exibirModalFiltros = false;
  }

  alternarCategoriaModal(categoria: CategoriaCNH): void {
    if (this.categoriasFiltroMultiplas.includes(categoria)) {
      this.categoriasFiltroMultiplas = this.categoriasFiltroMultiplas.filter(
        (c) => c !== categoria,
      );
    } else {
      this.categoriasFiltroMultiplas.push(categoria);
    }
  }

  categoriaEstaSelecionadaModal(categoria: CategoriaCNH): boolean {
    return this.categoriasFiltroMultiplas.includes(categoria);
  }

  limparFiltrosModal(): void {
    this.categoriasFiltroMultiplas = [];
    this.criterioOrdenacao = 'menor_preco';
    this.precoMinimo = 50;
    this.precoMaximo = 150;
    this.avaliacaoMinima = 0;
  }

  obterInstrutoresFiltrados(): CardInstrutorVitrine[] {
    let resultado = [...this.listaInstrutores];

    // Busca por texto
    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase().trim();
      resultado = resultado.filter(
        (i) =>
          i.nomeCompleto.toLowerCase().includes(termo) ||
          i.bairroRegiao.toLowerCase().includes(termo),
      );
    }

    // Filtro por categorias múltiplas no modal
    if (this.categoriasFiltroMultiplas.length > 0) {
      resultado = resultado.filter((i) =>
        this.categoriasFiltroMultiplas.some((cat) => i.categoriasAtendidas.includes(cat)),
      );
    }

    // Filtro por faixa de preço
    resultado = resultado.filter(
      (i) => i.valorHora >= this.precoMinimo && i.valorHora <= this.precoMaximo,
    );

    // Filtro por avaliação mínima
    if (this.avaliacaoMinima > 0) {
      resultado = resultado.filter((i) => i.avaliacaoMedia >= this.avaliacaoMinima);
    }

    // Ordenação (RF16)
    if (this.criterioOrdenacao === 'menor_preco') {
      resultado.sort((a, b) => a.valorHora - b.valorHora);
    } else if (this.criterioOrdenacao === 'maior_avaliacao') {
      resultado.sort((a, b) => b.avaliacaoMedia - a.avaliacaoMedia);
    } else if (this.criterioOrdenacao === 'mais_recente') {
      resultado.sort((a, b) => b.totalAvaliacoes - a.totalAvaliacoes);
    }

    return resultado;
  }

  instrutorAtendeCategoria(instrutor: CardInstrutorVitrine, categoria: CategoriaCNH): boolean {
    return instrutor.categoriasAtendidas.includes(categoria);
  }

  verPerfilInstrutor(instrutorId: string): void {
    localStorage.setItem('instrutorSelecionadoId', instrutorId);
    this.roteador.navigate(['/perfil-instrutor', instrutorId]);
  }

  // --- Visão do Instrutor ---

  alternarDisponibilidadeNovosAlunos(): void {
    this.disponivelParaNovosAlunos = !this.disponivelParaNovosAlunos;
    const idUsuario = localStorage.getItem('idUsuario') || 'instrutor-carlos';

    this.servicoPerfil
      .salvarServicosInstrutor(idUsuario, { statusVisibilidade: this.disponivelParaNovosAlunos })
      .subscribe({ error: () => {} });
  }

  irParaEditarPerfil(): void {
    this.roteador.navigate(['/meu-perfil']);
  }

  irParaGerenciarServicos(): void {
    this.roteador.navigate(['/meus-servicos']);
  }
}
