import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { CarbonIntensityService } from '../../service/carbon-intensity.service';
import { CarbonFactorIntensityService } from '../../service/factors-intensity.service';
import { CarbonIntensityRegionService } from '../../service/intensity.service-region';
import { DateFilterIntensityService } from '../../service/datefilter-intensity.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    chartDataGenerationMix: any;

    chartOptionsGenerationMix: any;

    subscription!: Subscription;
    intensityData: any;
    generationMix: Array<{ fuel: string, perc: number }> = [];
    intensityFactors: any[];
    generationRegion: any[] = [];
    generationRegionIntensity: any[] = [];
    DatefilterEmissionHistory: any[] = [];
    DatefilterGenerationMix: any[] = [];
    fromDate: string = '2024-09-04T00:00Z';
    toDate: string = '2024-09-10T00:00Z';

    constructor(
        private productService: ProductService,
        public layoutService: LayoutService,
        private carbonIntensityService: CarbonIntensityService,
        private carbonFactorIntensityService: CarbonFactorIntensityService,
        private carbonIntensityRegionService: CarbonIntensityRegionService,
        private dateFilterIntensityService: DateFilterIntensityService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChartEmission();
            });
    }

    ngOnInit() {
        this.initChartEmission();
        this.initChart();
        this.productService.getProductsSmall().subscribe(data => this.products = data);

        this.carbonIntensityService.getGenerationMix().subscribe({
            next: (response) => {
                if (response && response.data && response.data.generationmix) {
                    this.generationMix = response.data.generationmix;
                    console.log('generationmix response', response);
                    
                } else {
                    console.error('generationmix not found in the response');
                }
            },
            error: (error) => {
                console.error('Error fetching data', error);
            }
        });

        this.carbonIntensityService.getGenerationMixByDateRange(this.fromDate, this.toDate).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.DatefilterGenerationMix = response.data.map(item => ({
                        from: item.from,
                        to: item.to,
                        generationMix: item.generationmix
                    }));
                    console.log('Date Range Filtered Generation Mix:', this.DatefilterGenerationMix);
                    this.initChart();
                }
            },
            error: (error) => {
                console.error('Error fetching generation mix by date range', error);
            }
        });

        this.carbonFactorIntensityService.getIntensityFactors().subscribe(data => {
            this.intensityFactors = data.data[0];
            console.log('intensityFactors', this.intensityFactors);
        });

        this.carbonIntensityRegionService.getIntensityRegion().subscribe({
            next: (data) => {
                console.log('All Data Region ', data);
                this.generationRegion = data.data[0].regions.map(region => region.generationmix).flat();
                this.generationRegionIntensity = data.data[0].regions.map(region => region.intensity);
                console.log('Generation Region Data: ', this.generationRegion);
            },
            error: (error) => {
                console.error('Error fetching data', error);
            }
        })

          this.dateFilterIntensityService.getCarbonIntensityData(this.fromDate, this.toDate).subscribe({
            next: (data) => {
                this.DatefilterEmissionHistory = data.data.map(item => ({
                    index: item.intensity.index,
                    forecast: item.intensity.forecast,
                    actual: item.intensity.actual
                }));
    
                console.log('Carbon Intensity Data:', this.DatefilterEmissionHistory);

                // Update the chart with the fetched data
                this.initChartEmission();
            },
            error: (error) => {
                console.error('Error fetching carbon intensity data', error);
            }
        });

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }

    getColorClass(perc: number, prefix: string): string {

        const colorValue = (() => {

            if (perc > 15) {
                return 'green-500';
            } else if (perc > 10) {
                return 'yellow-500';
            } else if (perc > 5) {
                return 'orange-500';
            } else {
                return 'red-500';
            }
        })()

        return `${prefix}${colorValue}`;
    }

    // initChart() {
    //     const documentStyle = getComputedStyle(document.documentElement);
    //     const textColor = documentStyle.getPropertyValue('--text-color');
    //     const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    //     const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    //     const dynamicLabels = this.DatefiltergenerationMix.length > 0 ? this.DatefiltergenerationMix.map(p => p.intensity.index) : ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    //     const dynamicDataset1 = this.DatefiltergenerationMix.length > 0 ? this.DatefiltergenerationMix.map(p =>  p.intensity.forecast) : [65, 59, 80, 81, 56, 55, 40];
    //     const dynamicDataset2 = this.DatefiltergenerationMix.length > 0 ? this.DatefiltergenerationMix.map(p => p.intensity.actual) : [28, 48, 40, 19, 86, 27, 90];

    //     this.chartData = {
    //         labels: dynamicLabels,
    //         datasets: [
    //             {
    //                 label: 'First Dataset',
    //                 data: dynamicDataset1,
    //                 fill: false,
    //                 backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
    //                 borderColor: documentStyle.getPropertyValue('--bluegray-700'),
    //                 tension: .4
    //             },
    //             {
    //                 label: 'Second Dataset',
    //                 data: dynamicDataset2,
    //                 fill: false,
    //                 backgroundColor: documentStyle.getPropertyValue('--green-600'),
    //                 borderColor: documentStyle.getPropertyValue('--green-600'),
    //                 tension: .4
    //             }
    //         ]
    //     };

    //     this.chartOptions = {
    //         plugins: {
    //             legend: {
    //                 labels: {
    //                     color: textColor
    //                 }
    //             }
    //         },
    //         scales: {
    //             x: {
    //                 ticks: {
    //                     color: textColorSecondary
    //                 },
    //                 grid: {
    //                     color: surfaceBorder,
    //                     drawBorder: false
    //                 }
    //             },
    //             y: {
    //                 ticks: {
    //                     color: textColorSecondary
    //                 },
    //                 grid: {
    //                     color: surfaceBorder,
    //                     drawBorder: false
    //                 }
    //             }
    //         }
    //     };
    // }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    
        const dynamicLabels = this.DatefilterGenerationMix.length > 0
            ? this.DatefilterGenerationMix[0].generationMix.map(p => p.fuel) // Get fuel types
            : [''];
    
        const dynamicDataset1 = this.DatefilterGenerationMix.length > 0
            ? this.DatefilterGenerationMix[0].generationMix.map(p => p.perc)
            : [];
    
        const dynamicDataset2 = this.DatefilterGenerationMix.length > 0
            ? this.DatefilterGenerationMix[this.DatefilterGenerationMix.length - 1].generationMix.map(p => p.perc)
            : [];
    
        this.chartDataGenerationMix = {
            labels: dynamicLabels,
            datasets: [
                {
                    label: 'Forecast',
                    data: dynamicDataset1,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: 0.4
                },
                {
                    label: 'Actual',
                    data: dynamicDataset2,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: 0.4
                }
            ]
        };
    
        this.chartOptionsGenerationMix = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    initChartEmission() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    
        const dynamicLabels = this.DatefilterEmissionHistory.length > 0 
            ? this.DatefilterEmissionHistory.map(p => p.index) 
            : ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    
        const dynamicDataset1 = this.DatefilterEmissionHistory.length > 0 
            ? this.DatefilterEmissionHistory.map(p => p.forecast) 
            : [];
    
        const dynamicDataset2 = this.DatefilterEmissionHistory.length > 0 
            ? this.DatefilterEmissionHistory.map(p => p.actual) 
            : [];
    
        this.chartData = {
            labels: dynamicLabels,
            datasets: [
                {
                    label: 'Forecast Intensity',
                    data: dynamicDataset1,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: 0.4
                },
                {
                    label: 'Actual Intensity',
                    data: dynamicDataset2,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: 0.4
                }
            ]
        };
    
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
