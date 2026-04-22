import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface LoginResponse {
  token: string;
  userId: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials);
  }

  register(userData: any): Observable<string> {
    // Backend returns plain text on success (e.g. "User registered successfully")
    return this.http.post<string>(`${this.baseUrl}/register`, userData, {
      responseType: 'text' as 'json',
    });
  }

  getCurrentUser(): any {
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('userName') || 'User';
    const email = localStorage.getItem('userEmail') || '';
    const role = localStorage.getItem('userRole') || 'buyer';
    
    if (!userId) return null;
    return { id: userId, name, email, role };
  }
}
