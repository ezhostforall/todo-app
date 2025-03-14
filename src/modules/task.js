import { format } from 'date-fns';

export default class Task {
    constructor(
        project = 'Default',
        title = `Untitled task: ${Date.now().toString()}`, 
        description = 'No description provided', 
        dueDate = new Date(), 
        priority = 'low', 
        status,
        notes = ['No notes provided'],
        checklist = [],
    ) {
        this._id = `task-${Date.now().toString()}`;
        this.project = project;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status || 'new';
        this.notes = notes;
        this.checklist = checklist;
        this.completed = false;
    }

    get id() {
        return this._id;
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }

    getFormattedDate() {
        return format(this.dueDate, 'dd-MM-yyyy');
    }
}