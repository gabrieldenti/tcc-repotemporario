import { StatusDocumento } from '../../../core/enums/status-documento';
import { TipoConta } from '../../../core/enums/tipo-conta';

export interface DocumentoUsuario {
  id: string;
  usuarioId: string;
  tipoDocumento: 'LADV' | 'CRLV' | 'CredencialDetran' | 'Identidade';
  arquivoUrl: string;
  status: StatusDocumento;
  dataEnvio: string;
  dataValidade?: string;
  nomeUsuario?: string;
  cpfUsuario?: string;
  tipoConta?: TipoConta;
  motivoRejeicao?: string;
}
