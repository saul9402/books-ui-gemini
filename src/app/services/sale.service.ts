import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sale, GenericResponse } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sales`;

  findAll(): Observable<GenericResponse<Sale>> {
    return this.http.get<GenericResponse<Sale>>(this.apiUrl);
  }

  findById(id: string): Observable<GenericResponse<Sale>> {
    return this.http.get<GenericResponse<Sale>>(`${this.apiUrl}/${id}`);
  }

  save(sale: Sale): Observable<void> {
    return this.http.post<void>(this.apiUrl, sale);
  }

  update(id: string, sale: Sale): Observable<GenericResponse<Sale>> {
    return this.http.put<GenericResponse<Sale>>(`${this.apiUrl}/${id}`, sale);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
