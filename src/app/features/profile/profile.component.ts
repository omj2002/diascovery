import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/api/auth.api.service';
import { Project, ProjectInvitation } from '../../core/models/api.models';
import { LucideAngularModule } from 'lucide-angular';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private http = inject(HttpClient);
  public authService = inject(AuthService);

  user: any = null;
  projects: Project[] = [];
  invitationsByProject: { [projectId: string]: ProjectInvitation[] } = {};
  isLoading = true;

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user?.id) {
      this.fetchUserProjects(this.user.id);
    } else {
      this.isLoading = false;
    }
  }

  fetchUserProjects(userId: string) {
    this.http.get<Project[]>(`${environment.apiUrl}/projects/owner/${userId}`).subscribe({
      next: (projs) => {
        this.projects = projs;
        this.fetchProjectInvitations(projs);
      },
      error: () => this.isLoading = false
    });
  }

  fetchProjectInvitations(projects: Project[]) {
    if (projects.length === 0) {
      this.isLoading = false;
      return;
    }

    const requests = projects.map(p => this.http.get<ProjectInvitation[]>(`${environment.apiUrl}/invitations/project/${p.id}`));
    forkJoin(requests).subscribe({
      next: (results) => {
        projects.forEach((p, index) => {
          this.invitationsByProject[p.id] = results[index];
        });
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  getAcceptedHires(projectId: string): ProjectInvitation[] {
    return (this.invitationsByProject[projectId] || []).filter(inv => inv.status === 'ACCEPTED');
  }

  getPendingInvites(projectId: string): ProjectInvitation[] {
    return (this.invitationsByProject[projectId] || []).filter(inv => inv.status === 'PENDING');
  }
}
