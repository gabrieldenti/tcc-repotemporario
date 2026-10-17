import { UsuarioBase } from './usuario-base';
import { CategoriaCNH } from '../../../core/enums/categoria-cnh';

export interface PerfilAluno extends UsuarioBase {
  regiaoBusca?: string;
  categoriasDesejadas: CategoriaCNH[];
}
