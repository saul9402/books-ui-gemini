export interface GenericResponse<T> {
  status: number;
  message: string;
  data: T[];
}

export interface Author {
  idAuthor?: string;
  firstName: string;
  lastName: string;
  country: string;
}

export interface Category {
  idCategory?: string;
  categoryName: string;
  status: boolean;
}

export interface Book {
  idBook?: string;
  idCategory: string;
  idAuthor: string;
  title: string;
  isbn: string;
  photoUrl: string;
  status: boolean;
}

export interface Client {
  idClient?: string;
  firstName: string;
  surname: string;
  birthDateClient: string;
}

export interface SaleDetail {
  book: Book;
  unitPrice: number;
  quantity: number;
  status: boolean;
}

export interface Sale {
  idSale?: string;
  client: Client;
  momentSale: string;
  totalSale: number;
  statusSale: boolean;
  details: SaleDetail[];
}
