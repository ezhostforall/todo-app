import Project from './project';

export default class Storage {
    static saveProjects(projects) {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    static loadProjects() {
        const projects = JSON.parse(localStorage.getItem('projects'));
        return projects ? projects.map(project => {
            return new Project(project._id, project.name, project.description, project.tasks);
        }) : [];
    }
}