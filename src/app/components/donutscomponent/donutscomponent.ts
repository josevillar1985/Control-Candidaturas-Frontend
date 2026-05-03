import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartComponent } from 'ng-apexcharts';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-donutscomponent',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './donutscomponent.html',
  styleUrls: ['./donutscomponent.css'],
})
export class Donutscomponent implements OnInit {

  constructor(public aplicationService: ApplicationService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.datos();
  }

  datos() {
    this.aplicationService.getApplications().subscribe({
      next: (data: any[]) => {

        const enviadas = data.filter(app => app.status === 'ENVIADO').length;
        const rechazadas = data.filter(app => app.status === 'RECHAZADO').length;

        this.chartOptions = {
          ...this.chartOptions,
          series: [enviadas, rechazadas],
          colors: ["#00ff88", "#ff4d4d"]
        };
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    })
  }

  @ViewChild("chart") chart!: ChartComponent;

  chartOptions: any = {
    series: [],
    chart: {
      width: 380,
      type: "pie"
    },
    labels: ["Enviadas", "Rechazadas"],

    colors: [
      "#00ff88",
      "#ff4d4d"
    ],


    legend: {
      labels: {
        colors: ["#ffffff", "#ffffff"]
      }
    },


    dataLabels: {
      style: {
        colors: ["#ffffff"]
      }
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: "bottom" }
        }
      }
    ]
  };

}
