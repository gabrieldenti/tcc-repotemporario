import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { Header } from '../../../shared/components/header/header';
import { ContainerContent } from '../../../shared/components/container-content/container-content';
import { BottomNav } from '../../../shared/components/bottom-nav/bottom-nav';
import { Perfil } from '../../perfis/services/perfil';

@Component({
  selector: 'app-home-instrutor',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, ContainerContent, BottomNav],
  templateUrl: './home-instrutor.html',
  styleUrl: './home-instrutor.css',
})
export class HomeInstrutor implements OnInit {
  private servicoPerfil = inject(Perfil);
  private roteador = inject(Router);

  nomeInstrutor: string = 'Carlos';
  fotoInstrutorUrl: string =
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';
  avaliacaoMedia: number = 4.9;
  totalAvaliacoes: number = 128;
  disponivelParaNovosAlunos: boolean = true;

  ngOnInit(): void {
    const nomeSalvo = localStorage.getItem('nomeUsuario');
    if (nomeSalvo) {
      // Exibe o primeiro nome caso o instrutor tenha acabado de se cadastrar
      this.nomeInstrutor = nomeSalvo.trim().split(' ')[0];
    }

    const visibilidadeSalva = localStorage.getItem('statusVisibilidadeInstrutor');
    if (visibilidadeSalva !== null) {
      this.disponivelParaNovosAlunos = JSON.parse(visibilidadeSalva);
    }
  }

  alternarDisponibilidade(): void {
    this.disponivelParaNovosAlunos = !this.disponivelParaNovosAlunos;
    localStorage.setItem(
      'statusVisibilidadeInstrutor',
      JSON.stringify(this.disponivelParaNovosAlunos),
    );

    const idUsuario = localStorage.getItem('idUsuario') || 'instrutor-carlos';

    this.servicoPerfil
      .salvarServicosInstrutor(idUsuario, {
        statusVisibilidade: this.disponivelParaNovosAlunos,
      })
      .subscribe({
        error: () => {
          // Mantém a alteração salva localmente durante a simulação sem backend
        },
      });
  }

  abrirEditarPerfil(): void {
    this.roteador.navigate(['/meu-perfil']);
  }

  abrirGerenciarServicos(): void {
    this.roteador.navigate(['/meus-servicos']);
  }
}
