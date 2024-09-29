import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts'; 
import { Chart, ChartOptions, ChartType, registerables } from 'chart.js';

@Component({
  selector: 'app-block-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './block-summary.component.html',
  styleUrls: ['./block-summary.component.scss']
})
export class BlockSummaryComponent implements OnInit {
  blockData: any;
  public chartData: any;
  public gasData: any;
  public gasCostBreakdownData : any;
  public transactionVolumeChartData  : any;

  public generateChartOptions(title: string, type: ChartType, padding?: { top: number; bottom: number }) {
    return {
      responsive: true,
      type,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 18
          },
          ...(padding && { padding })
        },
        legend: {
          position: 'top'
        },
        tooltip: {
          enabled: true
        }
      }
    } as ChartOptions<typeof type>;
  }
  
  
  public chartOptions = this.generateChartOptions('Transactions by Type', 'pie');
  public gasChartOptions = this.generateChartOptions('Gas Usage by Transaction Type', 'pie');
  public gasBreakdownChartOptions = this.generateChartOptions('Gas Cost Breakdown by Threshold', 'pie');
  public transactionVolumeChartOptions = this.generateChartOptions('Transaction Volume Over Time', 'line');

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient, private cdr: ChangeDetectorRef) {
    Chart.register(...registerables);  // Register Chart.js components
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchLatestBlockData();
    }
  }

  // Function to calculate total gas usage for transaction categories and set chart data
  calculateGasUsageChartData(transactions: any) {
    // Function to sum gas for a given transaction array
    const sumGasUsed = (transactionsArray: any[]) => {
      // Log raw gas values
      console.log("Raw gas values:", transactionsArray.map((tx: { gas: any; }) => tx.gas));

      // Ensure gas is a number, and sum the values
      return transactionsArray.reduce((total: number, tx: { gas: string; }) => total + (parseFloat(tx.gas) || 0), 0);
    };

    // Calculate total gas used for each category
    const etherTransfersGas = sumGasUsed(transactions.etherTransfers || []);
    const contractCallsGas = sumGasUsed(transactions.contractCalls || []);
    const contractCreationsGas = sumGasUsed(transactions.contractCreations || []);


    // Set the chart data for total gas used by category
    this.gasData = {
      datasets: [{
        data: [
          etherTransfersGas,     // Total gas used by ether transfers
          contractCallsGas,      // Total gas used by contract calls
          contractCreationsGas   // Total gas used by contract creations
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }],
      labels: ['Ether Transfers', 'Contract Calls', 'Contract Creations']
    };

    console.log(this.gasData)
  }

  // Function to calculate and set the transaction distribution chart data
  setTransactionDistributionChartData(transactions: any) {
    this.chartData = {
      datasets: [{          
          data: [
            transactions.etherTransfers?.length || 0,      // Count of Ether Transfers
            transactions.contractCalls?.length || 0,       // Count of Contract Calls
            transactions.contractCreations?.length || 0    // Count of Contract Creations
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',  // Ether Transfers
            'rgb(54, 162, 235)',  // Contract Calls
            'rgb(255, 205, 86)'   // Contract Creations
          ]
      }],
      labels: ['Ether Transfers', 'Contract Calls', 'Contract Creations']
    };
  }

  // Function to categorize gas usage into low, medium, and high thresholds
  calculateGasBreakdown(transactions: any) {
    let lowGas = 0, mediumGas = 0, highGas = 0, ultraGas = 0;
    let lowGasThresh = 50000, medGasThresh = 200000, highGasThresh = 650000;

    const categorizeGas = (transactions: any[]) => {
      transactions.forEach((tx) => {
        const gasUsed = (parseFloat(tx.gas) || 0);
        if (gasUsed < lowGasThresh) {
          lowGas += 1;
        } else if (gasUsed >= lowGasThresh && gasUsed < medGasThresh) {
          mediumGas += 1;
        } else if (gasUsed >= medGasThresh && gasUsed < highGasThresh) {
          highGas += 1;
        } else if (gasUsed >= highGasThresh) {
          ultraGas += 1;
        }
      });
    };

    // Sum gas usage across all categories
    categorizeGas(transactions.etherTransfers);
    categorizeGas(transactions.contractCalls);
    categorizeGas(transactions.contractCreations);

    // Update the chart data for gas cost thresholds
    this.gasCostBreakdownData = {
      datasets: [{
        data: [
          lowGas,     // Total low gas usage
          mediumGas,  // Total medium gas usage
          highGas,     // Total high gas usage
          ultraGas
        ],
        backgroundColor: [
          '#FF3737',  // Red
          '#FF6955', // Orange-Red
          '#FFA07A', // Orange-Yellow         
          '#FFFF00' // Yellow
        ]
      }],
      labels: [`Low Gas (<${lowGasThresh})`, `Medium Gas (${lowGasThresh}-${medGasThresh})`, `High Gas (${medGasThresh}-${highGasThresh})`, `Ultra-High Gas (>${highGasThresh})`]
    };

    console.log(this.gasCostBreakdownData);
  }

  


  fetchLatestBlockData() {
    let url = 'http://localhost:3000/api/contracts/latest-block';
    let headers = {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    };
    this.http.get(url, headers).subscribe(data => {
      this.blockData = data;
      console.log(this.blockData);

      if (this.blockData?.transactions) {

        this.calculateGasUsageChartData(this.blockData.transactions);
        this.setTransactionDistributionChartData(this.blockData.transactions);
        this.calculateGasBreakdown(this.blockData.transactions);
        
        // Trigger change detection manually for OnPush strategy
        this.cdr.markForCheck();
      }
    }, error => {
      console.error('Failed to fetch latest block data:', error);
    });
  }
}
