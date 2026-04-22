import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { HttpClient } from '@angular/common/http';
import { CandidateService } from '../../core/services/api/candidate.api.service';
import { ChatService } from '../../core/services/api/chat.api.service';
import { Candidate, Project } from '../../core/models/api.models';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-candidate-details',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './candidate-details.component.html',
    styleUrls: ['./candidate-details.component.scss']
})
export class CandidateDetailsComponent implements OnInit {
    candidate: Candidate | undefined;
    
    myProjects: Project[] = [];
    existingInvites: any[] = [];
    showHireModal = false;
    isHiring = false;

    constructor(
        private candidateService: CandidateService,
        private route: ActivatedRoute,
        private chatService: ChatService,
        private router: Router,
        private http: HttpClient
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.candidateService.getCandidateById(id).subscribe(cand => {
                    this.candidate = cand;
                    this.loadExistingInvites(id);
                });
            }
        });
    }

    loadExistingInvites(candidateId: string) {
        this.http.get<any[]>(`${environment.apiUrl}/invitations/candidate/${candidateId}`).subscribe(invites => {
            this.existingInvites = invites || [];
        });
    }

    getInviteStatus(projectId: string): string | null {
        if (!this.existingInvites) return null;
        const currentUserId = localStorage.getItem('userId');
        const invite = this.existingInvites.find(i => i.project?.id === projectId && i.senderId === currentUserId);
        return invite ? invite.status : null;
    }

    hasAnyInvite(): boolean {
        const currentUserId = localStorage.getItem('userId');
        return this.existingInvites.some(i => i.senderId === currentUserId);
    }

    openHireModal() {
        const currentUserId = localStorage.getItem('userId');
        if (!currentUserId) {
            this.router.navigate(['/login']);
            return;
        }

        this.http.get<Project[]>(`${environment.apiUrl}/projects/owner/${currentUserId}`).subscribe(projects => {
            this.myProjects = projects.filter(p => p.status !== 'Closed');
            this.showHireModal = true;
        });
    }

    closeHireModal() {
        this.showHireModal = false;
    }

    sendHireInvite(projectId: string) {
        if (!this.candidate) return;
        this.isHiring = true;
        const currentUserId = localStorage.getItem('userId');
        
        const payload = {
            projectId: projectId,
            candidateId: this.candidate.id,
            senderId: currentUserId
        };

        this.http.post(`${environment.apiUrl}/invitations/send`, payload).subscribe({
            next: () => {
                this.isHiring = false;
                this.closeHireModal();
                if (this.candidate) {
                    this.loadExistingInvites(this.candidate.id);
                }
                alert('Hire invitation sent successfully!');
            },
            error: () => {
                this.isHiring = false;
                alert('Failed to send invitation.');
            }
        });
    }

    openChat(): void {
        if (!this.candidate) return;

        const candidateAny = this.candidate as any;
        const candidateUserId: string | undefined =
            candidateAny.userId ?? candidateAny.user_id ?? candidateAny.userID;

        console.log('Open chat candidate:', this.candidate, 'resolved candidateUserId:', candidateUserId);

        if (!candidateUserId) {
            // Fallback for seeded candidates where seller userId is null.
            // Backend chat stores sellerId as a string, so using candidate.id still enables buyer chat.
            console.warn('candidate.userId is null; falling back to candidate.id as sellerId');
        }

        const currentUserId = localStorage.getItem('userId');
        if (!currentUserId) {
            this.router.navigate(['/login']);
            return;
        }

        // /api/candidates is built from registered sellers, so candidate.userId is the seller id.
        // Your current user is the buyer for this flow.
        const buyerId = currentUserId;
        const sellerId = candidateUserId ?? this.candidate.id;

        this.chatService.createConversation(buyerId, sellerId).subscribe({
            next: (convo) => {
                this.router.navigate(['/chat', convo.id]);
            },
            error: (err) => {
                console.error('Create conversation error:', err);
                alert('Failed to open chat.');
            }
        });
    }
}
