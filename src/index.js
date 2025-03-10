import Project from './modules/project.js';
import Storage from './modules/storage.js';

let projects = Storage.loadProjects();
    
if (projects.length === 0) {
    projects.push(new Project("Default Project"));
}

