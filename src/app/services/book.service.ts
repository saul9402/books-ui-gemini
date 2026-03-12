import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Book, GenericResponse } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/books`;

  findAll(): Observable<GenericResponse<Book>> {
    return this.http.get<GenericResponse<Book>>(this.apiUrl);
  }

  findById(id: string): Observable<GenericResponse<Book>> {
    return this.http.get<GenericResponse<Book>>(`${this.apiUrl}/${id}`);
  }

  save(book: Book): Observable<void> {
    return this.http.post<void>(this.apiUrl, book);
  }

  update(id: string, book: Book): Observable<GenericResponse<Book>> {
    return this.http.put<GenericResponse<Book>>(`${this.apiUrl}/${id}`, book);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBooksByCategory(category: string): Observable<GenericResponse<Book>> {
    return this.http.get<GenericResponse<Book>>(`${this.apiUrl}/byCategory`, {
      params: { category }
    });
  }
}
