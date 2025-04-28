import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {
  messages: Message[] = [];
  newMessage: string = '';
  currentUser: User | null = null;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      console.log('Sending message:', this.newMessage);
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.router.navigate(['/login']);
  }
}
