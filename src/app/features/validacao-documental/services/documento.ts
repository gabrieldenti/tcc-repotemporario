import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import type { DocumentoUsuario } from '../models/documento-usuario';
import { Observable } from 'rxjs';

@Service()
export class Documento {
  private apiUrl = `${environment.apiUrl}/documentos`;

  private http = inject(HttpClient);

  // 1. RF05 e RF06: Enviar / Fazer upload dos documentos obrigatórios (LADV, CNH/Identidade, Credencial, CRLV)
  enviarDocumento(formData: FormData): Observable<DocumentoUsuario> {
    return this.http.post<DocumentoUsuario>(this.apiUrl, formData);
  }

  // 2. RF07: Consultar o status atual da análise documental do usuário logado
  obterMeusDocumentos(): Observable<DocumentoUsuario[]> {
    return this.http.get<DocumentoUsuario[]>(`${this.apiUrl}/meus-documentos`);
  }

  // 3. RF08: Permitir o reenvio de arquivos caso o status anterior tenha sido rejeitado
  reenviarDocumento(id: string, formData: FormData): Observable<DocumentoUsuario> {
    return this.http.put<DocumentoUsuario>(`${this.apiUrl}/${id}/reenviar`, formData);
  }

  // --- MÓDULO ADMINISTRADOR (RF09 / UC05) ---

  // 4. UC05 (Passo 2): Listar todos os documentos pendentes/submetidos no painel do Admin
  listarDocumentosAdmin(): Observable<DocumentoUsuario[]> {
    return this.http.get<DocumentoUsuario[]>(`${this.apiUrl}/admin/todos`);
  }

  // 5. UC05 (Fluxo Principal - Passo 6 e 7): Aprovar o documento e liberar o acesso sistêmico (RF10)
  aprovarDocumento(id: string): Observable<DocumentoUsuario> {
    return this.http.patch<DocumentoUsuario>(`${this.apiUrl}/admin/${id}/aprovar`, {});
  }

  // 6. UC05 (Fluxo Alternativo - Passo 3): Rejeitar o documento informando o motivo da recusa (RF08)
  rejeitarDocumento(id: string, motivoRejeicao: string): Observable<DocumentoUsuario> {
    return this.http.patch<DocumentoUsuario>(`${this.apiUrl}/admin/${id}/rejeitar`, {
      motivoRejeicao,
    });
  }
}
