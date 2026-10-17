import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-container-content',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './container-content.css',
  templateUrl: './container-content.html',
})
export class ContainerContent {
  // Permite ajustar o padding caso alguma tela específica precise de mais ou menos espaço
  @Input() preenchimentoPersonalizado: string = 'px-5 py-6';
  // Permite centralizar verticalmente o conteúdo (útil na tela de Boas-vindas ou Sucesso)
  @Input() centralizarConteudo: boolean = false;
}
