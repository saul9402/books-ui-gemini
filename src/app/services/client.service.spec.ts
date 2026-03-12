import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientService } from './client.service';
import { environment } from '../../environments/environment';
import { GenericResponse, Client } from '../models/types';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService]
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return all clients', () => {
    const mockResponse: GenericResponse<Client> = {
      status: 200,
      message: 'success',
      data: [
        { idClient: '1', firstName: 'John', surname: 'Doe', birthDateClient: '1990-01-01' }
      ]
    };

    service.findAll().subscribe(response => {
      expect(response.data.length).toBe(1);
      expect(response.data[0].firstName).toBe('John');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clients`);
    req.flush(mockResponse);
  });
});
