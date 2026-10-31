import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Header } from '../../../shared/components/header/header';
import { ContainerContent } from '../../../shared/components/container-content/container-content';
import { AuthService } from '../../auth/services/auth';
import { Perfil } from '../../perfis/services/perfil';
import { TipoConta } from '../../../core/enums/tipo-conta';

@Component({
  selector: 'app-meu-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Header, ContainerContent],
  templateUrl: './meu-perfil.html',
  styleUrl: './meu-perfil.css',
})
export class MeuPerfil implements OnInit {
  private construtorFormulario = inject(FormBuilder);
  private servicoAutenticacao = inject(AuthService);
  private servicoPerfil = inject(Perfil);
  private roteador = inject(Router);

  readonly TipoConta = TipoConta;

  tipoUsuarioAtual: TipoConta = TipoConta.Instrutor;
  fotoPerfilUrl: string = '';
  salvandoDados: boolean = false;
  mensagemFeedback: string = '';
  exibirCampoNovaSenha: boolean = false;

  formularioPerfil: FormGroup = this.construtorFormulario.group({
    nomeCompleto: ['Carlos Mendes', [Validators.required, Validators.minLength(3)]],
    email: ['carlos@email.com', [Validators.required, Validators.email]],
    telefone: ['(27) 9 9999-9999', [Validators.required, Validators.minLength(15)]],
    biografia: [''],
    novaSenha: [''],
  });

  ngOnInit(): void {
    const tipoSalvo = this.servicoAutenticacao.obterTipoUsuario();
    this.tipoUsuarioAtual = tipoSalvo === TipoConta.Aluno ? TipoConta.Aluno : TipoConta.Instrutor;

    this.carregarDadosIniciais();
  }

  private carregarDadosIniciais(): void {
    // Define a foto padrão fiel a cada protótipo (Instrutor vs Aluno)
    const fotoPadrao =
      this.tipoUsuarioAtual === TipoConta.Instrutor
        ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

    this.fotoPerfilUrl = localStorage.getItem('fotoUsuario') || fotoPadrao;

    const nomeSalvo = localStorage.getItem('nomeUsuario') || 'Carlos Mendes';
    const emailSalvo = localStorage.getItem('emailUsuario') || 'carlos@email.com';
    const telefoneSalvo = localStorage.getItem('telefoneUsuario') || '(27) 9 9999-9999';
    const biografiaSalva = localStorage.getItem('biografiaUsuario') || '';

    this.formularioPerfil.patchValue({
      nomeCompleto: nomeSalvo,
      email: emailSalvo,
      telefone: telefoneSalvo,
      biografia: biografiaSalva,
    });
  }

  obterRotaVoltar(): string {
    return this.tipoUsuarioAtual === TipoConta.Instrutor ? '/home-instrutor' : '/vitrine';
  }

  obterPlaceholderBiografia(): string {
    return this.tipoUsuarioAtual === TipoConta.Instrutor
      ? 'Conte um pouco sobre você e sua experiência como instrutor...'
      : 'Fale um pouco sobre você....';
  }

  selecionarNovaFoto(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const arquivo = input.files[0];
    const leitor = new FileReader();

    leitor.onload = () => {
      if (typeof leitor.result === 'string') {
        this.fotoPerfilUrl = leitor.result;
        localStorage.setItem('fotoUsuario', this.fotoPerfilUrl);
      }
    };

    leitor.readAsDataURL(arquivo);
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

    this.formularioPerfil.get('telefone')?.setValue(valor, { emitEvent: false });
  }

  alternarSecaoAlterarSenha(): void {
    this.exibirCampoNovaSenha = !this.exibirCampoNovaSenha;
  }

  atualizarDados(): void {
    if (this.formularioPerfil.invalid) {
      this.formularioPerfil.markAllAsTouched();
      return;
    }

    this.salvandoDados = true;
    const valores = this.formularioPerfil.value;
    const idUsuario = localStorage.getItem('idUsuario') || 'usuario-logado';

    // Persiste no localStorage para manter a simulação reativa em todas as telas
    localStorage.setItem('nomeUsuario', valores.nomeCompleto);
    localStorage.setItem('emailUsuario', valores.email);
    localStorage.setItem('telefoneUsuario', valores.telefone);
    localStorage.setItem('biografiaUsuario', valores.biografia || '');

    this.servicoPerfil
      .atualizarDadosCadastrais(idUsuario, {
        nomeCompleto: valores.nomeCompleto,
        email: valores.email,
        telefone: valores.telefone,
        fotoPerfilUrl: this.fotoPerfilUrl,
      })
      .subscribe({
        next: () => this.finalizarAtualizacao(),
        error: () => this.finalizarAtualizacao(),
      });
  }

  private finalizarAtualizacao(): void {
    this.salvandoDados = false;
    this.exibirCampoNovaSenha = false;
    this.mensagemFeedback = 'Dados atualizados com sucesso!';

    setTimeout(() => {
      this.mensagemFeedback = '';
    }, 3000);
  }

  excluirConta(): void {
    const confirmou = window.confirm(
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
    );

    if (confirmou) {
      this.servicoAutenticacao.logout();
      localStorage.clear();
      this.roteador.navigate(['/boas-vindas']);
    }
  }
}
