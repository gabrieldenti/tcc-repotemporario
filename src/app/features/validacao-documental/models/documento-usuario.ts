import { StatusDocumento } from '../../../core/enums/status-documento';

export interface DocumentoUsuario {
  id: string;
  usuarioId: string;
  tipoDocumento: 'LADV' | 'CRLV' | 'CredencialDetran' | 'Identidade';
  arquivoUrl: string;
  status: StatusDocumento;
  dataEnvio: string;
  dataValidade?: string;
}
