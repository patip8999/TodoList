export interface TaskModel {
    readonly id: string;
    readonly content: string;
    readonly description: string;
    readonly isCompleted: string;
    readonly priority: string;
    readonly  due: { date: string; string: string; lang: string; is_recurring: boolean } | null;  // Typ dla due
    readonly dueDate: string;
    readonly isDescriptionVisible?: boolean;
    readonly status: 'Pending' | 'Done';
}