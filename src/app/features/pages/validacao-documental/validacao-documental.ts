import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Header } from '../../../shared/components/header/header';
import { ContainerContent } from '../../../shared/components/container-content/container-content';
import { AuthService } from '../../auth/services/auth';
import { Documento } from '../../validacao-documental/services/documento';
import { TipoConta } from '../../../core/enums/tipo-conta';
import { StatusDocumento } from '../../../core/enums/status-documento';

export interface ItemDocumentoValidacao {
  chave: 'Credencial' | 'CRLV' | 'RG' | 'LADV';
  titulo: string;
  subtitulo: string;
  icone: string;
  status: StatusDocumento;
  arquivoSelecionado: File | null;
  nomeArquivo?: string;
  motivoRejeicao?: string;
}

@Component({
  selector: 'app-validacao-documental',
  standalone: true,
  imports: [CommonModule, Header, ContainerContent],
  templateUrl: './validacao-documental.html',
  styleUrl: './validacao-documental.css',
})
export class ValidacaoDocumental implements OnInit {
  private servicoAutenticacao = inject(AuthService);
  private servicoDocumento = inject(Documento);
  private roteador = inject(Router);

  readonly StatusDocumento = StatusDocumento;

  tipoUsuarioAtual: TipoConta = TipoConta.Aluno;
  statusGeral: StatusDocumento = StatusDocumento.EmAnalise;
  enviandoArquivos: boolean = false;
  mensagemAviso: string = '';

  itensDocumentacao: ItemDocumentoValidacao[] = [];

  ngOnInit(): void {
    const tipoSalvo = this.servicoAutenticacao.obterTipoUsuario();
    this.tipoUsuarioAtual =
      tipoSalvo === TipoConta.Instrutor ? TipoConta.Instrutor : TipoConta.Aluno;

    const statusSalvo = this.servicoAutenticacao.obterStatusDocumentacao();
    if (statusSalvo) {
      this.statusGeral = statusSalvo;
    }

    this.configurarDocumentosPorPerfil();
  }

  private configurarDocumentosPorPerfil(): void {
    if (this.tipoUsuarioAtual === TipoConta.Instrutor) {
      // RF06: Credencial do DETRAN e CRLV para o perfil de instrutor
      this.itensDocumentacao = [
        {
          chave: 'Credencial',
          titulo: 'Credencial do Detran Ativa',
          subtitulo: 'Credencial vigente do Detran-ES',
          icone: 'assets/icons/verify_icon_documentation.svg',
          status: StatusDocumento.EmAnalise,
          arquivoSelecionado: null,
        },
        {
          chave: 'CRLV',
          titulo: 'CRLV do Veículo Adaptado',
          subtitulo: 'Documento do veículo dentro da validade',
          icone: 'assets/icons/car_icon_register.svg',
          status: StatusDocumento.EmAnalise,
          arquivoSelecionado: null,
        },
      ];
    } else {
      // RF05: Documento com foto (RG/CNH) e LADV para o perfil de aluno
      this.itensDocumentacao = [
        {
          chave: 'RG',
          titulo: 'Documento de Identidade com Foto (RG/CNH)',
          subtitulo: 'Frente e verso, legível',
          icone: 'assets/icons/card_icon.svg',
          status: StatusDocumento.EmAnalise,
          arquivoSelecionado: null,
        },
        {
          chave: 'LADV',
          titulo: 'LADV vigente (Permissão de Aprendizagem)',
          subtitulo: 'Documento dentro da validade',
          icone: 'assets/icons/document_icon.svg',
          status: StatusDocumento.EmAnalise,
          arquivoSelecionado: null,
        },
      ];
    }
  }

  obterRotaVoltar(): string {
    return this.tipoUsuarioAtual === TipoConta.Instrutor
      ? '/atuacao-instrutor'
      : '/preferencias-aluno';
  }

  obterTextoStatus(status: StatusDocumento): string {
    switch (status) {
      case StatusDocumento.Aprovado:
        return 'Aprovado';
      case StatusDocumento.Rejeitado:
        return 'Rejeitado - Reenviar';
      case StatusDocumento.EmAnalise:
      case StatusDocumento.Pendente:
      default:
        return 'Em Análise';
    }
  }

  selecionarArquivo(evento: Event, indice: number): void {
    const elementoInput = evento.target as HTMLInputElement;
    if (!elementoInput.files || elementoInput.files.length === 0) {
      return;
    }

    const arquivo = elementoInput.files[0];
    const extensoesPermitidas = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

    if (!extensoesPermitidas.includes(arquivo.type)) {
      this.mensagemAviso = 'Formato inválido. Envie uma imagem (JPG, PNG) ou arquivo PDF.';
      return;
    }

    this.mensagemAviso = '';
    this.itensDocumentacao[indice].arquivoSelecionado = arquivo;
    this.itensDocumentacao[indice].nomeArquivo = arquivo.name;
    this.itensDocumentacao[indice].status = StatusDocumento.EmAnalise;
  }

  todosArquivosSelecionados(): boolean {
    return this.itensDocumentacao.every((item) => item.arquivoSelecionado !== null);
  }

  salvarEEnviarParaAnalise(): void {
    if (!this.todosArquivosSelecionados()) {
      this.mensagemAviso =
        'Por favor, anexe todos os documentos obrigatórios antes de enviar para análise.';
      return;
    }

    this.mensagemAviso = '';
    this.enviandoArquivos = true;
    const idUsuario = localStorage.getItem('idUsuario') || 'usuario-temporario';

    const requisicoesUpload = this.itensDocumentacao.map((item) => {
      const formData = new FormData();
      formData.append('arquivo', item.arquivoSelecionado!);
      formData.append('tipoDocumento', item.chave);
      formData.append('usuarioId', idUsuario);

      return this.servicoDocumento.enviarDocumento(formData).pipe(catchError(() => of(null)));
    });

    forkJoin(requisicoesUpload).subscribe({
      next: () => {
        this.enviandoArquivos = false;
        localStorage.setItem('statusDocumentacao', StatusDocumento.EmAnalise);
        this.roteador.navigate(['/cadastro-sucesso']);
      },
      error: () => {
        this.enviandoArquivos = false;
        localStorage.setItem('statusDocumentacao', StatusDocumento.EmAnalise);
        this.roteador.navigate(['/cadastro-sucesso']);
      },
    });
  }
}
