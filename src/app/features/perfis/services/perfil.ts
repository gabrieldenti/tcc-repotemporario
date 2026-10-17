import { inject, Service } from '@angular/core';
import { CategoriaCNH } from '../../../core/enums/categoria-cnh';
import { PerfilInstrutor } from '../models/perfil-instrutor';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UsuarioBase } from '../models/usuario-base';
import { environment } from '../../../../environments/environment.development';
import { PerfilAluno } from '../models/perfil-aluno';

@Service()
export class Perfil {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/perfis`;

  /**
   * RF04: Permite a atualização dos dados cadastrais do usuário (Aluno ou Instrutor).
   */
  atualizarDadosCadastrais(
    usuarioId: string,
    dados: Partial<UsuarioBase>,
  ): Observable<UsuarioBase> {
    return this.http.put<UsuarioBase>(`${this.apiUrl}/usuario/${usuarioId}`, dados);
  }

  /**
   * Salva a cidade/região da Grande Vitória e as categorias de CNH desejadas pelo aluno.
   */
  salvarPreferenciasAluno(
    alunoId: string,
    dadosPreferencia: Partial<PerfilAluno>,
  ): Observable<PerfilAluno> {
    return this.http.put<PerfilAluno>(
      `${this.apiUrl}/aluno/${alunoId}/preferencias`,
      dadosPreferencia,
    );
  }

  /**
   * RF11, RF12 e RF13: Permite ao instrutor cadastrar/editar categorias de CNH (A-E),
   * valor da hora-aula, disponibilidade e status de visibilidade da oferta.
   */
  salvarServicosInstrutor(
    instrutorId: string,
    dadosServico: Partial<PerfilInstrutor>,
  ): Observable<PerfilInstrutor> {
    return this.http.put<PerfilInstrutor>(
      `${this.apiUrl}/instrutor/${instrutorId}/servicos`,
      dadosServico,
    );
  }

  /**
   * RF14, RF15 e RF16: Lista os instrutores aprovados e disponíveis na vitrine do aluno,
   * permitindo filtrar por Categoria da CNH e ordenar pelo valor da hora-aula.
   */
  listarInstrutoresDisponiveis(filtros?: {
    categoria?: CategoriaCNH;
    ordenarPorPreco?: 'asc' | 'desc';
    regiao?: string;
  }): Observable<PerfilInstrutor[]> {
    let params = new HttpParams();

    if (filtros?.categoria) {
      params = params.set('categoria', filtros.categoria);
    }
    if (filtros?.ordenarPorPreco) {
      params = params.set('ordenarPreco', filtros.ordenarPorPreco);
    }
    if (filtros?.regiao) {
      params = params.set('regiao', filtros.regiao);
    }

    return this.http.get<PerfilInstrutor[]>(`${this.apiUrl}/instrutores`, { params });
  }

  /**
   * Busca os dados completos de um instrutor específico para a tela "Perfil do Instrutor".
   */
  obterDetalhesInstrutor(instrutorId: string): Observable<PerfilInstrutor> {
    return this.http.get<PerfilInstrutor>(`${this.apiUrl}/instrutores/${instrutorId}`);
  }

  /**
   * RF17 e RF18: Formata e gera o deep link para a API do WhatsApp (wa.me)
   * com mensagem pré-formatada contendo os parâmetros do instrutor selecionado.
   */
  gerarLinkWhatsApp(telefone: string, nomeInstrutor: string, categoria?: CategoriaCNH): string {
    // Remove caracteres não numéricos (parênteses, espaços, traços)
    const numeroLimpo = telefone.replace(/\D/g, '');

    // Garante o código do país (55 para o Brasil)
    const numeroComDDI = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;

    const textoCategoria = categoria ? ` para a categoria ${categoria}` : '';
    const mensagem = `Olá ${nomeInstrutor}, encontrei seu perfil verificado na plataforma DirigeES e gostaria de saber mais sobre as aulas práticas${textoCategoria}.`;

    return `https://wa.me/${numeroComDDI}?text=${encodeURIComponent(mensagem)}`;
  }
}
