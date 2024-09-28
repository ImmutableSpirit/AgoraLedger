import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideHttpClient } from '@angular/common/http'; // Import provideHttpClient
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(),
    provideCharts(withDefaultRegisterables()) 
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
