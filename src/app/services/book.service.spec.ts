import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookService } from './book.service';
import { environment } from '../../environments/environment';
import { GenericResponse, Book } from '../models/types';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService]
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all books', () => {
    const mockResponse: GenericResponse<Book> = {
      status: 200,
      message: 'success',
      data: [
        { idBook: '1', title: 'Angular 20 Guide', isbn: '1234', idAuthor: 'A1', idCategory: 'C1', photoUrl: '', status: true }
      ]
    };

    service.findAll().subscribe(response => {
      expect(response.data.length).toBe(1);
      expect(response.data[0].title).toBe('Angular 20 Guide');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/books`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
