import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';

export const routes: Routes = [
    {
        path: '',
        component: TaskListComponent
    },
    {
        path: 'detail/:taskId',
        component: TaskDetailComponent
    },
    {
        path: 'create-task',
        component: CreateTaskComponent
    }
];
