import { CommonModule, Location } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule],
  standalone: true,
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  private localizacao = inject(Location);
  private roteador = inject(Router);

  @Input() modo: 'logo' | 'voltar' | 'painel' = 'logo';
  @Input() titulo: string = '';
  @Input() exibirIconeMarcaNoTitulo: boolean = false;
  @Input() rotaVoltar: string = '';

  @Input() textoLocalizacao: string = '';
  @Input() exibirNotificacao: boolean = false;
  @Input() exibirConfiguracao: boolean = false;
  @Input() exibirBotaoEditar: boolean = false;
  @Input() rotaEditar: string = '/meu-perfil';
  @Input() exibirBotaoAdicionar: boolean = false;

  voltar(): void {
    if (this.rotaVoltar) {
      this.roteador.navigate([this.rotaVoltar]);
    } else {
      this.localizacao.back();
    }
  }

  irParaEdicao(): void {
    this.roteador.navigate([this.rotaEditar]);
  }
}
