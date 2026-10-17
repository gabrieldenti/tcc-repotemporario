import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { statusDocumentoGuard } from './status-documento-guard';

describe('statusDocumentoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => statusDocumentoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
