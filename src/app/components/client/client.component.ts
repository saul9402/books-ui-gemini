import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/types';

@Component({
  selector: 'app-client',
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
      <h1>Clients</h1>
      <button mat-raised-button color="primary" routerLink="/clients/new">
        <mat-icon>add</mat-icon> New Client
      </button>
    </div>

    <table mat-table [dataSource]="clients()" class="mat-elevation-z8">
      <ng-container matColumnDef="idClient">
        <th mat-header-cell *matHeaderCellDef> ID </th>
        <td mat-cell *matCellDef="let element"> {{element.idClient}} </td>
      </ng-container>

      <ng-container matColumnDef="firstName">
        <th mat-header-cell *matHeaderCellDef> First Name </th>
        <td mat-cell *matCellDef="let element"> {{element.firstName}} </td>
      </ng-container>

      <ng-container matColumnDef="surname">
        <th mat-header-cell *matHeaderCellDef> Surname </th>
        <td mat-cell *matCellDef="let element"> {{element.surname}} </td>
      </ng-container>

      <ng-container matColumnDef="birthDateClient">
        <th mat-header-cell *matHeaderCellDef> Birth Date </th>
        <td mat-cell *matCellDef="let element"> {{element.birthDateClient}} </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Actions </th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button color="accent" [routerLink]="['/clients/edit', element.idClient]">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="delete(element.idClient)">
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
export class ClientComponent implements OnInit {
  private clientService = inject(ClientService);
  private snackBar = inject(MatSnackBar);

  clients = signal<Client[]>([]);
  displayedColumns: string[] = ['idClient', 'firstName', 'surname', 'birthDateClient', 'actions'];

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.findAll().subscribe({
      next: (response) => {
        this.clients.set(response.data);
      },
      error: () => {
        this.snackBar.open('Error loading clients', 'Close', { duration: 3000 });
      }
    });
  }

  delete(id: string): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Client deleted successfully', 'Close', { duration: 3000 });
          this.loadClients();
        },
        error: () => {
          this.snackBar.open('Error deleting client', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
