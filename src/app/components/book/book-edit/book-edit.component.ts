import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookService } from '../../../services/book.service';
import { CategoryService } from '../../../services/category.service';
import { AuthorService } from '../../../services/author.service';
import { Book, Category, Author } from '../../../models/types';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <h1>{{ isEdit() ? 'Edit' : 'New' }} Book</h1>

      <form [formGroup]="form" (ngSubmit)="save()">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Enter book title">
          @if (form.get('title')?.hasError('required')) {
            <mat-error>Title is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>ISBN</mat-label>
          <input matInput formControlName="isbn" placeholder="Enter ISBN">
          @if (form.get('isbn')?.hasError('required')) {
            <mat-error>ISBN is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Photo URL</mat-label>
          <input matInput formControlName="photoUrl" placeholder="Enter photo URL">
          @if (form.get('photoUrl')?.hasError('required')) {
            <mat-error>Photo URL is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select formControlName="idCategory">
            @for (cat of categories(); track cat.idCategory) {
              <mat-option [value]="cat.idCategory">{{cat.categoryName}}</mat-option>
            }
          </mat-select>
          @if (form.get('idCategory')?.hasError('required')) {
            <mat-error>Category is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Author</mat-label>
          <mat-select formControlName="idAuthor">
            @for (aut of authors(); track aut.idAuthor) {
              <mat-option [value]="aut.idAuthor">{{aut.firstName}} {{aut.lastName}}</mat-option>
            }
          </mat-select>
          @if (form.get('idAuthor')?.hasError('required')) {
            <mat-error>Author is required</mat-error>
          }
        </mat-form-field>

        <div class="checkbox-container">
          <mat-checkbox formControlName="status">Active</mat-checkbox>
        </div>

        <div class="actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Saving...' : 'Save' }}
          </button>
          <button mat-button type="button" routerLink="/books">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .actions {
      display: flex;
      gap: 10px;
    }
  `]
})
export class BookEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private categoryService = inject(CategoryService);
  private authorService = inject(AuthorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  isEdit = signal(false);
  loading = signal(false);
  id = signal<string | null>(null);
  categories = signal<Category[]>([]);
  authors = signal<Author[]>([]);

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      isbn: ['', Validators.required],
      photoUrl: ['', Validators.required],
      idCategory: ['', Validators.required],
      idAuthor: ['', Validators.required],
      status: [true]
    });
  }

  ngOnInit(): void {
    this.loadDropdowns();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      this.isEdit.set(true);
      this.loadBook(id);
    }
  }

  loadDropdowns(): void {
    this.categoryService.findAll().subscribe(res => this.categories.set(res.data));
    this.authorService.findAll().subscribe(res => this.authors.set(res.data));
  }

  loadBook(id: string): void {
    this.bookService.findById(id).subscribe({
      next: (response) => {
        if (response.data.length > 0) {
          const book = response.data[0];
          this.form.patchValue(book);
        }
      },
      error: () => {
        this.snackBar.open('Error loading book', 'Close', { duration: 3000 });
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    const book: Book = this.form.value;

    if (this.isEdit()) {
      this.bookService.update(this.id()!, book).subscribe({
        next: () => {
          this.snackBar.open('Book updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/books']);
        },
        error: () => {
          this.loading.set(false);
          this.snackBar.open('Error updating book', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.bookService.save(book).subscribe({
        next: () => {
          this.snackBar.open('Book created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/books']);
        },
        error: () => {
          this.loading.set(false);
          this.snackBar.open('Error creating book', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
