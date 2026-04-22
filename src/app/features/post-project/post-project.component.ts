import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-post-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-project.component.html',
  styleUrls: ['./post-project.component.scss']
})
export class PostProjectComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  projectForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    projectType: ['commercial', Validators.required],
    requiredRoles: ['', Validators.required],
    requiredSkills: ['', Validators.required],
    teamSize: [1, [Validators.required, Validators.min(1)]],
    imageURL: ['']
  });

  onSubmit() {
    this.projectForm.markAllAsTouched();
    if (this.projectForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const ownerId = localStorage.getItem('userId');
    if (!ownerId) {
      this.errorMessage = 'You must be logged in to post a project.';
      this.isLoading = false;
      return;
    }

    const payload = {
      ...this.projectForm.value,
      ownerId: ownerId,
      status: 'Open'
    };

    this.http.post(`${environment.apiUrl}/projects`, payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Project posted successfully! Finding your perfect teammates...';
        setTimeout(() => this.router.navigate(['/profile']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to post project. Please try again.';
        console.error(err);
      }
    });
  }
}
