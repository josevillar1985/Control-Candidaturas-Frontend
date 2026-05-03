import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../model/application';
import { WeeklySentChartComponent } from '../../components/weeklysentchartcomponent/weeklysentchartcomponent';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, WeeklySentChartComponent],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview implements OnInit {
  applications: Application[] = [];
  recentApplications: Application[] = [];

  thisWeekSent = 0;
  lastWeekSent = 0;
  thisMonthSent = 0;
  rejectionRate = 0;

  weeklyGoal = 15;

  constructor(
    private applicationService: ApplicationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const savedGoal = localStorage.getItem('weeklyGoal');
    if (savedGoal) this.weeklyGoal = Math.max(1, Number(savedGoal) || this.weeklyGoal);

    this.load();
  }

  load(): void {
    this.applicationService.getApplications().subscribe({
      next: (apps) => {
        this.applications = [...apps];
        this.recentApplications = [...apps]
          .sort((a, b) => this.toTime(b.date) - this.toTime(a.date))
          .slice(0, 6);

        this.computeKpis(apps);
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error cargando candidaturas:', e),
    });
  }

  saveWeeklyGoal(): void {
    const normalized = Math.max(1, Math.floor(Number(this.weeklyGoal) || 1));
    this.weeklyGoal = normalized;
    localStorage.setItem('weeklyGoal', String(normalized));
    this.cdr.detectChanges();
  }

  get weeklyGoalProgressPct(): number {
    if (!this.weeklyGoal) return 0;
    return Math.min(100, Math.round((this.thisWeekSent / this.weeklyGoal) * 100));
  }

  private computeKpis(apps: Application[]): void {
    const now = new Date();
    const startThisWeek = this.startOfWeek(now);
    const startLastWeek = new Date(startThisWeek);
    startLastWeek.setDate(startLastWeek.getDate() - 7);
    const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const sentThisWeek = apps.filter(
      (a) => a.status === 'ENVIADO' && this.toTime(a.date) >= startThisWeek.getTime()
    ).length;
    const sentLastWeek = apps.filter((a) => {
      if (a.status !== 'ENVIADO') return false;
      const t = this.toTime(a.date);
      return t >= startLastWeek.getTime() && t < startThisWeek.getTime();
    }).length;
    const sentThisMonth = apps.filter(
      (a) => a.status === 'ENVIADO' && this.toTime(a.date) >= startThisMonth.getTime()
    ).length;

    const total = apps.length || 0;
    const rejected = apps.filter((a) => a.status === 'RECHAZADO').length;

    this.thisWeekSent = sentThisWeek;
    this.lastWeekSent = sentLastWeek;
    this.thisMonthSent = sentThisMonth;
    this.rejectionRate = total ? Math.round((rejected / total) * 100) : 0;
  }

  private startOfWeek(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay(); // 0 domingo - 6 sábado
    const diff = (day === 0 ? -6 : 1) - day; // semana ISO (lunes)
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private toTime(value: Date | string): number {
    if (value instanceof Date) return value.getTime();
    return new Date(value).getTime();
  }
}

