import { StatusDocumento } from '../../../core/enums/status-documento';
import { TipoConta } from '../../../core/enums/tipo-conta';

export interface AuthResponse {
  token: string;
  idUsuario: string;
  tipoUsuario: TipoConta;
  statusDocumentacao: StatusDocumento;
}
