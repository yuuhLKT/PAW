import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  messages: Message[] = [];
  newMessage: string = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      console.log('Sending message:', this.newMessage);
    }
  }

  logout() {
    console.log('Logout clicked');
  }
}
