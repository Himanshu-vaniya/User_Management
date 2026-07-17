import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage';
import { LoginRequest } from '../../shared/models/login-request.model';
import { ApiResponse } from '../../shared/models/api-response.model';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/app.constants';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authState: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router
  ) {
    this.authState = new BehaviorSubject<boolean>(this.hasToken());
  }

  login(credentials: LoginRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}${API_ENDPOINTS.LOGIN}`, credentials).pipe(
      tap((response: ApiResponse) => {
        if (response.success && response.token) {
          this.storage.setItem(STORAGE_KEYS.TOKEN, response.token);
          this.authState.next(true);
        }
      })
    );
  }

  logout(): void {
    this.storage.removeItem(STORAGE_KEYS.TOKEN);
    this.authState.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.storage.getItem(STORAGE_KEYS.TOKEN);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  isAuthenticatedSync(): boolean {
    return this.authState.value;
  }

  private hasToken(): boolean {
    return !!this.storage.getItem(STORAGE_KEYS.TOKEN);
  }
}
