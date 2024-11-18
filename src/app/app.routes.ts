import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: TaskListComponent
    },
    {
        path: 'detail/:taskId',
        component: TaskDetailComponent
    }
];
