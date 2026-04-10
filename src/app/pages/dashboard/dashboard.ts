import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLinkActive, RouterLink, RouterOutlet } from "@angular/router";
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../services/application.service'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  uptimeSeconds: number = 0;
  dbConnected: boolean = false; 
  private timerInterval: any;
  private healthInterval: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private appService: ApplicationService 
  ) {}

  ngOnInit() {
   
    const savedTime = localStorage.getItem('totalSessionTime');
    if (savedTime) this.uptimeSeconds = parseInt(savedTime, 10);

    this.timerInterval = setInterval(() => {
      this.currentDate = new Date();
      this.uptimeSeconds++;
      localStorage.setItem('totalSessionTime', this.uptimeSeconds.toString());
      this.cdr.detectChanges(); 
    }, 1000);

    this.checkStatus();

    this.healthInterval = setInterval(() => {
      this.checkStatus();
    }, 10000);
  }

  checkStatus() {
    this.appService.checkHealth().subscribe(status => {
      this.dbConnected = status;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.healthInterval) clearInterval(this.healthInterval);
  }

  get formattedUptime(): string {
    const hrs = Math.floor(this.uptimeSeconds / 3600);
    const mins = Math.floor((this.uptimeSeconds % 3600) / 60);
    const secs = this.uptimeSeconds % 60;
    return `${this.pad(hrs)}:${this.pad(mins)}:${this.pad(secs)}`;
  }

  private pad(num: number) {
    return num < 10 ? '0' + num : num;
  }
}