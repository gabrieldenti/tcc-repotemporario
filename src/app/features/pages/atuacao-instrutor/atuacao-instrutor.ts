import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Header } from '../../../shared/components/header/header';
import { ContainerContent } from '../../../shared/components/container-content/container-content';
import { CategoriaCNH } from '../../../core/enums/categoria-cnh';
import { StatusDocumento } from '../../../core/enums/status-documento';
import { Perfil } from '../../perfis/services/perfil';

@Component({
  selector: 'app-atuacao-instrutor',
  standalone: true,
  imports: [CommonModule, Header, ContainerContent],
  templateUrl: './atuacao-instrutor.html',
  styleUrl: './atuacao-instrutor.css',
})
export class AtuacaoInstrutor {
  private servicoPerfil = inject(Perfil);
  private roteador = inject(Router);

  readonly regioesGrandeVitoria: string[] = [
    'Vitória',
    'Vila Velha',
    'Serra',
    'Cariacica',
    'Viana',
  ];

  readonly listaCategorias: CategoriaCNH[] = [
    CategoriaCNH.A,
    CategoriaCNH.B,
    CategoriaCNH.C,
    CategoriaCNH.D,
    CategoriaCNH.E,
  ];

  regioesSelecionadas: string[] = [];
  categoriasSelecionadas: CategoriaCNH[] = [];

  podeContinuar(): boolean {
    return this.regioesSelecionadas.length > 0 && this.categoriasSelecionadas.length > 0;
  }

  obterRegioesDisponiveisParaAdicao(): string[] {
    return this.regioesGrandeVitoria.filter((regiao) => !this.regioesSelecionadas.includes(regiao));
  }

  adicionarRegiao(evento: Event): void {
    const elementoSelect = evento.target as HTMLSelectElement;
    const regiaoEscolhida = elementoSelect.value;

    if (regiaoEscolhida && !this.regioesSelecionadas.includes(regiaoEscolhida)) {
      this.regioesSelecionadas.push(regiaoEscolhida);
    }

    elementoSelect.value = '';
  }

  removerRegiao(regiaoParaRemover: string): void {
    this.regioesSelecionadas = this.regioesSelecionadas.filter(
      (regiao) => regiao !== regiaoParaRemover,
    );
  }

  alternarCategoria(categoria: CategoriaCNH): void {
    if (this.categoriaEstaSelecionada(categoria)) {
      this.categoriasSelecionadas = this.categoriasSelecionadas.filter(
        (item) => item !== categoria,
      );
    } else {
      this.categoriasSelecionadas.push(categoria);
    }
  }

  categoriaEstaSelecionada(categoria: CategoriaCNH): boolean {
    return this.categoriasSelecionadas.includes(categoria);
  }

  irParaValidacao(): void {
    if (!this.podeContinuar()) {
      return;
    }

    const idUsuario = localStorage.getItem('idUsuario') || 'instrutor-temporario';

    localStorage.setItem('statusDocumentacao', StatusDocumento.Pendente);
    localStorage.setItem('regioesInstrutor', JSON.stringify(this.regioesSelecionadas));
    localStorage.setItem('categoriasInstrutor', JSON.stringify(this.categoriasSelecionadas));

    this.servicoPerfil
      .salvarServicosInstrutor(idUsuario, {
        regioesAtendimento: this.regioesSelecionadas,
        categoriasAtendidas: this.categoriasSelecionadas,
      })
      .subscribe({
        next: () => this.roteador.navigate(['/validacao-documental']),
        error: () => this.roteador.navigate(['/validacao-documental']),
      });
  }

  pularPorAgora(): void {
    localStorage.setItem('statusDocumentacao', StatusDocumento.Pendente);
    this.roteador.navigate(['/validacao-documental']);
  }
}
