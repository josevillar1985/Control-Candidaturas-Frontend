import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartComponent } from 'ng-apexcharts';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../model/application';

@Component({
  selector: 'app-weekly-sent-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './weeklysentchartcomponent.html',
  styleUrls: ['./weeklysentchartcomponent.css'],
})
export class WeeklySentChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  chartOptions: any = {
    series: [{ name: 'Enviadas', data: [] as number[] }],
    chart: {
      type: 'bar',
      height: 320,
      toolbar: { show: false },
      foreColor: '#ffffff',
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: [] as string[],
      labels: { style: { colors: '#9aa7a0' } },
    },
    yaxis: {
      labels: { style: { colors: '#9aa7a0' } },
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.08)',
    },
    fill: {
      colors: ['#00ff88'],
      opacity: 0.9,
    },
    tooltip: {
      theme: 'dark',
    },
  };

  constructor(
    private applicationService: ApplicationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.applicationService.getApplications().subscribe({
      next: (apps) => this.buildChart(apps),
      error: (e) => console.error('Error cargando datos para gráfica semanal:', e),
    });
  }

  private buildChart(apps: Application[]): void {
    const now = new Date();
    const startThisWeek = this.startOfWeek(now);

    const weeks: { start: Date; label: string }[] = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date(startThisWeek);
      start.setDate(start.getDate() - i * 7);
      const label = this.weekLabel(start);
      weeks.push({ start, label });
    }

    const counts = weeks.map(({ start }, idx) => {
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      return apps.filter((a) => {
        if (a.status !== 'ENVIADO') return false;
        const t = this.toTime(a.date);
        return t >= start.getTime() && t < end.getTime();
      }).length;
    });

    this.chartOptions = {
      ...this.chartOptions,
      xaxis: { ...this.chartOptions.xaxis, categories: weeks.map((w) => w.label) },
      series: [{ name: 'Enviadas', data: counts }],
    };
    this.cdr.detectChanges();
  }

  private weekLabel(start: Date): string {
    const d = new Date(start);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}`;
  }

  private startOfWeek(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private toTime(value: Date | string): number {
    if (value instanceof Date) return value.getTime();
    return new Date(value).getTime();
  }
}
