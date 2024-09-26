import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockSummaryComponent } from './block-summary.component';

describe('BlockSummaryComponent', () => {
  let component: BlockSummaryComponent;
  let fixture: ComponentFixture<BlockSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlockSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
