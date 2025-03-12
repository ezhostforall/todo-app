import Project from './project.js';
import Storage from './storage.js';
import Events from './events.js';


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
        Events.setupEventListeners(projects);
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

            const displayTasksBtn = document.createElement('button');
            displayTasksBtn.className = 'display-tasks-btn';
            displayTasksBtn.textContent = 'Display Tasks';
            displayTasksBtn.addEventListener('click', () => UI.displayTasks(project));
            projectElement.appendChild(displayTasksBtn);

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
                UI.addDeleteProjectEvents();
            })
        })
    }

    static displayTasks(project) {
        const taskList = document.querySelector('#task-list');
        const title = document.querySelector('#current-project-title');
        
        const tasks = project.tasks;
        
        taskList.innerHTML = '';
        title.dataset.projectId = project._id;
        title.textContent = `Active Project: ${project.name}`; 
        

        tasks.forEach(task => {
            const taskElement = document.createElement('ul');
            taskElement.dataset.id = task.id;
            taskElement.className = 'task-item';
            
            const taskTitle = document.createElement('li');
            taskTitle.className = 'task-title';
            taskTitle.textContent = task.title;
            taskElement.appendChild(taskTitle);

            const taskDescription = document.createElement('li');
            taskDescription.className = 'task-description';
            taskDescription.textContent = task.description;
            taskElement.appendChild(taskDescription);

            const taskDueDate = document.createElement('li');
            taskDueDate.className = 'task-due-date';
            taskDueDate.textContent = task.getFormattedDate();
            taskElement.appendChild(taskDueDate);

            const taskPriority = document.createElement('li');
            taskPriority.className = 'task-priority';
            taskPriority.textContent = task.priority;
            taskElement.appendChild(taskPriority);

            const taskStatus = document.createElement('li');
            taskStatus.className = 'task-status';
            taskStatus.textContent = task.status;
            taskElement.appendChild(taskStatus);

            const notes = document.createElement('ul');
            notes.className = 'task-notes';
            task.notes.forEach(note => {
                const noteElement = document.createElement('li');
                noteElement.className = 'note-item';
                noteElement.textContent = note;
                notes.appendChild(noteElement);
            });
            taskElement.appendChild(notes);

            const checklist = document.createElement('ul');
            checklist.className = 'task-checklist';
            task.checklist.forEach(item => {
                const checklistItem = document.createElement('li');
                checklistItem.className = 'checklist-item';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.checked;
                
                const label = document.createElement('span');
                label.textContent = item.title;
                
                checklistItem.appendChild(checkbox);
                checklistItem.appendChild(label);
                
                checklist.appendChild(checklistItem);
            });
            taskElement.appendChild(checklist);

            const taskCompleted = document.createElement('li');
            taskCompleted.className = 'task-completed';
            taskCompleted.textContent = task.completed;
            taskElement.appendChild(taskCompleted);

            const deleteTaskBtn = document.createElement('button');
            deleteTaskBtn.className = 'delete-task-btn';
            deleteTaskBtn.textContent = 'Delete';
            deleteTaskBtn.dataset.id = task.id;
            taskElement.appendChild(deleteTaskBtn);

            taskList.appendChild(taskElement);
        })
        
        UI.addDeleteTaskEvents(project);
        UI.addChecklistEvents(project);

    }


    //TODO: Fix event listener - when deleting a task after refreshing the page the button for deleting an individual task deletes all tasks. Beofre refreshing it works perfectly removing just the one task
    static addDeleteTaskEvents(project) {
        const deleteTaskBtns = document.querySelectorAll('.delete-task-btn');
        deleteTaskBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const taskId = btn.dataset.id;
                project.removeTask(taskId);
                let projects = Storage.loadProjects();

                const projectIndex = projects.findIndex(p => p._id === project._id);
                if (projectIndex !== -1) {
                    projects[projectIndex] = project;
                }
                Storage.saveProjects(projects);
                UI.displayTasks(project);
                
            })
        });
    }

    static addChecklistEvents(project) {
        const checklistCheckboxes = document.querySelectorAll('.task-checklist input[type="checkbox"]');
        checklistCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                // Find the task ID from the parent task element
                const taskElement = e.target.closest('.task-item');
                const taskId = taskElement.dataset.id;
                
                // Find the checklist item index
                const checklistItem = e.target.closest('.checklist-item');
                const checklistIndex = Array.from(checklistItem.parentElement.children).indexOf(checklistItem);
                
                // Get the task and update the checklist item's checked property
                const task = project.tasks.find(t => t.id === taskId);
                if (task && task.checklist[checklistIndex]) {
                    task.checklist[checklistIndex].checked = e.target.checked;
                    
                    // Load all projects
                    let projects = Storage.loadProjects();
                    
                    // Find the index of the current project
                    const projectIndex = projects.findIndex(p => p._id === project._id);
                    
                    // Update the project in the projects array
                    if (projectIndex !== -1) {
                        projects[projectIndex] = project;
                    } else {
                        projects.push(project);
                    }
                    
                    // Save all projects
                    Storage.saveProjects(projects);
                }
            });
        });
    }

}