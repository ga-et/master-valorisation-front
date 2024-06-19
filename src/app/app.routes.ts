import { Routes } from '@angular/router';
import { CentrecoutraisonComponent } from './centrecoutraison/centrecoutraison.component';
import { HomeComponent } from './home/home.component';
import { RaisoncentreComponent } from './raisoncentre/raisoncentre.component';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { RaisonfrequComponent } from './raisonfrequ/raisonfrequ.component';
import { DepartListRaisonComponent } from './depart-list-raison/depart-list-raison.component';

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
    {
        path: 'raison',
        component: RaisonfrequComponent,
        title: 'Raisons',
    },
    {
        path: 'raison/depart/:raisonofs',
        component: DepartListRaisonComponent,
        title: 'Departs par raison',
    }

    
];
