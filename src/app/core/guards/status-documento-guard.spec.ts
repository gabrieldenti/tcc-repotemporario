import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StatusDocumento } from '../enums/status-documento';
import { statusDocumentoGuard } from './status-documento-guard';

describe('statusDocumentoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => statusDocumentoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    environment.demoMode = true;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access in demo mode even when status is pending', () => {
    localStorage.setItem('statusDocumentacao', StatusDocumento.Pendente);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const resultado = executeGuard({} as never, {} as never);

    expect(resultado).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
