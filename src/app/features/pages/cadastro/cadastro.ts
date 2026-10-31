import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { Header } from '../../../shared/components/header/header';
import { ContainerContent } from '../../../shared/components/container-content/container-content';
import { AuthService } from '../../auth/services/auth';
import { TipoConta } from '../../../core/enums/tipo-conta';
import { CadastroRequest } from '../../auth/models/cadastro-request';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, Header, ContainerContent],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  private construtorFormulario = inject(FormBuilder);
  private servicoAutenticacao = inject(AuthService);
  private roteador = inject(Router);

  // Expõe o Enum para uso direto no template HTML
  readonly TipoConta = TipoConta;

  tipoContaSelecionada: TipoConta = TipoConta.Aluno;
  senhaVisivel: boolean = false;

  formularioCadastro: FormGroup = this.construtorFormulario.group({
    nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, Validators.minLength(14)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
    telefone: ['', [Validators.required, Validators.minLength(15)]],
  });

  selecionarTipoConta(tipo: TipoConta): void {
    this.tipoContaSelecionada = tipo;
  }

  alternarVisibilidadeSenha(): void {
    this.senhaVisivel = !this.senhaVisivel;
  }

  formatarCpf(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '').slice(0, 11);

    if (valor.length > 9) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (valor.length > 3) {
      valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    this.formularioCadastro.get('cpf')?.setValue(valor, { emitEvent: false });
  }

  formatarTelefone(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '').slice(0, 11);

    if (valor.length > 7) {
      valor = valor.replace(/(\d{2})(\d{1})(\d{4})(\d{1,4})/, '($1) $2 $3-$4');
    } else if (valor.length > 3) {
      valor = valor.replace(/(\d{2})(\d{1})(\d{1,4})/, '($1) $2 $3');
    } else if (valor.length > 2) {
      valor = valor.replace(/(\d{2})(\d{1})/, '($1) $2');
    }

    this.formularioCadastro.get('telefone')?.setValue(valor, { emitEvent: false });
  }

  continuarCadastro(): void {
    if (this.formularioCadastro.invalid) {
      this.formularioCadastro.markAllAsTouched();
      return;
    }

    const dadosCadastro: CadastroRequest = {
      tipoConta: this.tipoContaSelecionada,
      ...this.formularioCadastro.value,
    };

    localStorage.setItem('nomeUsuario', dadosCadastro.nomeCompleto);

    this.servicoAutenticacao.cadastrar(dadosCadastro).subscribe({
      next: () => {
        this.redirecionarPosCadastro();
      },
      error: (erro) => {
        console.error('Erro ao realizar cadastro na API:', erro);
        // Enquanto o backend não está rodando, permite testar a navegação do fluxo visual
        this.redirecionarPosCadastro();
      },
    });
  }

  private redirecionarPosCadastro(): void {
    if (this.tipoContaSelecionada === TipoConta.Instrutor) {
      this.roteador.navigate(['/atuacao-instrutor']);
    } else {
      this.roteador.navigate(['/preferencias-aluno']);
    }
  }
}
