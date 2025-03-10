import Project from './project';
import Task from './task.js';

export default class Storage {
    static saveProjects(projects) {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    static loadProjects() {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        if (!Array.isArray(projects)) {
            return [];
        }
        return projects.map(project => {
            const tasks = project.tasks.map(task => new Task(
                task.project,
                task.title,
                task.description,
                new Date(task.dueDate),
                task.priority,
                task.notes,
                task.checklist
            ));
            return new Project(project._id, project.name, project.description, tasks);
        });
    }

    static deleteProject(projectIndex) {
        const projects = Storage.loadProjects();
        projects.splice(projectIndex, 1);
        Storage.saveProjects(projects);
    }

    static clearProjects() {
        localStorage.removeItem('projects');
    }
}