import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Formcomponent } from '../../components/formcomponent/formcomponent';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Formcomponent, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  uptimeSeconds: number = 0;
  private timerInterval: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const savedTime = localStorage.getItem('totalSessionTime');
    if (savedTime) {
      this.uptimeSeconds = parseInt(savedTime, 10);
    }

    this.timerInterval = setInterval(() => {
      this.currentDate = new Date();
      this.uptimeSeconds++;
      localStorage.setItem('totalSessionTime', this.uptimeSeconds.toString());
      this.cdr.detectChanges(); 
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
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