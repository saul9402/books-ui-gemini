import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SaleService } from './sale.service';
import { environment } from '../../environments/environment';
import { GenericResponse, Sale } from '../models/types';

describe('SaleService', () => {
  let service: SaleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SaleService]
    });
    service = TestBed.inject(SaleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create a sale', () => {
    const mockSale: Sale = {
      client: { idClient: '1', firstName: 'John', surname: 'Doe', birthDateClient: '1990-01-01' },
      momentSale: '2023-10-10',
      totalSale: 100,
      statusSale: true,
      details: []
    };

    service.save(mockSale).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/sales`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
