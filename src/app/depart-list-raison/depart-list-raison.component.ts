import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { DepartService } from '../depart.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Depart } from '../class/depart';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-depart-list-raison',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './depart-list-raison.component.html',
  styleUrl: './depart-list-raison.component.css'
})
export class DepartListRaisonComponent {
  private departService = inject(DepartService);
  private subscription!: Subscription;
  departs = this.departService.departs;

  route: ActivatedRoute = inject(ActivatedRoute);
  raisonOfs = '';
  departsEntity: Depart[] = [];

  displayedColumns: string[] = ['date', 'typecontrat', 'taux', 'lieutravail', 'anciennete'];
  constructor(private cdr: ChangeDetectorRef) {
    this.raisonOfs = this.route.snapshot.params['raisonofs'];
     
  }

  async ngOnInit() {
    this.subscription = this.departService.getAllDepartByRaisonOfs(this.raisonOfs).subscribe(data => {
      this.departsEntity = data;
      this.cdr.detectChanges(); // Force Angular to detect changes
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
