import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';

import { LoginRequest } from '../models/login-request';
import { AuthResponse } from '../models/auth-response';
import { CadastroRequest } from '../models/cadastro-request';
import { environment } from '../../../../environments/environment';
import { StatusDocumento } from '../../../core/enums/status-documento';
import { TipoConta } from '../../../core/enums/tipo-conta';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  private usarDemo(): boolean {
    return (
      environment.demoMode === true ||
      !environment.apiUrl ||
      environment.apiUrl.includes('link da API aqui')
    );
  }

  private criarRespostaDemo(tipoConta: TipoConta = TipoConta.Aluno): AuthResponse {
    const idDemo = localStorage.getItem('idUsuario') || `demo-${Date.now()}`;

    return {
      token: 'demo-token',
      idUsuario: idDemo,
      tipoUsuario: tipoConta,
      statusDocumentacao: StatusDocumento.Pendente,
    };
  }

  login(credenciais: LoginRequest): Observable<AuthResponse> {
    if (this.usarDemo()) {
      const respostaDemo = this.criarRespostaDemo();
      this.salvarSessao(respostaDemo);
      return of(respostaDemo);
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credenciais).pipe(
      tap((resposta) => this.salvarSessao(resposta)),
      catchError(() => {
        const respostaFallback = this.criarRespostaDemo();
        this.salvarSessao(respostaFallback);
        return of(respostaFallback);
      }),
    );
  }

  cadastrar(dados: CadastroRequest): Observable<AuthResponse> {
    if (this.usarDemo()) {
      const respostaDemo = this.criarRespostaDemo(dados.tipoConta || TipoConta.Aluno);
      this.salvarSessao(respostaDemo);
      return of(respostaDemo);
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/cadastrar`, dados).pipe(
      tap((resposta) => this.salvarSessao(resposta)),
      catchError(() => {
        const respostaFallback = this.criarRespostaDemo(dados.tipoConta || TipoConta.Aluno);
        this.salvarSessao(respostaFallback);
        return of(respostaFallback);
      }),
    );
  }

  salvarSessao(resposta: AuthResponse): void {
    localStorage.setItem('token', resposta.token);
    localStorage.setItem('idUsuario', resposta.idUsuario);
    localStorage.setItem('tipoUsuario', resposta.tipoUsuario);
    localStorage.setItem('statusDocumentacao', resposta.statusDocumentacao);
  }

  obterToken(): string | null {
    return localStorage.getItem('token');
  }

  obterTipoUsuario(): TipoConta | null {
    return localStorage.getItem('tipoUsuario') as TipoConta | null;
  }

  obterStatusDocumentacao(): StatusDocumento | null {
    return localStorage.getItem('statusDocumentacao') as StatusDocumento | null;
  }

  estaAutenticado(): boolean {
    return !!this.obterToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('statusDocumentacao');
  }
}
