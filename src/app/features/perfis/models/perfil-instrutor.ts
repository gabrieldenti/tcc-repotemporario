import { CategoriaCNH } from '../../../core/enums/categoria-cnh';
import { UsuarioBase } from './usuario-base';

export interface PerfilInstrutor extends UsuarioBase {
  biografia?: string;
  categoriasAtendidas: CategoriaCNH[];
  valorHora: number;
  regioesAtendimento: string[];
  disponivelParaNovosAlunos: boolean;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  disponibilidadeSemanal: Record<string, string[]>;
}
