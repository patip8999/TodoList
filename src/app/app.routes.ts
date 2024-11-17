import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';

export const routes: Routes = [
    {
        path: 'list',
        component: TaskListComponent
    }
];
