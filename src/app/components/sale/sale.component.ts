import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SaleService } from '../../services/sale.service';
import { Sale } from '../../models/types';

@Component({
  selector: 'app-sale',
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
      <h1>Sales</h1>
      <button mat-raised-button color="primary" routerLink="/sales/new">
        <mat-icon>add</mat-icon> New Sale
      </button>
    </div>

    <table mat-table [dataSource]="sales()" class="mat-elevation-z8">
      <ng-container matColumnDef="idSale">
        <th mat-header-cell *matHeaderCellDef> ID </th>
        <td mat-cell *matCellDef="let element"> {{element.idSale}} </td>
      </ng-container>

      <ng-container matColumnDef="client">
        <th mat-header-cell *matHeaderCellDef> Client </th>
        <td mat-cell *matCellDef="let element"> {{element.client.firstName}} {{element.client.surname}} </td>
      </ng-container>

      <ng-container matColumnDef="momentSale">
        <th mat-header-cell *matHeaderCellDef> Date </th>
        <td mat-cell *matCellDef="let element"> {{element.momentSale | date:'medium'}} </td>
      </ng-container>

      <ng-container matColumnDef="totalSale">
        <th mat-header-cell *matHeaderCellDef> Total </th>
        <td mat-cell *matCellDef="let element"> {{element.totalSale | currency}} </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Actions </th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button color="warn" (click)="delete(element.idSale)">
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
export class SaleComponent implements OnInit {
  private saleService = inject(SaleService);
  private snackBar = inject(MatSnackBar);

  sales = signal<Sale[]>([]);
  displayedColumns: string[] = ['idSale', 'client', 'momentSale', 'totalSale', 'actions'];

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.saleService.findAll().subscribe({
      next: (response) => {
        this.sales.set(response.data);
      },
      error: () => {
        this.snackBar.open('Error loading sales', 'Close', { duration: 3000 });
      }
    });
  }

  delete(id: string): void {
    if (confirm('Are you sure you want to delete this sale?')) {
      this.saleService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Sale deleted successfully', 'Close', { duration: 3000 });
          this.loadSales();
        },
        error: () => {
          this.snackBar.open('Error deleting sale', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
