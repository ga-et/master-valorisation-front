import { ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { GrapheService } from '../graphe.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Graphe } from '../class/graphe';
import {MatTableModule} from '@angular/material/table';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { isPlatformBrowser } from '@angular/common';

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
  private root!: am5.Root;

  private loadData!: Graphe[];

  constructor(private cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private _router: Router) {
    this.centreCoutCode = this.route.snapshot.params['code'];
  }

  async ngOnInit() {
    this.subscription = this.grapheService.getRaisonByCentreCout(this.centreCoutCode).subscribe(data => {
      this.raisonDto = data;
      this.cdr.detectChanges(); // Force Angular to detect changes
      this.loadData = data;
      // Chart code goes in here
      this.browserOnly(() => {
        let root = am5.Root.new("chartdiv");

        root.setThemes([am5themes_Animated.new(root)]);

        let chart = root.container.children.push(
          am5percent.PieChart.new(root, {
            endAngle: 270
          })
        );

        // Create series
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
        let series = chart.series.push(
          am5percent.PieSeries.new(root, {
            valueField: "valeurY",
            categoryField: "categorie",
            endAngle: 270
          })
        );

        series.states.create("hidden", {
          endAngle: -90
        });

        series.data.setAll(this.loadData);
         

        // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);

        this.root = root;
      });
    });
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
