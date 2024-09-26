import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'contract',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss'
})
export class ContractComponent {
  contractData: any;

  viewContract() {
    const contractAddress = (document.getElementById('contractAddress') as HTMLInputElement).value;

    // Simulated contract data
    this.contractData = {
      address: contractAddress,
      owner: "0x1234...abcd",
      balance: 1000,
      createdAt: new Date().toISOString()
    }; 
  }
}
