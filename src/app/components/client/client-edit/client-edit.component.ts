import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/types';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <h1>{{ isEdit() ? 'Edit' : 'New' }} Client</h1>

      <form [formGroup]="form" (ngSubmit)="save()">
        <mat-form-field appearance="outline">
          <mat-label>First Name</mat-label>
          <input matInput formControlName="firstName" placeholder="Enter first name">
          @if (form.get('firstName')?.hasError('required')) {
            <mat-error>First name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Surname</mat-label>
          <input matInput formControlName="surname" placeholder="Enter surname">
          @if (form.get('surname')?.hasError('required')) {
            <mat-error>Surname is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Birth Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="birthDateClient">
          <mat-hint>MM/DD/YYYY</mat-hint>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          @if (form.get('birthDateClient')?.hasError('required')) {
            <mat-error>Birth date is required</mat-error>
          }
        </mat-form-field>

        <div class="actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Saving...' : 'Save' }}
          </button>
          <button mat-button type="button" routerLink="/clients">Cancel</button>
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
export class ClientEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  isEdit = signal(false);
  loading = signal(false);
  id = signal<string | null>(null);

  constructor() {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      birthDateClient: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      this.isEdit.set(true);
      this.loadClient(id);
    }
  }

  loadClient(id: string): void {
    this.clientService.findById(id).subscribe({
      next: (response) => {
        if (response.data.length > 0) {
          const client = response.data[0];
          this.form.patchValue({
            firstName: client.firstName,
            surname: client.surname,
            birthDateClient: new Date(client.birthDateClient)
          });
        }
      },
      error: () => {
        this.snackBar.open('Error loading client', 'Close', { duration: 3000 });
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    const formValue = this.form.value;
    
    // Format date to YYYY-MM-DD
    const birthDate = formValue.birthDateClient instanceof Date 
      ? formValue.birthDateClient.toISOString().split('T')[0]
      : formValue.birthDateClient;

    const client: Client = {
      ...formValue,
      birthDateClient: birthDate
    };

    if (this.isEdit()) {
      this.clientService.update(this.id()!, client).subscribe({
        next: () => {
          this.snackBar.open('Client updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/clients']);
        },
        error: () => {
          this.loading.set(false);
          this.snackBar.open('Error updating client', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.clientService.save(client).subscribe({
        next: () => {
          this.snackBar.open('Client created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/clients']);
        },
        error: () => {
          this.loading.set(false);
          this.snackBar.open('Error creating client', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
