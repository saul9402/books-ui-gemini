import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Author, GenericResponse } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/authors`;

  findAll(): Observable<GenericResponse<Author>> {
    return this.http.get<GenericResponse<Author>>(this.apiUrl);
  }

  findById(id: string): Observable<GenericResponse<Author>> {
    return this.http.get<GenericResponse<Author>>(`${this.apiUrl}/${id}`);
  }

  save(author: Author): Observable<void> {
    return this.http.post<void>(this.apiUrl, author);
  }

  update(id: string, author: Author): Observable<GenericResponse<Author>> {
    return this.http.put<GenericResponse<Author>>(`${this.apiUrl}/${id}`, author);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
