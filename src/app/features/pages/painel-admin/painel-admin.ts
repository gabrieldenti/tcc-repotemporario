import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DocumentoUsuario } from '../../validacao-documental/models/documento-usuario';
import { StatusDocumento } from '../../../core/enums/status-documento';
import { Documento } from '../../validacao-documental/services/documento';

@Component({
  selector: 'app-painel-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './painel-admin.html',
  styleUrl: './painel-admin.css',
})
export class PainelAdmin implements OnInit {
  private documentoService = inject(Documento);

  readonly StatusDocumento = StatusDocumento;

  documentos: DocumentoUsuario[] = [];
  carregando: boolean = false;

  // Filtros da interface
  termoBusca: string = '';
  filtroTipo: 'TODOS' | DocumentoUsuario['tipoDocumento'] = 'TODOS';
  filtroStatus: 'TODOS' | StatusDocumento = 'TODOS';

  // Estado do Modal de Análise (UC05 - Passos 3 a 8 e Fluxo Alternativo)
  documentoSelecionado: DocumentoUsuario | null = null;
  modoRejeicao: boolean = false;
  motivoRejeicao: string = '';
  erroMotivo: boolean = false;
  processandoAcao: boolean = false;
  mensagemFeedback: string = '';

  ngOnInit(): void {
    this.carregarDocumentos();
  }

  // UC05 (Passo 2): Lista os documentos submetidos para análise
  carregarDocumentos(): void {
    this.carregando = true;
    this.documentoService.listarDocumentosAdmin().subscribe({
      next: (dados) => {
        this.documentos = dados;
        this.carregando = false;
      },
      error: () => {
        // Fallback para demonstração local caso a API ainda não esteja em execução
        this.documentos = [
          {
            id: 'doc-001',
            usuarioId: 'Carlos Mendes (Instrutor • Vitória/ES)',
            tipoDocumento: 'CredencialDetran',
            arquivoUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            status: 'EmAnalise' as StatusDocumento,
            dataEnvio: '28/10/2026',
            dataValidade: '28/10/2027',
          },
          {
            id: 'doc-002',
            usuarioId: 'Carlos Mendes (Instrutor • Vitória/ES)',
            tipoDocumento: 'CRLV',
            arquivoUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            status: 'EmAnalise' as StatusDocumento,
            dataEnvio: '28/10/2026',
            dataValidade: '31/12/2026',
          },
          {
            id: 'doc-003',
            usuarioId: 'Mariana Costa (Aluna • Vila Velha/ES)',
            tipoDocumento: 'LADV',
            arquivoUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            status: 'EmAnalise' as StatusDocumento,
            dataEnvio: '29/10/2026',
            dataValidade: '29/04/2027',
          },
          {
            id: 'doc-004',
            usuarioId: 'Mariana Costa (Aluna • Vila Velha/ES)',
            tipoDocumento: 'Identidade',
            arquivoUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            status: 'Aprovado' as StatusDocumento,
            dataEnvio: '29/10/2026',
          },
        ];
        this.carregando = false;
      },
    });
  }

  get documentosFiltrados(): DocumentoUsuario[] {
    return this.documentos.filter((doc) => {
      const bateTipo = this.filtroTipo === 'TODOS' || doc.tipoDocumento === this.filtroTipo;
      const bateStatus = this.filtroStatus === 'TODOS' || doc.status === this.filtroStatus;
      const busca = this.termoBusca.trim().toLowerCase();
      const bateBusca =
        !busca ||
        doc.usuarioId.toLowerCase().includes(busca) ||
        doc.tipoDocumento.toLowerCase().includes(busca) ||
        doc.id.toLowerCase().includes(busca);

      return bateTipo && bateStatus && bateBusca;
    });
  }

  // UC05 (Passo 3 e 4): Seleciona o documento e exibe a imagem do Cloudinary
  selecionarDocumento(doc: DocumentoUsuario): void {
    this.documentoSelecionado = doc;
    this.modoRejeicao = false;
    this.motivoRejeicao = '';
    this.erroMotivo = false;
  }

  fecharModal(): void {
    this.documentoSelecionado = null;
    this.modoRejeicao = false;
    this.motivoRejeicao = '';
    this.erroMotivo = false;
  }

  // UC05 (Fluxo Principal - Passos 6 a 8): Aprova o documento
  confirmarAprovacao(doc: DocumentoUsuario): void {
    this.processandoAcao = true;
    this.documentoService.aprovarDocumento(doc.id).subscribe({
      next: (docAtualizado) => {
        doc.status = docAtualizado.status;
        this.finalizarAcao(`Documento ${this.obterTitulo(doc.tipoDocumento)} aprovado!`);
      },
      error: () => {
        // Atualização local para demonstração offline
        doc.status = 'Aprovado' as StatusDocumento;
        this.finalizarAcao(`Documento ${this.obterTitulo(doc.tipoDocumento)} aprovado!`);
      },
    });
  }

  // UC05 (Fluxo Alternativo - Passos 1 a 4): Rejeita o documento com motivo obrigatório
  confirmarRejeicao(doc: DocumentoUsuario): void {
    if (!this.motivoRejeicao || this.motivoRejeicao.trim().length < 5) {
      this.erroMotivo = true;
      return;
    }

    this.processandoAcao = true;
    const motivoLimpo = this.motivoRejeicao.trim();

    this.documentoService.rejeitarDocumento(doc.id, motivoLimpo).subscribe({
      next: (docAtualizado) => {
        doc.status = docAtualizado.status;
        this.finalizarAcao(`Documento rejeitado. Motivo enviado ao utilizador.`);
      },
      error: () => {
        // Atualização local para demonstração offline
        doc.status = 'Rejeitado' as StatusDocumento;
        this.finalizarAcao(`Documento rejeitado. Motivo: "${motivoLimpo}".`);
      },
    });
  }

  private finalizarAcao(mensagem: string): void {
    this.processandoAcao = false;
    this.mensagemFeedback = mensagem;
    this.fecharModal();
    setTimeout(() => (this.mensagemFeedback = ''), 4000);
  }

  // Helpers visuais alinhados aos protótipos das Figuras 11 e 16 do TCC
  obterTitulo(tipo: DocumentoUsuario['tipoDocumento']): string {
    switch (tipo) {
      case 'CredencialDetran':
        return 'Credencial do Detran Ativa';
      case 'CRLV':
        return 'CRLV do Veículo Adaptado';
      case 'Identidade':
        return 'Documento de Identidade com Foto (RG/CNH)';
      case 'LADV':
        return 'LADV vigente (Permissão de Aprendizagem)';
    }
  }

  obterSubtitulo(tipo: DocumentoUsuario['tipoDocumento']): string {
    switch (tipo) {
      case 'CredencialDetran':
        return 'Credencial vigente do Detran-ES';
      case 'CRLV':
        return 'Documento do veículo dentro da validade';
      case 'Identidade':
        return 'Frente e verso, legível';
      case 'LADV':
        return 'Documento dentro da validade';
    }
  }

  obterIcone(tipo: DocumentoUsuario['tipoDocumento']): string {
    switch (tipo) {
      case 'CredencialDetran':
        return 'assets/icons/verify_icon_documentation.svg';
      case 'CRLV':
        return 'assets/icons/car_icon_initial.svg';
      case 'Identidade':
        return 'assets/icons/card_icon.svg';
      case 'LADV':
        return 'assets/icons/document_icon.svg';
    }
  }

  verificarStatus(
    statusAtual: StatusDocumento,
    esperado: 'EmAnalise' | 'Aprovado' | 'Rejeitado',
  ): boolean {
    const valor = String(statusAtual).toUpperCase().replace('_', '');
    if (esperado === 'EmAnalise') {
      return valor === 'EMANALISE' || valor === 'PENDENTE' || valor === '0';
    }
    if (esperado === 'Aprovado') {
      return valor === 'APROVADO' || valor === '1';
    }
    return valor === 'REJEITADO' || valor === 'RECUSADO' || valor === '2';
  }
}
