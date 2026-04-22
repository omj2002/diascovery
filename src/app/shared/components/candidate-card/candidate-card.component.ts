import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Candidate } from '../../../core/models/api.models';
import { LucideAngularModule } from 'lucide-angular';
import { ChatService } from '../../../core/services/api/chat.api.service';

@Component({
    selector: 'app-candidate-card',
    standalone: true,
    imports: [CommonModule, RouterLink, LucideAngularModule],
    templateUrl: './candidate-card.component.html',
    styleUrls: ['./candidate-card.component.scss']
})
export class CandidateCardComponent {
    @Input() candidate!: Candidate;

    constructor(
        private router: Router,
        private chatService: ChatService
    ) {}

    openChat(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (!this.candidate) return;

        const candidateAny = this.candidate as any;
        const candidateUserId: string | undefined =
            candidateAny.userId ?? candidateAny.user_id ?? candidateAny.userID;

        if (!candidateUserId) {
            console.warn('candidate.userId is null; falling back to candidate.id as sellerId');
            console.log('Candidate object:', this.candidate);
        }

        const currentUserId = localStorage.getItem('userId');
        if (!currentUserId) {
            this.router.navigate(['/login']);
            return;
        }

        // /api/candidates is built from registered sellers, so candidate.userId is the seller id.
        const buyerId = currentUserId;
        const sellerId = candidateUserId ?? this.candidate.id;

        this.chatService.createConversation(buyerId, sellerId).subscribe({
            next: (convo) => this.router.navigate(['/chat', convo.id]),
            error: (err) => {
                console.error('Open chat error:', err);
                alert('Failed to open chat.');
            }
        });
    }
}
