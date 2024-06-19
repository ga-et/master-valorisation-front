import { Component, Inject, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { GrapheService } from '../graphe.service';
import { isPlatformBrowser } from '@angular/common';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { RaisonTauxCompareComponent } from '../raison-taux-compare/raison-taux-compare.component';

@Component({
  selector: 'app-raisonfrequ',
  standalone: true,
  imports: [RaisonTauxCompareComponent],
  templateUrl: './raisonfrequ.component.html',
  styleUrl: './raisonfrequ.component.css'
})
export class RaisonfrequComponent {
  private subscription!: Subscription;
  private grapheService = inject(GrapheService);
  private root!: am5.Root;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) {
  }

  async ngOnInit() {
    this.subscription = this.grapheService.getAllRaison().subscribe(data => {
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

        series.slices.template.events.on("click", function(ev: any) {
          console.log("Clicked on a column", ev.target.dataItem.dataContext.categorie)
          document.location.href = 'http://localhost:4200/raison/depart/' + ev.target.dataItem.dataContext.categorie;
        });

        series.data.setAll(data);
         

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
