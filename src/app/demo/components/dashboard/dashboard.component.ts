import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { CarbonIntensityService } from '../../service/carbon-intensity.service';
import { Factors, Generation, Intensity, RegionalFromTo } from '../../service/api-models';
import { DatasetChartOptions, LineControllerDatasetOptions } from 'chart.js';

type ElementType<T> = T extends (infer U)[] ? U : never;

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

    dates = getDatesPair();

    currentGenerationMix: {
        fuel?: string;
        perc?: number;
    }[] = [];
    intensityFactors: ElementType<Factors['data']>;
    generationRegions: ElementType<RegionalFromTo['data']>['regions'] = [];
    intensityHistory: Intensity['data'] = [];
    generationMixHistory: Generation['data'] = [];
    topRegionsIntensity: ElementType<RegionalFromTo['data']>['regions'] = [];
    fuelsList: string[] = [];

    constructor(
        private productService: ProductService,
        public layoutService: LayoutService,
        private carbonIntensityService: CarbonIntensityService,
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initIntensityHistoryChart();
            });
    }

    ngOnInit() {
        this.initIntensityHistoryChart();
        this.initGenerationMixHistoryChart();
        this.productService.getProductsSmall().subscribe(data => this.products = data);

        this.carbonIntensityService.getGenerationMix().subscribe({
            next: (response) => {
                console.log('generationmix response', response);
                this.currentGenerationMix = response.data?.generationmix || [];
            },
            error: (error) => {
                console.error('Error fetching data', error);
            }
        });

        this.carbonIntensityService.getGenerationMixByDateRange(this.dates[0], this.dates[1]).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.generationMixHistory = response.data;
                    console.log('Date Range Filtered Generation Mix:', this.generationMixHistory);
                    this.initGenerationMixHistoryChart();
                }
            },
            error: (error) => {
                console.error('Error fetching generation mix by date range', error);
            }
        });

        this.carbonIntensityService.getIntensityFactors().subscribe(data => {
            this.intensityFactors = data.data?.[0];
            console.log('intensityFactors', this.intensityFactors);
        });

        this.carbonIntensityService.getIntensityRegional().subscribe({
            next: (data) => {
                this.generationRegions = data.data[0].regions;
                this.topRegionsIntensity = this.generationRegions.sort((a, b) => b.intensity.forecast - a.intensity.forecast).slice(0, 4);
                this.fuelsList = Array.from(new Set(this.generationRegions.flatMap(x => x.generationmix.map(y => y.fuel))));
            },
            error: (error) => {
                console.error('Error fetching data', error);
            }
        })

        this.carbonIntensityService.getCarbonIntensityByDateRange(this.dates[0], this.dates[1]).subscribe({
            next: (data) => {
                this.intensityHistory = data.data;
                console.log('Carbon Intensity Data:', this.intensityHistory);

                // Update the chart with the fetched data
                this.initIntensityHistoryChart();
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

    getIntesityOfRegionByFuel(r: any, fuel: string) {
        return r.generationmix.find(m => m.fuel == fuel)?.perc;
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

    initGenerationMixHistoryChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const fuelsList = Array.from(new Set(this.generationMixHistory.flatMap(x => x.generationmix.map(y => y.fuel))));

        const dynamicLabels = this.generationMixHistory.length > 0
            ? this.generationMixHistory.map(x => x.to)
            : [''];


        console.log('[Labels', dynamicLabels)

        const dynamicDatasets = fuelsList.map(f => {
            return {
                label: (f as string).toUpperCase(),
                data: this.generationMixHistory.map(x => x.generationmix.find(m => m.fuel == f)?.perc),
                fill: false,
                backgroundColor: documentStyle.getPropertyValue(getRandomColorVar()),
                borderWidth: 0,
                tension: 0.4
            }
        })

        this.chartDataGenerationMix = {
            labels: dynamicLabels,
            datasets: dynamicDatasets
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

    initIntensityHistoryChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const dynamicLabels = this.intensityHistory.length > 0
            ? this.intensityHistory.map(p => p.to)
            : ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

        const dynamicDataset1 = this.intensityHistory.length > 0
            ? this.intensityHistory.map(p => p.intensity.forecast)
            : [];

        const dynamicDataset2 = this.intensityHistory.length > 0
            ? this.intensityHistory.map(p => p.intensity.actual)
            : [];

        this.chartData = {
            labels: dynamicLabels,
            datasets: [
                {
                    label: 'Forecast Intensity',
                    data: dynamicDataset1,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderWidth: 0,
                    tension: 0.4
                },
                {
                    label: 'Actual Intensity',
                    data: dynamicDataset2,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderWidth: 0,
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


const globalColorClassList = [
    '--blue-100',
    '--blue-200',
    '--blue-300',
    '--blue-400',
    '--blue-500',
    '--blue-600',
    '--blue-700',
    '--blue-800',
    '--blue-900',
    '--green-50',
    '--green-100',
    '--green-200',
    '--green-300',
    '--green-400',
    '--green-500',
    '--green-600',
    '--green-700',
    '--green-800',
    '--green-900',
    '--yellow-50',
    '--yellow-100',
    '--yellow-200',
    '--yellow-300',
    '--yellow-400',
    '--yellow-500',
    '--yellow-600',
    '--yellow-700',
    '--yellow-800',
    '--yellow-900',
    '--cyan-50',
    '--cyan-100',
    '--cyan-200',
    '--cyan-300',
    '--cyan-400',
    '--cyan-500',
    '--cyan-600',
    '--cyan-700',
    '--cyan-800',
    '--cyan-900',
    '--pink-50',
    '--pink-100',
    '--pink-200',
    '--pink-300',
    '--pink-400',
    '--pink-500',
    '--pink-600',
    '--pink-700',
    '--pink-800',
    '--pink-900',
    '--indigo-50',
    '--indigo-100',
    '--indigo-200',
    '--indigo-300',
    '--indigo-400',
    '--indigo-500',
    '--indigo-600',
    '--indigo-700',
    '--indigo-800',
    '--indigo-900',
    '--teal-50',
    '--teal-100',
    '--teal-200',
    '--teal-300',
    '--teal-400',
    '--teal-500',
    '--teal-600',
    '--teal-700',
    '--teal-800',
    '--teal-900',
    '--orange-50',
    '--orange-100',
    '--orange-200',
    '--orange-300',
    '--orange-400',
    '--orange-500',
    '--orange-600',
    '--orange-700',
    '--orange-800',
    '--orange-900',
    '--bluegray-50',
    '--bluegray-100',
    '--bluegray-200',
    '--bluegray-300',
    '--bluegray-400',
    '--bluegray-500',
    '--bluegray-600',
    '--bluegray-700',
    '--bluegray-800',
    '--bluegray-900',
    '--purple-50',
    '--purple-100',
    '--purple-200',
    '--purple-300',
    '--purple-400',
    '--purple-500',
    '--purple-600',
    '--purple-700',
    '--purple-800',
    '--purple-900',
    '--red-50',
    '--red-100',
    '--red-200',
    '--red-300',
    '--red-400',
    '--red-500',
    '--red-600',
    '--red-700',
    '--red-800',
    '--red-900',
    '--primary-50',
    '--primary-100',
    '--primary-200',
    '--primary-300',
    '--primary-400',
    '--primary-500',
    '--primary-600',
    '--primary-700',
    '--primary-800',
    '--primary-900',
    '--gray-50',
    '--gray-100',
    '--gray-200',
    '--gray-300',
    '--gray-400',
    '--gray-500',
    '--gray-600',
    '--gray-700',
    '--gray-800',
    '--gray-900',

]

function getRandomColorVar() {
    const colorIdx = Math.round(Math.random() * globalColorClassList.length);
    return globalColorClassList[colorIdx];
}

function getDatesPair() {
    function getFormattedDate(date) {
        return date.toISOString().split('.')[0] + 'Z';
    }

    const currentDate = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7);

    const formattedCurrentDate = getFormattedDate(currentDate);
    const formattedOneWeekAgoDate = getFormattedDate(oneWeekAgo);

    return [formattedOneWeekAgoDate, formattedCurrentDate]
}