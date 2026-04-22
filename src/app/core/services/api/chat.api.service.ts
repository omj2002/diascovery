import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Conversation, Message, Page } from '../../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = environment.apiUrl + '/chat';

  constructor(private http: HttpClient) {}

  getConversations(userId: string): Observable<Conversation[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Conversation[]>(`${this.baseUrl}/conversations`, { params });
  }

  getMessages(conversationId: string): Observable<Page<Message>> {
    return this.http.get<Page<Message>>(
      `${this.baseUrl}/conversations/${conversationId}/messages`
    );
  }

  createConversation(buyerId: string, sellerId: string): Observable<Conversation> {
    const params = new HttpParams().set('buyerId', buyerId).set('sellerId', sellerId);
    // backend expects buyerId/sellerId as request params
    return this.http.post<Conversation>(`${this.baseUrl}/conversations`, {}, { params });
  }

  sendMessage(conversationId: string, senderId: string, content: string): Observable<Message> {
    // backend expects Message payload with conversationId + senderId + content
    const payload = { conversationId, senderId, content };
    return this.http.post<Message>(`${this.baseUrl}/messages`, payload);
  }
}
