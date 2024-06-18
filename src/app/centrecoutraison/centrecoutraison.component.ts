import { ChangeDetectorRef, Component, inject, NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import { DepartService } from '../depart.service';
import { Subscription } from 'rxjs';
import { Depart } from '../class/depart';
import { GrapheService } from '../graphe.service';
import { Graphe } from '../class/graphe';
import { RaisoncentreComponent } from '../raisoncentre/raisoncentre.component';

@Component({
  selector: 'app-centrecoutraison',
  standalone: true,
  imports: [MatTableModule, RaisoncentreComponent],
  templateUrl: './centrecoutraison.component.html',
  styleUrl: './centrecoutraison.component.css'
})
export class CentrecoutraisonComponent {
  private departService = inject(DepartService);
  private grapheService = inject(GrapheService);
  private subscription!: Subscription;
  departs = this.departService.departs;

  route: ActivatedRoute = inject(ActivatedRoute);
  centreCoutCode = '';
  departsEntity: Depart[] = [];
  departstest: Depart[] = [];
  raisonDto: Graphe[] = [];

  displayedColumns: string[] = ['date', 'typecontrat', 'taux', 'lieutravail', 'anciennete'];
  displayedColumns2: string[] = ['categorie', 'valeurY'];
  constructor(private cdr: ChangeDetectorRef) {
    this.centreCoutCode = this.route.snapshot.params['code'];
     
  }

  async ngOnInit() {
    this.subscription = this.departService.getAllDepartByCentre(this.centreCoutCode).subscribe(data => {
      this.departsEntity = data;
      this.cdr.detectChanges(); // Force Angular to detect changes
    });
    let sub = (this.grapheService.getRaisonByCentreCout(this.centreCoutCode).subscribe(data => {
      this.raisonDto = data;
      this.cdr.detectChanges(); // Force Angular to detect changes
    }));
    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
