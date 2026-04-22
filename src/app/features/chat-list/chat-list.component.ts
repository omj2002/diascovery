import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  private http = inject(HttpClient);
  
  chats: any[] = [];
  userNames: { [id: string]: string } = {};
  isLoading = true;
  currentUserId = localStorage.getItem('userId') || '';

  ngOnInit() {
    if (!this.currentUserId) {
      this.isLoading = false;
      return;
    }

    this.http.get<any[]>(`${environment.apiUrl}/chat/conversations?userId=${this.currentUserId}`).subscribe({
      next: (data) => {
        this.chats = data.sort((a, b) => {
          return new Date(b.lastMessageAt || b.createdAt).getTime() - new Date(a.lastMessageAt || a.createdAt).getTime();
        });
        this.chats.forEach(chat => {
            this.resolveUserName(this.getOtherParticipantId(chat));
        });
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  resolveUserName(userId: string) {
    if (!userId || this.userNames[userId]) return;
    this.userNames[userId] = 'Loading...';
    this.http.get<any>(`${environment.apiUrl}/users/${userId}`).subscribe({
        next: (user) => { if (user) this.userNames[userId] = user.name; },
        error: () => this.userNames[userId] = 'Unknown User'
    });
  }

  getOtherParticipantId(chat: any): string {
    return chat.buyerId === this.currentUserId ? chat.sellerId : chat.buyerId;
  }
}
