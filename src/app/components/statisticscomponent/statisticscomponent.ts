import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Donutscomponent } from '../donutscomponent/donutscomponent';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../model/application'; 
import { WeeklySentChartComponent } from '../weeklysentchartcomponent/weeklysentchartcomponent';

@Component({
  selector: 'app-statisticscomponent',
  standalone: true,
  imports: [CommonModule, Donutscomponent, WeeklySentChartComponent],
  templateUrl: './statisticscomponent.html',
  styleUrl: './statisticscomponent.css',
})
export class Statisticscomponent implements OnInit {

  total: number = 0;
  enviadas: number = 0;
  rechazadas: number = 0;
  enviadasSemana: number = 0;
  enviadasSemanaAnterior: number = 0;
  enviadasMes: number = 0;
  rachaDias: number = 0;

  constructor(
    public aplicationService: ApplicationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getdatos();
  }

  getdatos() {
    this.aplicationService.getApplications().subscribe({
      next: (data: Application[]) => {
        
        const targetTotal = data.length;
        const targetEnviadas = data.filter(app => app.status === 'ENVIADO').length;
        const targetRechazadas = data.filter(app => app.status === 'RECHAZADO').length;

        const { sentThisWeek, sentLastWeek, sentThisMonth, streakDays } = this.computeTimeStats(data);
       
        this.animateCount('total', targetTotal);
        this.animateCount('enviadas', targetEnviadas);
        this.animateCount('rechazadas', targetRechazadas);
        this.animateCount('enviadasSemana', sentThisWeek);
        this.animateCount('enviadasSemanaAnterior', sentLastWeek);
        this.animateCount('enviadasMes', sentThisMonth);
        this.animateCount('rachaDias', streakDays);
      },
      error: (err) => {
        console.error('Error al cargar datos de aplicaciones:', err);
      }
    });
  }

  animateCount(
    property:
      | 'total'
      | 'enviadas'
      | 'rechazadas'
      | 'enviadasSemana'
      | 'enviadasSemanaAnterior'
      | 'enviadasMes'
      | 'rachaDias',
    target: number
  ) {
    if (target === 0) {
      this[property] = 0;
      this.cdr.detectChanges();
      return;
    }

    const duration = 700; 
    const framesPerSecond = 60;
    const totalFrames = (duration / 1000) * framesPerSecond;
    const increment = target / totalFrames;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      
      if (current >= target) {
        this[property] = target;
        clearInterval(timer);
      } else {
        this[property] = Math.floor(current);
      }
      
      this.cdr.detectChanges();
    }, 1000 / framesPerSecond);
  }

  private computeTimeStats(apps: Application[]): {
    sentThisWeek: number;
    sentLastWeek: number;
    sentThisMonth: number;
    streakDays: number;
  } {
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

    const streakDays = this.computeDailyStreak(apps);

    return { sentThisWeek, sentLastWeek, sentThisMonth, streakDays };
  }

  private computeDailyStreak(apps: Application[]): number {
    const sentDates = new Set<string>();
    for (const a of apps) {
      if (a.status !== 'ENVIADO') continue;
      const d = new Date(this.toTime(a.date));
      d.setHours(0, 0, 0, 0);
      sentDates.add(d.toISOString().slice(0, 10));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    for (;;) {
      const key = today.toISOString().slice(0, 10);
      if (!sentDates.has(key)) break;
      streak++;
      today.setDate(today.getDate() - 1);
    }
    return streak;
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
