import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { DatePipe, DecimalPipe } from '@angular/common';  
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-block-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './block-summary.component.html',
  styleUrl: './block-summary.component.scss'
})
export class BlockSummaryComponent {

  blockData: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:3000/api/contracts/latest-block').subscribe(data => {
      this.blockData = data;
    });
  }
}
