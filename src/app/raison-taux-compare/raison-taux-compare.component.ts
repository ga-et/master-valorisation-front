import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, NgZone, PLATFORM_ID, inject } from '@angular/core';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { GrapheService } from '../graphe.service';
import { Graphe } from '../class/graphe';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-raison-taux-compare',
  standalone: true,
  imports: [],
  templateUrl: './raison-taux-compare.component.html',
  styleUrl: './raison-taux-compare.component.css'
})
export class RaisonTauxCompareComponent {
  private grapheService = inject(GrapheService);
  private subscription!: Subscription;
  graphes = this.grapheService.graphes;

  private root!: am5.Root;

  private loadData!: Graphe[];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private _router: Router) {}

  aaa(ssss: String): void {
    this._router.navigate(['centre/'])
  }

  ngOnInit() {
    this.subscription = this.grapheService.getAllRaisonTauxCompare().subscribe(data1 => {
      this.loadData = data1;
      // Chart code goes in here
      this.browserOnly(() => {
        let root = am5.Root.new("chartdiv2");

        root.setThemes([am5themes_Animated.new(root)]);

        let chart = root.container.children.push(am5xy.XYChart.new(root, {
          panX: true,
          panY: false,
          wheelX: "panX",
          wheelY: "zoomX",
          paddingLeft: 0,
          layout: root.verticalLayout
        }));
        
        
        // Add scrollbar
        // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
        chart.set("scrollbarX", am5.Scrollbar.new(root, {
          orientation: "horizontal"
        }));
        
        let data = this.loadData
        
        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        let xRenderer = am5xy.AxisRendererX.new(root, {
          minGridDistance: 70,
          minorGridEnabled: true
        });

        xRenderer.labels.template.setAll({
          rotation: -90,
        });
        
        let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
          categoryField: "categorie",
          renderer: xRenderer,
          tooltip: am5.Tooltip.new(root, {
            themeTags: ["axis"],
            animationDuration: 200
          })
        }));
        
        
        xRenderer.grid.template.setAll({
          location: 1
        })
        
        xAxis.data.setAll(data);
        
        let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
          min: 0,
          renderer: am5xy.AxisRendererY.new(root, {
            strokeOpacity: 0.1
          })
        }));
        
        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        
        let series0 = chart.series.push(am5xy.ColumnSeries.new(root, {
          name: "Groupe E",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "valeurY",
          categoryXField: "categorie",
          clustered: false,
          tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}%"
          })
        }));
        
        series0.columns.template.setAll({
          width: am5.percent(80),
          tooltipY: 0,
          strokeOpacity: 0
        });
        
        
        series0.data.setAll(data);
        
        
        let series1 = chart.series.push(am5xy.ColumnSeries.new(root, {
          name: "OFS",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "ofsTaux",
          categoryXField: "categorie",
          clustered: false,
          tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}%"
          })
        }));
        
        series1.columns.template.setAll({
          width: am5.percent(50),
          tooltipY: 0,
          strokeOpacity: 0
        });
        
        series1.data.setAll(data);
        
        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));

        // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);
        
        
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        chart.appear(1000, 100);
        series0.appear();
        series1.appear();

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
