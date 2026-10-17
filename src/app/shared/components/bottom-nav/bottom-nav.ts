import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [CommonModule, RouterModule],
  standalone: true,
  selector: 'app-bottom-nav',
  styleUrl: './bottom-nav.css',
  templateUrl: './bottom-nav.html',
})
export class BottomNav {
  @Input() abaAtiva: 'inicio' | 'buscar' | 'perfil' = 'inicio';
  @Input() rotaInicio: string = '/boas-vindas';
  @Input() rotaBuscar: string = '/vitrine';
  @Input() rotaPerfil: string = '/meu-perfil';
}
