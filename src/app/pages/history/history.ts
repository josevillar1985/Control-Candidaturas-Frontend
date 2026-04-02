import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application.service';
import { CommonModule, NgClass } from '@angular/common';
import { Application } from '../../model/application';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgClass, CommonModule, FormsModule],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History implements OnInit {

  applications: Application[] = []; // copia original
  searchText: string = '';

  constructor(
    public applicationService: ApplicationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getApplications();
  }

  getApplications() {
    this.applicationService.getApplications().subscribe({
      next: (data) => {
        this.applicationService.applications = data.reverse(); 
        this.applications = [...data]; 
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error fetching applications:', e);
      }
    })
  }

  deleteApplication(id: number) {
    this.applicationService.deleteApplication(id).subscribe({
      next: (data) => {
        console.log(data);
        this.getApplications();
      },
      error: (e) => {
        console.error('Error deleting application:', e);
      }
    });
  }

  filterApplications() {
    const text = this.searchText.toLowerCase();

    const filtered = this.applications.filter(app =>
      (app.name || '').toLowerCase().includes(text) ||
      (app.email || '').toLowerCase().includes(text) ||
      String(app.phone || '').toLowerCase().includes(text)
    );

    this.applicationService.applications = [...filtered];
  }
}