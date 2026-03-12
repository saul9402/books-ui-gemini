import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/types';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="header">
      <h1>Books</h1>
      <button mat-raised-button color="primary" routerLink="/books/new">
        <mat-icon>add</mat-icon> New Book
      </button>
    </div>

    <table mat-table [dataSource]="books()" class="mat-elevation-z8">
      <ng-container matColumnDef="idBook">
        <th mat-header-cell *matHeaderCellDef> ID </th>
        <td mat-cell *matCellDef="let element"> {{element.idBook}} </td>
      </ng-container>

      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef> Title </th>
        <td mat-cell *matCellDef="let element"> {{element.title}} </td>
      </ng-container>

      <ng-container matColumnDef="isbn">
        <th mat-header-cell *matHeaderCellDef> ISBN </th>
        <td mat-cell *matCellDef="let element"> {{element.isbn}} </td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef> Status </th>
        <td mat-cell *matCellDef="let element">
          @if (element.status) {
            <mat-icon color="primary">check_circle</mat-icon>
          } @else {
            <mat-icon color="warn">cancel</mat-icon>
          }
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Actions </th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button color="accent" [routerLink]="['/books/edit', element.idBook]">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="delete(element.idBook)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
  `]
})
export class BookComponent implements OnInit {
  private bookService = inject(BookService);
  private snackBar = inject(MatSnackBar);

  books = signal<Book[]>([]);
  displayedColumns: string[] = ['idBook', 'title', 'isbn', 'status', 'actions'];

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.findAll().subscribe({
      next: (response) => {
        this.books.set(response.data);
      },
      error: () => {
        this.snackBar.open('Error loading books', 'Close', { duration: 3000 });
      }
    });
  }

  delete(id: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Book deleted successfully', 'Close', { duration: 3000 });
          this.loadBooks();
        },
        error: () => {
          this.snackBar.open('Error deleting book', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
