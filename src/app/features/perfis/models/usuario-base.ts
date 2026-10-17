import { TipoConta } from '../../../core/enums/tipo-conta';

export interface UsuarioBase {
  id: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  fotoPerfilUrl?: string;
  tipoConta: TipoConta;
}
