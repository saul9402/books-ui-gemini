import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  {
    path: 'books',
    loadComponent: () => import('./components/book/book.component').then(m => m.BookComponent)
  },
  {
    path: 'books/new',
    loadComponent: () => import('./components/book/book-edit/book-edit.component').then(m => m.BookEditComponent)
  },
  {
    path: 'books/edit/:id',
    loadComponent: () => import('./components/book/book-edit/book-edit.component').then(m => m.BookEditComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./components/category/category.component').then(m => m.CategoryComponent)
  },
  {
    path: 'categories/new',
    loadComponent: () => import('./components/category/category-edit/category-edit.component').then(m => m.CategoryEditComponent)
  },
  {
    path: 'categories/edit/:id',
    loadComponent: () => import('./components/category/category-edit/category-edit.component').then(m => m.CategoryEditComponent)
  },
  {
    path: 'clients',
    loadComponent: () => import('./components/client/client.component').then(m => m.ClientComponent)
  },
  {
    path: 'clients/new',
    loadComponent: () => import('./components/client/client-edit/client-edit.component').then(m => m.ClientEditComponent)
  },
  {
    path: 'clients/edit/:id',
    loadComponent: () => import('./components/client/client-edit/client-edit.component').then(m => m.ClientEditComponent)
  },
  {
    path: 'sales',
    loadComponent: () => import('./components/sale/sale.component').then(m => m.SaleComponent)
  },
  {
    path: 'sales/new',
    loadComponent: () => import('./components/sale/sale-edit/sale-edit.component').then(m => m.SaleEditComponent)
  }
];
