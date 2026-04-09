import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Donutscomponent } from '../donutscomponent/donutscomponent';
import { ApplicationService } from '../../services/application.service';


@Component({
  selector: 'app-statisticscomponent',
  imports: [Donutscomponent],
  templateUrl: './statisticscomponent.html',
  styleUrl: './statisticscomponent.css',
})
export class Statisticscomponent implements OnInit {

  total = 0;
  enviadas = 0;
  rechazadas = 0;

  constructor(public aplicationService: ApplicationService,
              private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getdatos(); 
  }

  getdatos(){
    this.aplicationService.getApplications().subscribe({
      next: (data: any[]) => { 
        this.total = data.length;
        this.enviadas = data.filter(app => app.status === 'ENVIADO').length;
        this.rechazadas = data.filter(app => app.status === 'RECHAZADO').length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    })
  }
}
