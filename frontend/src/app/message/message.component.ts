import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

interface MessageUser {
  _id: string;
  nome: string;
  imagem: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  user: MessageUser;
  isEditing?: boolean;
  editedContent?: string;
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
export class MessageComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  newMessage: string = '';
  currentUser: User | null = null;
  private apiUrl = 'http://localhost:3000';
  userCache: { [key: string]: MessageUser } = {};
  private pollingSubscription?: Subscription;

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
        this.loadMessages();

        // Iniciar polling a cada 3 segundos
        this.pollingSubscription = interval(3000).subscribe(() => {
          this.loadMessages();
        });
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  ngOnDestroy() {
    // Limpar a subscription quando o componente for destruído
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadMessages() {
    this.http.get(`${this.apiUrl}/api/mensagens`)
      .subscribe({
        next: async (response: any) => {
          const messagesPromises = response.map(async (msg: any) => {
            let user = this.userCache[msg.autorId];

            if (!user) {
              try {
                const userData: any = await this.http.get(`${this.apiUrl}/api/usuarios/${msg.autorId}`).toPromise();
                user = {
                  _id: userData._id,
                  nome: userData.nome,
                  imagem: userData.imagem || '/images/padrao.png'
                };
                this.userCache[msg.autorId] = user;
              } catch (error) {
                console.error('Error loading user:', error);
                user = {
                  _id: msg.autorId,
                  nome: 'Usuário',
                  imagem: '/images/padrao.png'
                };
              }
            }

            return {
              id: msg._id,
              content: msg.texto,
              timestamp: new Date(),
              user: user
            };
          });

          this.messages = await Promise.all(messagesPromises);
        },
        error: (error) => {
          console.error('Error loading messages:', error);
          alert('Erro ao carregar mensagens');
        }
      });
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
    if (this.newMessage.trim() && this.currentUser?._id) {
      const messageData = {
        texto: this.newMessage,
        autorId: this.currentUser._id
      };

      this.http.post(`${this.apiUrl}/api/mensagens`, messageData)
        .subscribe({
          next: (response: any) => {
            this.messages.push({
              id: response._id,
              content: response.texto,
              timestamp: new Date(),
              user: {
                _id: this.currentUser!._id,
                nome: this.currentUser!.nome,
                imagem: this.currentUser!.imagem || '/images/padrao.png'
              }
            });
            this.newMessage = '';
          },
          error: (error) => {
            console.error('Error sending message:', error);
            alert('Erro ao enviar mensagem');
          }
        });
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

  startEdit(message: Message) {
    message.isEditing = true;
    message.editedContent = message.content;
  }

  cancelEdit(message: Message) {
    message.isEditing = false;
    message.editedContent = undefined;
  }

  saveEdit(message: Message) {
    if (message.editedContent?.trim()) {
      this.http.put(`${this.apiUrl}/api/mensagens/${message.id}`, {
        texto: message.editedContent
      }).subscribe({
        next: () => {
          message.content = message.editedContent!;
          message.isEditing = false;
          message.editedContent = undefined;
        },
        error: (error) => {
          console.error('Error updating message:', error);
          alert('Erro ao atualizar mensagem');
        }
      });
    }
  }

  deleteMessage(message: Message) {
    if (confirm('Tem certeza que deseja excluir esta mensagem?')) {
      this.http.delete(`${this.apiUrl}/api/mensagens/${message.id}`)
        .subscribe({
          next: () => {
            this.messages = this.messages.filter(m => m.id !== message.id);
          },
          error: (error) => {
            console.error('Error deleting message:', error);
            alert('Erro ao excluir mensagem');
          }
        });
    }
  }
}
