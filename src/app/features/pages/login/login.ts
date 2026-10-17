import { Component, inject } from '@angular/core';
import { BottomNav } from '../../../shared/components/bottom-nav/bottom-nav';
import { ContainerContent } from '../../../shared/components/container-content/container-content';
import { Header } from '../../../shared/components/header/header';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth';
import { StatusDocumento } from '../../../core/enums/status-documento';
import { TipoConta } from '../../../core/enums/tipo-conta';

@Component({
  imports: [CommonModule, RouterModule, ReactiveFormsModule, Header, ContainerContent, BottomNav],
  standalone: true,
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private construtorFormulario = inject(FormBuilder);
  private servicoAutenticacao = inject(AuthService);
  private roteador = inject(Router);

  formularioLogin: FormGroup = this.construtorFormulario.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
  });

  senhaVisivel: boolean = false;
  carregandoLogin: boolean = false;
  erroLogin: string | null = null;

  alternarVisibilidadeSenha(): void {
    this.senhaVisivel = !this.senhaVisivel;
  }

  fazerLogin(): void {
    this.erroLogin = null;

    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      this.erroLogin = 'Preencha e-mail e senha válidos para continuar.';
      return;
    }

    this.carregandoLogin = true;

    this.servicoAutenticacao.login(this.formularioLogin.value).subscribe({
      next: (resposta) => {
        this.carregandoLogin = false;

        if (resposta.statusDocumentacao !== StatusDocumento.Aprovado) {
          this.roteador.navigate(['/validacao-documental']);
          return;
        }

        if (resposta.tipoUsuario === TipoConta.Instrutor) {
          this.roteador.navigate(['/home-instrutor']);
        } else {
          this.roteador.navigate(['/vitrine']);
        }
      },
      error: (erro) => {
        this.carregandoLogin = false;
        this.erroLogin = 'Não foi possível entrar. Verifique seu e-mail e senha.';
        console.error('Erro ao efetuar login:', erro);
      },
    });
  }
}
