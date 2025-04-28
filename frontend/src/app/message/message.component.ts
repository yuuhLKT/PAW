import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

interface Message {
  id: number;
  content: string;
  timestamp: Date;
  user: {
    id: number;
    username: string;
    imageUrl: string;
  };
}

interface User {
  _id: string;
  nome: string;
  email: string;
  senha: string;
  imagem: string;
}

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {
  messages: Message[] = [];
  newMessage: string = '';
  currentUser: User | null = null;
  private apiUrl = 'http://localhost:3000';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private localStorage: LocalStorageService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('userConnected');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return `${this.apiUrl}/images/padrao.png`;
    }
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `${this.apiUrl}/${cleanPath}`;
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = `${this.apiUrl}/images/padrao.png`;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      console.log('Sending message:', this.newMessage);
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userConnected');
    }
    this.router.navigate(['/login']);
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('imagem', file);

      fetch(`http://localhost:3000/api/usuarios/upload/${this.currentUser?._id}`, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (this.currentUser) {
            this.currentUser.imagem = data.imagem;
            this.localStorage.setItem('userConnected', this.currentUser);
          }
        })
        .catch(error => {
          console.error('Error uploading image:', error);
          alert('Erro ao fazer upload da imagem');
        });
    }
  }
}
