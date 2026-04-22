import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/api/auth.api.service';
import { ProjectInvitation } from '../../core/models/api.models';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})
export class InvitationsComponent implements OnInit {
  private http = inject(HttpClient);
  public authService = inject(AuthService);

  user: any = null;
  invitations: ProjectInvitation[] = [];
  isLoading = true;

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user?.id) {
      this.fetchInvitations(this.user.id);
    } else {
      this.isLoading = false;
    }
  }

  fetchInvitations(candidateId: string) {
    this.http.get<ProjectInvitation[]>(`${environment.apiUrl}/invitations/candidate/${candidateId}`).subscribe({
      next: (invites) => {
        // Sort pending first, then by date.
        this.invitations = invites.sort((a, b) => {
          if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
          if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  updateStatus(inviteId: string, status: string) {
    this.http.put(`${environment.apiUrl}/invitations/${inviteId}/status`, { status }).subscribe({
      next: () => {
        const invite = this.invitations.find(i => i.id === inviteId);
        if (invite) {
          invite.status = status;
        }
      },
      error: (err) => {
        console.error('Failed to update status', err);
        alert('Failed to update status. Please try again.');
      }
    });
  }
}
