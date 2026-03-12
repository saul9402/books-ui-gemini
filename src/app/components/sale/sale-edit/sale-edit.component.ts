import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SaleService } from '../../../services/sale.service';
import { ClientService } from '../../../services/client.service';
import { BookService } from '../../../services/book.service';
import { Sale, Client, Book, SaleDetail } from '../../../models/types';

@Component({
  selector: 'app-sale-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <h1>New Sale</h1>

      <form [formGroup]="form" (ngSubmit)="save()">
        <mat-form-field appearance="outline">
          <mat-label>Client</mat-label>
          <mat-select formControlName="client">
            @for (cli of clients(); track cli.idClient) {
              <mat-option [value]="cli">{{cli.firstName}} {{cli.surname}}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="detail-adder">
          <mat-form-field appearance="outline">
            <mat-label>Book</mat-label>
            <mat-select #bookSelect>
              @for (b of books(); track b.idBook) {
                <mat-option [value]="b">{{b.title}}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Quantity</mat-label>
            <input matInput type="number" #qtyInput value="1">
          </mat-form-field>

          <button mat-mini-fab color="accent" type="button" (click)="addDetail(bookSelect.value, qtyInput.value)">
            <mat-icon>add</mat-icon>
          </button>
        </div>

        <table mat-table [dataSource]="details().controls" class="mat-elevation-z2">
          <ng-container matColumnDef="book">
            <th mat-header-cell *matHeaderCellDef> Book </th>
            <td mat-cell *matCellDef="let control"> {{control.value.book.title}} </td>
          </ng-container>

          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef> Quantity </th>
            <td mat-cell *matCellDef="let control"> {{control.value.quantity}} </td>
          </ng-container>

          <ng-container matColumnDef="unitPrice">
            <th mat-header-cell *matHeaderCellDef> Unit Price </th>
            <td mat-cell *matCellDef="let control"> {{control.value.unitPrice | currency}} </td>
          </ng-container>

          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef> Total </th>
            <td mat-cell *matCellDef="let control"> {{control.value.quantity * control.value.unitPrice | currency}} </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let i = index">
              <button mat-icon-button color="warn" type="button" (click)="removeDetail(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div class="total">
          <h2>Total: {{ calculateTotal() | currency }}</h2>
        </div>

        <div class="actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || details().length === 0 || loading()">
            {{ loading() ? 'Saving...' : 'Save Sale' }}
          </button>
          <button mat-button type="button" routerLink="/sales">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .detail-adder {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    table {
      width: 100%;
      margin-top: 20px;
    }
    .total {
      text-align: right;
      margin-top: 20px;
    }
    .actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class SaleEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private saleService = inject(SaleService);
  private clientService = inject(ClientService);
  private bookService = inject(BookService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  loading = signal(false);
  clients = signal<Client[]>([]);
  books = signal<Book[]>([]);
  displayedColumns: string[] = ['book', 'quantity', 'unitPrice', 'total', 'actions'];

  constructor() {
    this.form = this.fb.group({
      client: [null, Validators.required],
      details: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.clientService.findAll().subscribe(res => this.clients.set(res.data));
    this.bookService.findAll().subscribe(res => this.books.set(res.data));
  }

  details(): FormArray {
    return this.form.get('details') as FormArray;
  }

  addDetail(book: Book, quantity: string): void {
    if (!book || !quantity) return;

    const qty = parseInt(quantity);
    if (qty <= 0) return;

    // In a real app, unitPrice would come from the book object. 
    // Since Book interface doesn't have price, I'll use a dummy price of 25.0
    const detailGroup = this.fb.group({
      book: [book, Validators.required],
      quantity: [qty, [Validators.required, Validators.min(1)]],
      unitPrice: [25.0, Validators.required],
      status: [true]
    });

    this.details().push(detailGroup);
  }

  removeDetail(index: number): void {
    this.details().removeAt(index);
  }

  calculateTotal(): number {
    return this.details().controls.reduce((acc, control) => {
      return acc + (control.value.quantity * control.value.unitPrice);
    }, 0);
  }

  save(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    const formValue = this.form.value;

    const sale: Sale = {
      client: formValue.client,
      momentSale: new Date().toISOString(),
      totalSale: this.calculateTotal(),
      statusSale: true,
      details: formValue.details
    };

    this.saleService.save(sale).subscribe({
      next: () => {
        this.snackBar.open('Sale created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/sales']);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Error creating sale', 'Close', { duration: 3000 });
      }
    });
  }
}
