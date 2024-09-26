import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractComponent } from './components/contract/contract.component';
import { BlockSummaryComponent } from './components/block-summary/block-summary.component';

const appRoutes: Routes = [
  { path: '', component: BlockSummaryComponent }, // Set the default route
  { path: 'contract', component: ContractComponent } 
];

export default appRoutes;
//export const routes: Routes = [];