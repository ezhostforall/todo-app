import { format } from 'date-fns';

export default class Project {
    constructor(
        id = `project-${Date.now().toString()}`, 
        name = `Default Project: ${Date.now().toString()}`, 
        description = 'No description Provided', 
        tasks = []
    ) {
        this._id = id;
        this.name = name;
        this.description = description;
        this.tasks = tasks;
        this.createdAt = new Date();
    }

    id() {
        return this._id;
    }

    addTask(task) {
        this.tasks.push(task);
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
    }

    getFormattedDate() {
        return format(this.createdAt, 'dd-MM-yyyy');
    }
}