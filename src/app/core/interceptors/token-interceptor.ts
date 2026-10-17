import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obterToken(); // Puxa o token salvo no LocalStorage

  if (token) {
    // Se o token existir, clona a requisição original e adiciona o cabeçalho de autorização
    const reqClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(reqClonada);
  }

  // Se não houver token (ex: tela de login), envia a requisição normalmente
  return next(req);
};
