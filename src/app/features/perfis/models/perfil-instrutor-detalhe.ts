import { TipoConta } from '../../../core/enums/tipo-conta';
import { PerfilInstrutor } from './perfil-instrutor';

export type PerfilInstrutorDetalhe = Omit<
  PerfilInstrutor,
  'valorHora' | 'regioesAtendimento' | 'email' | 'tipoConta' | 'disponivelParaNovosAlunos'
> & {
  email?: string;
  tipoConta?: TipoConta;
  disponivelParaNovosAlunos?: boolean;
  telefone: string;
  localizacaoExibicao: string;
  statusCrlv: string;
  statusCredenciamento: string;
  tempoExperiencia: string;
  valorHoraAula: number;
};
