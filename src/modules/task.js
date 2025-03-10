import { format } from 'date-fns';

export default class Task {
    constructor(
        project = 'Default',
        title = `Untitled task: ${Date.now().toString()}`, 
        description = 'No description provided', 
        dueDate = new Date(), 
        priority = 'low', 
        notes = [{ title: 'Default note title', content: 'Default note content' }],
        checklist = [{ title: 'Default checklist title', checked: false }],
    ) {
        this._id = `task-${Date.now().toString()}`;
        this.project = project;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = 'new';
        this.notes = notes;
        this.checklist = checklist;
        this.completed = false;
    }

    id() {
        return this._id;
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }

    getFormattedDate() {
        return format(this.dueDate, 'dd-MM-yyyy');
    }
}