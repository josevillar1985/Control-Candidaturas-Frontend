import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Donutscomponent } from '../donutscomponent/donutscomponent';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../model/application'; 

@Component({
  selector: 'app-statisticscomponent',
  standalone: true,
  imports: [CommonModule, Donutscomponent],
  templateUrl: './statisticscomponent.html',
  styleUrl: './statisticscomponent.css',
})
export class Statisticscomponent implements OnInit {

  total: number = 0;
  enviadas: number = 0;
  rechazadas: number = 0;

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

       
        this.animateCount('total', targetTotal);
        this.animateCount('enviadas', targetEnviadas);
        this.animateCount('rechazadas', targetRechazadas);
      },
      error: (err) => {
        console.error('Error al cargar datos de aplicaciones:', err);
      }
    });
  }

  animateCount(property: 'total' | 'enviadas' | 'rechazadas', target: number) {
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
}