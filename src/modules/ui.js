import Project from './project.js';
import Storage from './storage.js';

export default class UI {
    static init() {
        let projects = Storage.loadProjects();
        if (!projects || projects.length === 0) {
            const defaultProject = new Project();
            Storage.saveProjects([defaultProject]);
            projects = Storage.loadProjects();
        }
        UI.displayProjects(projects);
        UI.addDeleteProjectEvents();
        console.log(projects);
    }

    static displayProjects(projects) {
        const projectList = document.querySelector('#project-list');
        projectList.innerHTML = '';
        projects.forEach((project, index) => {
            const projectElement = document.createElement('ul');
            projectElement.dataset.index = index;
            projectElement.className = 'project-item';
            
            const projectTitle = document.createElement('li');
            projectTitle.className = 'project-title';
            projectTitle.textContent = project.name;
            projectElement.appendChild(projectTitle);

            const projectDescription = document.createElement('li');
            projectDescription.className = 'project-description';
            projectDescription.textContent = project.description;
            projectElement.appendChild(projectDescription);

            const deleteProjectBtn = document.createElement('button');
            deleteProjectBtn.className = 'delete-project-btn';
            deleteProjectBtn.textContent = 'Delete';
            projectElement.appendChild(deleteProjectBtn);

            projectList.appendChild(projectElement);
            
        })
    }

    static addDeleteProjectEvents() {
        const deleteProjectBtns = document.querySelectorAll('.delete-project-btn');
        deleteProjectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const projectIndex = btn.parentElement.dataset.index;
                console.log(projectIndex);
                Storage.deleteProject(projectIndex);
                UI.displayProjects(Storage.loadProjects());
            })
        })
    }

    static displayTasks(project) {
        
    }

}