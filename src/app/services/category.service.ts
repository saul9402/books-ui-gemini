import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, GenericResponse } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categories`;

  findAll(): Observable<GenericResponse<Category>> {
    return this.http.get<GenericResponse<Category>>(this.apiUrl);
  }

  findById(id: string): Observable<GenericResponse<Category>> {
    return this.http.get<GenericResponse<Category>>(`${this.apiUrl}/${id}`);
  }

  save(category: Category): Observable<void> {
    return this.http.post<void>(this.apiUrl, category);
  }

  update(id: string, category: Category): Observable<GenericResponse<Category>> {
    return this.http.put<GenericResponse<Category>>(`${this.apiUrl}/${id}`, category);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
