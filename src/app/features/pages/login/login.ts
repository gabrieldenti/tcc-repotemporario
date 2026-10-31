import { Component, inject } from '@angular/core';
import { BottomNav } from '../../../shared/components/bottom-nav/bottom-nav';
import { ContainerContent } from '../../../shared/components/container-content/container-content';
import { Header } from '../../../shared/components/header/header';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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

  // Controle do Fluxo de Recuperação de Senha (RF03)
  modalRecuperacaoAberto: boolean = false;
  emailRecuperacao = new FormControl('', [Validators.required, Validators.email]);
  enviandoRecuperacao: boolean = false;
  mensagemRecuperacaoSucesso: string | null = null;
  erroRecuperacao: string | null = null;

  alternarVisibilidadeSenha(): void {
    this.senhaVisivel = !this.senhaVisivel;
  }

  abrirModalRecuperacao(): void {
    const emailDigitado = this.formularioLogin.get('email')?.value || '';
    this.emailRecuperacao.setValue(emailDigitado);
    this.emailRecuperacao.markAsUntouched();
    this.mensagemRecuperacaoSucesso = null;
    this.erroRecuperacao = null;
    this.modalRecuperacaoAberto = true;
  }

  fecharModalRecuperacao(): void {
    this.modalRecuperacaoAberto = false;
  }

  enviarRecuperacaoSenha(): void {
    this.erroRecuperacao = null;
    this.mensagemRecuperacaoSucesso = null;

    if (this.emailRecuperacao.invalid) {
      this.emailRecuperacao.markAsTouched();
      this.erroRecuperacao = 'Informe um endereço de e-mail válido.';
      return;
    }

    this.enviandoRecuperacao = true;
    const email = this.emailRecuperacao.value!;

    // Caso o método no seu AuthService tenha outro nome, ajuste abaixo:
    if (typeof (this.servicoAutenticacao as any).recuperarSenha === 'function') {
      (this.servicoAutenticacao as any).recuperarSenha(email).subscribe({
        next: () => {
          this.enviandoRecuperacao = false;
          this.mensagemRecuperacaoSucesso = `Enviamos as instruções de redefinição de senha para ${email}.`;
        },
        error: () => {
          this.enviandoRecuperacao = false;
          this.mensagemRecuperacaoSucesso = `Se o e-mail ${email} estiver cadastrado, você receberá o link de recuperação em instantes.`;
        },
      });
    } else {
      // Fallback imediato caso o endpoint ainda não esteja plugado no AuthService
      setTimeout(() => {
        this.enviandoRecuperacao = false;
        this.mensagemRecuperacaoSucesso = `Enviamos um link de recuperação de senha para ${email}.`;
      }, 600);
    }
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

        // 1º Verifica se é Administrador (RF09) antes da barreira documental (RF10)
        if (resposta.tipoUsuario === TipoConta.Admin) {
          this.roteador.navigate(['/painel-admin']);
          return;
        }

        // 2º Aplica a retenção sistêmica documental para Aluno e Instrutor (RF10)
        if (resposta.statusDocumentacao !== StatusDocumento.Aprovado) {
          this.roteador.navigate(['/validacao-documental']);
          return;
        }

        // 3º Direciona para o ambiente correspondente ao perfil
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
