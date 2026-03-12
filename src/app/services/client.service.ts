import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Client, GenericResponse } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clients`;

  findAll(): Observable<GenericResponse<Client>> {
    return this.http.get<GenericResponse<Client>>(this.apiUrl);
  }

  findById(id: string): Observable<GenericResponse<Client>> {
    return this.http.get<GenericResponse<Client>>(`${this.apiUrl}/${id}`);
  }

  save(client: Client): Observable<void> {
    return this.http.post<void>(this.apiUrl, client);
  }

  update(id: string, client: Client): Observable<GenericResponse<Client>> {
    return this.http.put<GenericResponse<Client>>(`${this.apiUrl}/${id}`, client);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
