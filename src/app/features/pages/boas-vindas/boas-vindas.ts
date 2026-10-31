import { Component } from '@angular/core';
import { BottomNav } from '../../../shared/components/bottom-nav/bottom-nav';
import { ContainerContent } from '../../../shared/components/container-content/container-content';
import { Header } from '../../../shared/components/header/header';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, RouterModule, Header, ContainerContent, BottomNav],
  standalone: true,
  selector: 'app-boas-vindas',
  styleUrl: './boas-vindas.css',
  templateUrl: './boas-vindas.html',
})
export class BoasVindas {
  modalTermosAberto: boolean = false;

  abrirModalTermos(): void {
    this.modalTermosAberto = true;
  }

  fecharModalTermos(): void {
    this.modalTermosAberto = false;
  }
}
