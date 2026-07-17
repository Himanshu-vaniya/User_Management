import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { API_ENDPOINTS } from '../constants/app.constants';
import { LoadingService } from '../services/loading';
import { NotificationService } from '../services/notification';
import { catchError, throwError, finalize } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const loadingService = inject(LoadingService);
  const notificationService = inject(NotificationService);
  const token = authService.getToken();

  let authReq = req;

  // Show the global spinner loader
  loadingService.show();

  if (token && !req.url.includes(API_ENDPOINTS.LOGIN)) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'An unexpected error occurred. Please try again.';

      if (error.status === 401) {
        if (!req.url.includes(API_ENDPOINTS.LOGIN)) {
          errorMsg = 'Session expired. Please log in again.';
          notificationService.error(errorMsg);
          authService.logout();
        }
      } else {
        if (error.error && error.error.message) {
          errorMsg = error.error.message;
        } else {
          switch (error.status) {
            case 0:
              errorMsg = 'Network error. Please check your internet connection.';
              break;
            case 400:
              errorMsg = 'Invalid request. Please check the provided data.';
              break;
            case 403:
              errorMsg = 'You do not have permission to perform this action.';
              break;
            case 404:
              errorMsg = 'Requested resource not found.';
              break;
            case 409:
              errorMsg = 'A conflict occurred. The record might already exist.';
              break;
            case 500:
              errorMsg = 'Server error. Please try again later.';
              break;
            default:
              errorMsg = `Error ${error.status}: ${error.statusText || 'Unknown error occurred.'}`;
              break;
          }
        }
        notificationService.error(errorMsg);
      }

      return throwError(() => error);
    }),
    finalize(() => {
      // Hide the global spinner loader
      loadingService.hide();
    })
  );
};
