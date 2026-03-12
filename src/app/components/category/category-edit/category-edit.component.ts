import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/types';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <h1>{{ isEdit() ? 'Edit' : 'New' }} Category</h1>

      <form [formGroup]="form" (ngSubmit)="save()">
        <mat-form-field appearance="outline">
          <mat-label>Category Name</mat-label>
          <input matInput formControlName="categoryName" placeholder="Enter category name">
          @if (form.get('categoryName')?.hasError('required')) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <div class="checkbox-container">
          <mat-checkbox formControlName="status">Active</mat-checkbox>
        </div>

        <div class="actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Saving...' : 'Save' }}
          </button>
          <button mat-button type="button" routerLink="/categories">Cancel</button>
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
    .checkbox-container {
      margin-bottom: 10px;
    }
    .actions {
      display: flex;
      gap: 10px;
    }
  `]
})
export class CategoryEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  isEdit = signal(false);
  loading = signal(false);
  id = signal<string | null>(null);

  constructor() {
    this.form = this.fb.group({
      categoryName: ['', Validators.required],
      status: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      this.isEdit.set(true);
      this.loadCategory(id);
    }
  }

  loadCategory(id: string): void {
    this.categoryService.findById(id).subscribe({
      next: (response) => {
        if (response.data.length > 0) {
          const category = response.data[0];
          this.form.patchValue({
            categoryName: category.categoryName,
            status: category.status
          });
        }
      },
      error: () => {
        this.snackBar.open('Error loading category', 'Close', { duration: 3000 });
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    const category: Category = this.form.value;

    if (this.isEdit()) {
      this.categoryService.update(this.id()!, category).subscribe({
        next: () => {
          this.snackBar.open('Category updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/categories']);
        },
        error: () => {
          this.loading.set(false);
          this.snackBar.open('Error updating category', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.categoryService.save(category).subscribe({
        next: () => {
          this.snackBar.open('Category created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/categories']);
        },
        error: () => {
          this.loading.set(false);
          this.snackBar.open('Error creating category', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
