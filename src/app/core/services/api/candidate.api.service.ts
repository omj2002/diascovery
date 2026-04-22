import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Candidate, CandidateFilters, Page } from '../../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private readonly baseUrl = `${environment.apiUrl}/candidates`;

  constructor(private http: HttpClient) {}

  getCandidates(filters: CandidateFilters = {}): Observable<Page<Candidate>> {
    let params = new HttpParams();

    if (filters.search) params = params.set('search', filters.search);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.roleId) params = params.set('roleId', filters.roleId);
    if (filters.location) params = params.set('location', filters.location);
    if (filters.minExp !== undefined && filters.minExp !== null) params = params.set('minExp', filters.minExp.toString());
    if (filters.maxExp !== undefined && filters.maxExp !== null) params = params.set('maxExp', filters.maxExp.toString());
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.sort) params = params.set('sort', filters.sort);
    if (filters.page !== undefined) params = params.set('page', filters.page.toString());
    if (filters.size !== undefined) params = params.set('size', filters.size.toString());

    return this.http.get<Page<Candidate>>(this.baseUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getTopCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.baseUrl}/top-rated`).pipe(
      catchError(this.handleError)
    );
  }

  getCandidateById(id: string): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error('An error occurred while fetching candidate data.'));
  }
}
