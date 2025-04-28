import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private http: HttpClient
  ) {}

  onSubmit() {
    const payload = {
      email: this.email,
      senha: this.password
    };

    this.http.post<any>('http://localhost:3000/api/usuarios/login', payload).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.localStorage.setItem('userConnected', response.user);
        this.router.navigate(['/message']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }
}
