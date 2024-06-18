import { Routes } from '@angular/router';
import { CentrecoutraisonComponent } from './centrecoutraison/centrecoutraison.component';
import { HomeComponent } from './home/home.component';
import { RaisoncentreComponent } from './raisoncentre/raisoncentre.component';

export const routes: Routes = [
    
    {
        path: '',
        component: HomeComponent,
        title: 'Home',
    },
    {
        path: 'centre/:code',
        component: CentrecoutraisonComponent,
        title: 'détail',
    },
    
];
