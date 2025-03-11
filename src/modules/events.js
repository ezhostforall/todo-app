import Task from "./task.js";
import Project from "./project.js";
import UI from "./ui.js";
import Storage from "./storage.js";

export default class Events {
    static setupEventListeners(projects) {
        document.querySelector('#add-new-project-form-button').addEventListener('click', (event) => {
            event.preventDefault();
            const projectName = document.querySelector('#new-project-name').value;
            const projectDescription = document.querySelector('#new-project-description').value;
            const projectID = `project-${Date.now().toString()}`;
            const projectTasks = [];

            if (projectName) {
                const project = new Project(projectID, projectName, projectDescription, projectTasks);
                projects.push(project);
                Storage.saveProjects(projects);
                UI.displayProjects(projects);
            } 
        });

        document.querySelector('#add-new-task-form-button').addEventListener('click', (event) => {
            event.preventDefault();
            const activeProjectId = document.querySelector("#current-project-title").dataset.projectId;
            const activeProject = projects.find(project => project._id === activeProjectId);
            
            
            const id = `task-${Date.now().toString()}`;
            const title = document.querySelector('#new-task-name').value;
            const dueDate = document.querySelector('#new-task-due-date').value;
            const priority = document.querySelector('#new-task-priority').value;
            const description = document.querySelector('#new-task-description').value;
            const status = document.querySelector('#new-task-status').value;
            const notes = [document.querySelector('#new-task-notes').value];
            
            const checklist = document.querySelector('#new-checklist-items').children;
            const checklistArray = Array.from(checklist).map(item => {
                const checklistItem = {
                    title: item.textContent.trim(),
                    checked: false
                };
                return checklistItem;
            });

            const completed = false;

            if (title && dueDate) {
                if (!activeProject) {
                    alert("Please select a project before adding a task.");
                    return;
                }
                console.log(checklistArray);
                const task = new Task(activeProject.name, title, description, dueDate, priority, status, notes, checklistArray);
                activeProject.addTask(task);
                Storage.saveProjects(projects);
                UI.displayTasks(activeProject);
                console.log(task);
            }
        });

        document.querySelector('#add-checklist-item').addEventListener('click', () => {
            const newChecklistItem = document.querySelector('#new-checklist-item').value;    
            const checklistItem = document.createElement('p');
            checklistItem.textContent = newChecklistItem;
            document.querySelector('#new-checklist-items').appendChild(checklistItem);
            console.log(document.querySelector('#new-checklist-items').children);
        });

        document.querySelector('#new-task-btn').addEventListener('click', (event) => {
            event.preventDefault();
            const taskForm = document.querySelector('#add-new-task-form-wrapper');
            const activeProject = document.querySelector('#current-project-title').textContent;
            taskForm.classList.toggle('hidden');
            const formTitle = activeProject !== "No Active Project" ? document.querySelector('#active-project-form-header') : activeProject;
            console.log(formTitle);
            if (activeProject !== "No Active Project") formTitle.textContent = `Add a new task to ${activeProject}`;
            console.log(activeProject);
            console.log(formTitle.textContent);
            
        });

        document.querySelector('#new-project-btn').addEventListener('click', (event) => {
            event.preventDefault();
            const taskForm = document.querySelector('#add-project-form-wrapper');
            taskForm.classList.toggle('hidden');
        });
    }
}
