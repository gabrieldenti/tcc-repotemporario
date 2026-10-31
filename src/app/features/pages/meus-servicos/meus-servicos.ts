import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Header } from '../../../shared/components/header/header';
import { ContainerContent } from '../../../shared/components/container-content/container-content';
import { CategoriaCNH } from '../../../core/enums/categoria-cnh';
import { Perfil } from '../../perfis/services/perfil';

@Component({
  selector: 'app-meus-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, ContainerContent],
  templateUrl: './meus-servicos.html',
  styleUrl: './meus-servicos.css',
})
export class MeusServicos implements OnInit {
  private servicoPerfil = inject(Perfil);
  private roteador = inject(Router);

  readonly listaCategorias: CategoriaCNH[] = [
    CategoriaCNH.A,
    CategoriaCNH.B,
    CategoriaCNH.C,
    CategoriaCNH.D,
    CategoriaCNH.E,
  ];

  readonly regioesGrandeVitoria: string[] = [
    'Vitória',
    'Vila Velha',
    'Serra',
    'Cariacica',
    'Viana',
  ];

  readonly diasSemana: string[] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  readonly horariosPadrao: string[] = ['08h', '14h', '19h'];

  // Estado inicial idêntico ao protótipo (RF11, RF12, RF13)
  disponivelParaNovosAlunos: boolean = true;
  categoriasSelecionadas: CategoriaCNH[] = [
    CategoriaCNH.A,
    CategoriaCNH.B,
    CategoriaCNH.C,
    CategoriaCNH.D,
  ];
  valorHoraAula: number = 80;
  editandoValorHora: boolean = false;

  regioesAtendidas: string[] = ['Vitória', 'Vila Velha', 'Serra'];
  exibirSeletorRegiao: boolean = false;

  disponibilidadeSemanal: Record<string, string[]> = {
    Seg: ['08h', '14h', '19h'],
    Ter: ['08h', '19h'],
    Qua: ['14h', '19h'],
    Qui: ['08h', '14h'],
    Sex: ['08h', '19h'],
    Sáb: ['08h', '14h'],
    Dom: [],
  };

  salvandoAlteracoes: boolean = false;
  mensagemFeedback: string = '';

  ngOnInit(): void {
    this.carregarConfiguracoesSalvas();
  }

  private carregarConfiguracoesSalvas(): void {
    const visibilidadeSalva = localStorage.getItem('statusVisibilidadeInstrutor');
    if (visibilidadeSalva !== null) {
      this.disponivelParaNovosAlunos = JSON.parse(visibilidadeSalva);
    }

    const categoriasSalvas = localStorage.getItem('categoriasInstrutor');
    if (categoriasSalvas) {
      const lista = JSON.parse(categoriasSalvas);
      if (Array.isArray(lista) && lista.length > 0) {
        this.categoriasSelecionadas = lista;
      }
    }

    const valorSalvo = localStorage.getItem('valorHoraInstrutor');
    if (valorSalvo) {
      this.valorHoraAula = Number(valorSalvo);
    }

    const regioesSalvas = localStorage.getItem('regioesInstrutor');
    if (regioesSalvas) {
      const listaRegioes = JSON.parse(regioesSalvas);
      if (Array.isArray(listaRegioes) && listaRegioes.length > 0) {
        this.regioesAtendidas = listaRegioes;
      }
    }

    const horariosSalvos = localStorage.getItem('disponibilidadeSemanalInstrutor');
    if (horariosSalvos) {
      this.disponibilidadeSemanal = JSON.parse(horariosSalvos);
    }
  }

  alternarDisponibilidade(): void {
    this.disponivelParaNovosAlunos = !this.disponivelParaNovosAlunos;
  }

  // --- RF11: Categorias Oferecidas ---
  categoriaEstaSelecionada(categoria: CategoriaCNH): boolean {
    return this.categoriasSelecionadas.includes(categoria);
  }

  alternarCategoria(categoria: CategoriaCNH): void {
    if (this.categoriaEstaSelecionada(categoria)) {
      if (this.categoriasSelecionadas.length > 1) {
        this.categoriasSelecionadas = this.categoriasSelecionadas.filter(
          (item) => item !== categoria,
        );
      }
    } else {
      this.categoriasSelecionadas.push(categoria);
    }
  }

  // --- RF12: Valor por Hora ---
  alternarEdicaoValorHora(): void {
    this.editandoValorHora = !this.editandoValorHora;
  }

  confirmarValorHora(): void {
    if (!this.valorHoraAula || this.valorHoraAula < 30) {
      this.valorHoraAula = 30;
    } else if (this.valorHoraAula > 300) {
      this.valorHoraAula = 300;
    }
    this.editandoValorHora = false;
  }

  // --- Regiões Atendidas (Grande Vitória) ---
  obterRegioesDisponiveisParaAdicionar(): string[] {
    return this.regioesGrandeVitoria.filter((regiao) => !this.regioesAtendidas.includes(regiao));
  }

  alternarSeletorRegiao(): void {
    this.exibirSeletorRegiao = !this.exibirSeletorRegiao;
  }

  adicionarRegiao(regiao: string): void {
    if (regiao && !this.regioesAtendidas.includes(regiao)) {
      this.regioesAtendidas.push(regiao);
    }
    this.exibirSeletorRegiao = false;
  }

  removerRegiao(regiaoParaRemover: string): void {
    if (this.regioesAtendidas.length > 1) {
      this.regioesAtendidas = this.regioesAtendidas.filter(
        (regiao) => regiao !== regiaoParaRemover,
      );
    }
  }

  // --- RF13: Grade de Horários Disponíveis ---
  horarioEstaDisponivel(dia: string, horario: string): boolean {
    return this.disponibilidadeSemanal[dia]?.includes(horario) ?? false;
  }

  alternarHorario(dia: string, horario: string): void {
    const horariosDoDia = this.disponibilidadeSemanal[dia] || [];

    if (horariosDoDia.includes(horario)) {
      this.disponibilidadeSemanal[dia] = horariosDoDia.filter((item) => item !== horario);
    } else {
      this.disponibilidadeSemanal[dia] = [...horariosDoDia, horario];
    }
  }

  // --- Submissão e Persistência ---
  salvarAlteracoes(): void {
    this.salvandoAlteracoes = true;
    const idUsuario = localStorage.getItem('idUsuario') || 'instrutor-carlos';

    // Salva localmente para refletir imediatamente na Vitrine e no Perfil do Instrutor
    localStorage.setItem(
      'statusVisibilidadeInstrutor',
      JSON.stringify(this.disponivelParaNovosAlunos),
    );
    localStorage.setItem('categoriasInstrutor', JSON.stringify(this.categoriasSelecionadas));
    localStorage.setItem('valorHoraInstrutor', String(this.valorHoraAula));
    localStorage.setItem('regioesInstrutor', JSON.stringify(this.regioesAtendidas));
    localStorage.setItem(
      'disponibilidadeSemanalInstrutor',
      JSON.stringify(this.disponibilidadeSemanal),
    );

    this.servicoPerfil
      .salvarServicosInstrutor(idUsuario, {
        disponivelParaNovosAlunos: this.disponivelParaNovosAlunos,
        categoriasAtendidas: this.categoriasSelecionadas,
        valorHora: this.valorHoraAula,
        regioesAtendimento: this.regioesAtendidas,
        disponibilidadeSemanal: this.disponibilidadeSemanal,
      })
      .subscribe({
        next: () => this.finalizarSalvamento(),
        error: () => this.finalizarSalvamento(),
      });
  }

  private finalizarSalvamento(): void {
    this.salvandoAlteracoes = false;
    this.mensagemFeedback = 'Configurações de serviço salvas com sucesso!';

    setTimeout(() => {
      this.mensagemFeedback = '';
      this.roteador.navigate(['/vitrine']);
    }, 1200);
  }
}
