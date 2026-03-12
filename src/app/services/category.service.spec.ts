import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { environment } from '../../environments/environment';
import { GenericResponse, Category } from '../models/types';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all categories', () => {
    const mockResponse: GenericResponse<Category> = {
      status: 200,
      message: 'success',
      data: [
        { idCategory: '1', categoryName: 'Test Category', status: true }
      ]
    };

    service.findAll().subscribe(response => {
      expect(response.data.length).toBe(1);
      expect(response.data[0].categoryName).toBe('Test Category');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
