import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Header } from '../../../shared/components/header/header';
import { ContainerContent } from '../../../shared/components/container-content/container-content';
import { CategoriaCNH } from '../../../core/enums/categoria-cnh';
import { StatusDocumento } from '../../../core/enums/status-documento';
import { Perfil } from '../../perfis/services/perfil';

@Component({
  selector: 'app-preferencias-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, ContainerContent],
  templateUrl: './preferencias-aluno.html',
  styleUrl: './preferencias-aluno.css',
})
export class PreferenciasAluno {
  private servicoPerfil = inject(Perfil);
  private roteador = inject(Router);

  readonly regioesGrandeVitoria: string[] = [
    'Vila Velha',
    'Vitória',
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

  regiaoSelecionada: string = '';
  categoriasSelecionadas: CategoriaCNH[] = [];

  podeContinuar(): boolean {
    return !!this.regiaoSelecionada && this.categoriasSelecionadas.length > 0;
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

    const idUsuario = localStorage.getItem('idUsuario') || 'aluno-temporario';

    localStorage.setItem('statusDocumentacao', StatusDocumento.Pendente);
    localStorage.setItem('regiaoBuscaAluno', this.regiaoSelecionada);
    localStorage.setItem('categoriasDesejadasAluno', JSON.stringify(this.categoriasSelecionadas));

    this.servicoPerfil
      .salvarPreferenciasAluno(idUsuario, {
        regiaoBusca: this.regiaoSelecionada,
        categoriasDesejadas: this.categoriasSelecionadas,
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
