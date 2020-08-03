export interface Tasks {
    data: Task[];
}

export interface Task {
    id: number;
    text: string;
    due_date: string;
    priority: number;
    completed: boolean;
}