import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import type { DocumentoUsuario } from '../models/documento-usuario';
import { Observable } from 'rxjs';

@Service()
export class Documento {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/documentos`;

  /**
   * Envia um arquivo físico (LADV, CNH, CRLV) para o backend,
   * que posteriormente fará a persistência na nuvem (Cloudinary).
   */
  enviarDocumento(
    arquivo: File,
    tipoDocumento: string,
    usuarioId: string,
  ): Observable<DocumentoUsuario> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('tipoDocumento', tipoDocumento);
    formData.append('usuarioId', usuarioId);

    // O Angular detecta o FormData e configura o cabeçalho 'multipart/form-data' automaticamente
    return this.http.post<DocumentoUsuario>(`${this.apiUrl}/upload`, formData);
  }

  /**
   * Consulta o status atual da documentação do usuário
   * para liberar ou bloquear o acesso às funcionalidades da plataforma (RF10).
   */
  obterStatusDocumentacao(usuarioId: string): Observable<DocumentoUsuario[]> {
    return this.http.get<DocumentoUsuario[]>(`${this.apiUrl}/status/${usuarioId}`);
  }
}
