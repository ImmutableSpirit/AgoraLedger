import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts'; 
import { Chart, ChartOptions, registerables } from 'chart.js';

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
  public chartOptions = { 
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Transactions by Type',  // Set your chart title here
        font: {
          size: 18  // Optional: Adjust the font size
        },
        padding: {
          top: 10,   // Optional: Adjust padding
          bottom: 10
        }
      },
      legend: {
        position: 'top', // Position of the legend (optional)
      },
      tooltip: {
        enabled: true, // Tooltips enabled
      }
    }
  } as ChartOptions<'pie'>;

  public gasChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Gas Usage by Transaction Type',  // Set your chart title here
        font: {
          size: 18  // Optional: Adjust the font size
        },
        padding: {
          top: 10,   // Optional: Adjust padding
          bottom: 10
        }
      },
      legend: {
        position: 'top', // Position of the legend (optional)
      },
      tooltip: {
        enabled: true, // Tooltips enabled
      }
    }
  } as ChartOptions<'pie'>;

  public gasData: any;

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

  fetchLatestBlockData() {
    let url = 'http://localhost:3000/api/contracts/latest-block';
    let headers = {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    };
    this.http.get(url, headers).subscribe(data => {
      this.blockData = data;
      console.log(this.blockData);

      // Categorize transactions by gas usage
      //const lowGas = this.blockData.transactions.filter((tx: { gas: number; }) => tx.gas < 20000);
      //const mediumGas = this.blockData.transactions.filter((tx: { gas: number; }) => tx.gas >= 20000 && tx.gas <= 80000);
      //const highGas = this.blockData.transactions.filter((tx: { gas: number; }) => tx.gas > 80000);

      if (this.blockData?.transactions) {

        this.calculateGasUsageChartData(this.blockData.transactions);
        this.setTransactionDistributionChartData(this.blockData.transactions);

        // Trigger change detection manually for OnPush strategy
        this.cdr.markForCheck();
      }
    }, error => {
      console.error('Failed to fetch latest block data:', error);
    });
  }
}
