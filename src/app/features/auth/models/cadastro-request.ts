import { TipoConta } from '../../../core/enums/tipo-conta';

export interface CadastroRequest {
  tipoConta: TipoConta;
  nomeCompleto: string;
  cpf: string;
  email: string;
  senha?: string;
  telefone: string;
}
