import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../features/auth/services/auth';
import { TipoConta } from '../../../core/enums/tipo-conta';

@Component({
  imports: [CommonModule, RouterModule],
  standalone: true,
  selector: 'app-bottom-nav',
  styleUrl: './bottom-nav.css',
  templateUrl: './bottom-nav.html',
})
export class BottomNav {
  private servicoAutenticacao = inject(AuthService);

  @Input() abaAtiva: 'inicio' | 'buscar' | 'perfil' = 'inicio';
  @Input() rotaInicio: string = '/boas-vindas';
  @Input() rotaBuscar: string = '/vitrine';
  @Input() rotaPerfil: string = '/perfil-instrutor';

  obterRotaPerfil(): string {
    const tipoUsuario = this.servicoAutenticacao.obterTipoUsuario();

    if (tipoUsuario === TipoConta.Instrutor) {
      return '/perfil-instrutor';
    }

    return this.rotaPerfil || '/meu-perfil';
  }
}
