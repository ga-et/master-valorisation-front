import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { GrapheService } from '../graphe.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Graphe } from '../class/graphe';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-raisoncentre',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './raisoncentre.component.html',
  styleUrl: './raisoncentre.component.css'
})
export class RaisoncentreComponent {

  private subscription!: Subscription;
  private grapheService = inject(GrapheService);

  route: ActivatedRoute = inject(ActivatedRoute);
  centreCoutCode = '';
  raisonDto: Graphe[] = [];
  displayedColumns2: string[] = ['categorie', 'valeurY'];

  constructor(private cdr: ChangeDetectorRef) {
    this.centreCoutCode = this.route.snapshot.params['code'];
  }

  async ngOnInit() {
    this.subscription = this.grapheService.getRaisonByCentreCout(this.centreCoutCode).subscribe(data => {
      this.raisonDto = data;
      this.cdr.detectChanges(); // Force Angular to detect changes
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
