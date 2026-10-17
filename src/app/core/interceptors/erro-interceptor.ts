import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const erroInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (erro.status === 401) {
        // Erro 401: Não autorizado (Sessão expirou ou token inválido)
        localStorage.removeItem('token');
        router.navigate(['/login']);
      } else if (erro.status === 500) {
        // Erro 500: Erro interno no servidor
        console.error('Erro no servidor:', erro.message);
        alert('Ocorreu um problema de comunicação com o servidor. Tente novamente mais tarde.');
      } else {
        console.error('Ocorreu um erro inesperado:', erro.message);
      }
      return throwError(() => erro);
    }),
  );
};
