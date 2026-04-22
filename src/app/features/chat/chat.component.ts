import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/api/chat.api.service';
import { Message } from '../../core/models/api.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  conversationId: string | null = null;
  messages: Message[] = [];
  userNames: { [id: string]: string } = {};
  currentUserId = localStorage.getItem('userId') || '';

  messageContent = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.conversationId = this.route.snapshot.paramMap.get('conversationId');
    if (!this.conversationId) {
      this.errorMessage = 'Conversation not found.';
      return;
    }
    this.loadMessages();
  }

  loadMessages(): void {
    if (!this.conversationId) return;
    this.chatService.getMessages(this.conversationId).subscribe({
      next: (page) => {
        this.messages = page?.content ?? [];
        this.messages.forEach(m => this.resolveUserName(m.senderId));
      },
      error: (err) => {
        console.error('Load messages error:', err);
        this.errorMessage = 'Failed to load messages.';
      },
    });
  }

  resolveUserName(userId: string) {
    if (!userId || this.userNames[userId]) return;
    if (userId === this.currentUserId) {
        this.userNames[userId] = 'You';
        return;
    }
    
    this.userNames[userId] = 'Loading...';
    this.http.get<any>(`${environment.apiUrl}/users/${userId}`).subscribe({
        next: (user) => {
            if (user && user.name) this.userNames[userId] = user.name;
        },
        error: () => this.userNames[userId] = 'Unknown User'
    });
  }

  sendMessage(): void {
    if (!this.conversationId) return;

    const senderId = localStorage.getItem('userId');
    if (!senderId) {
      this.router.navigate(['/login']);
      return;
    }

    const content = this.messageContent.trim();
    if (!content) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.chatService.sendMessage(this.conversationId, senderId, content).subscribe({
      next: (msg) => {
        this.isLoading = false;
        this.messageContent = '';
        // optimistically append; if backend returns createdAt as string, UI can show it
        if (!msg.createdAt) msg.createdAt = new Date().toISOString();
        this.resolveUserName(senderId);
        this.messages = [...this.messages, msg];
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Send message error:', err);
        this.errorMessage = 'Failed to send message.';
      },
    });
  }
}

