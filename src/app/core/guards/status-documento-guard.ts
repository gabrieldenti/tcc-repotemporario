import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { StatusDocumento } from '../enums/status-documento';

export const statusDocumentoGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (environment.demoMode === true) {
    return true;
  }

  const statusAtual = localStorage.getItem('statusDocumentacao') as StatusDocumento | null;

  if (statusAtual === StatusDocumento.Aprovado) {
    return true;
  }

  router.navigate(['/validacao-documental']);
  return false;
};
