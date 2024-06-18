import { Component, Inject, inject, OnInit, PLATFORM_ID, NgZone } from '@angular/core';
import { DepartService } from '../depart.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { GrapheService } from '../graphe.service';
import { Graphe } from '../class/graphe';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private departService = inject(DepartService);
  private grapheService = inject(GrapheService);
  private subscription!: Subscription;
  departs = this.departService.departs;
  graphes = this.grapheService.graphes;

  private root!: am5.Root;

  private loadData!: Graphe[];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private _router: Router) {}

  aaa(ssss: String): void {
    this._router.navigate(['centre/'])
  }

  ngOnInit() {
    this.subscription = this.departService.getAllDeparts().subscribe(data => {
      // console.log(data);
    });

    this.subscription = this.grapheService.getGroupByCentreCout().subscribe(data => {
      this.loadData = data;
      // Chart code goes in here
      this.browserOnly(() => {
        let root = am5.Root.new("chartdiv");

        root.setThemes([am5themes_Animated.new(root)]);

        let chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            panY: false,
            layout: root.verticalLayout
          })
        );

        // label vertical
        chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));

        // cursor
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);

        // Define data
        console.log(this.loadData.length);

        let data = this.loadData;
        console.log(data.length);

        // Create Y-axis
        let yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
          })
        );

        var xRenderer = am5xy.AxisRendererX.new(root, { 
          minGridDistance: 30, 
          minorGridEnabled: true
        });
        
        xRenderer.labels.template.setAll({
          rotation: -90,
          centerY: am5.p50,
          centerX: am5.p100,
          paddingRight: 15
        });

        // Create X-Axis
        let xAxis = chart.xAxes.push(
          am5xy.CategoryAxis.new(root, {
            renderer: xRenderer,
            categoryField: "categorie",
            tooltip: am5.Tooltip.new(root, {
              labelText: "{labelX}"
            })
          })
        );
        xAxis.data.setAll(data);

        // Create series
        let series1 = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: "Centres de coûts",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "valeurY",
            categoryXField: "categorie",
            tooltip: am5.Tooltip.new(root, {
              labelText: "{valueY}%"
            })
          })
        );

        series1.columns.template.events.on("click", function(ev: any) {
          console.log("Clicked on a column", ev.target.dataItem.dataContext.categorie)
          document.location.href = 'http://localhost:4200/centre/' + ev.target.dataItem.dataContext.categorie;
        });

        series1.data.setAll(data);

         // Create series ligne
         let series2 = chart.series.push(
          am5xy.LineSeries.new(root, {
            name: "Moyenne suisse",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "ofsTaux",
            categoryXField: "categorie",
            tooltip: am5.Tooltip.new(root, {
              labelText: "{ofsTaux}%"
            })
          })
        );

        series2.strokes.template.setAll({
          strokeWidth: 3,
          templateField: "strokeSettings"
        });

        series2.data.setAll(data);

        // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);

        // Add cursor
        chart.set("cursor", am5xy.XYCursor.new(root, {}));

        this.root = root;
      });
    });

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
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

}
