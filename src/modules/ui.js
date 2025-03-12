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

            const editProjectBtn = document.createElement('button');
            editProjectBtn.className = 'edit-project-btn';
            editProjectBtn.textContent = 'Edit';
            projectElement.appendChild(editProjectBtn);

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

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'task-button-container';
            taskElement.appendChild(buttonContainer);

            const deleteTaskBtn = document.createElement('button');
            deleteTaskBtn.className = 'delete-task-btn';
            deleteTaskBtn.textContent = 'Delete';
            deleteTaskBtn.dataset.id = task.id;
            buttonContainer.appendChild(deleteTaskBtn);

            const editTaskBtn = document.createElement('button');
            editTaskBtn.className = 'edit-task-btn';
            editTaskBtn.textContent = 'Edit';
            editTaskBtn.dataset.id = task.id;
            buttonContainer.appendChild(editTaskBtn);


            taskList.appendChild(taskElement);
        })
        
        UI.addDeleteTaskEvents(project);
        UI.addChecklistEvents(project);
        UI.addEditTaskEvents(project);

    }

    static displayEditTaskForm(task) {
        const form = document.querySelector('#edit-task-form-wrapper');
        form.classList.toggle('hidden');
        console.log('Form visibility toggled.'); // Debugging log
        console.log('Form visibility:', !form.classList.contains('hidden'));
        
        const taskTitle = document.querySelector('#edit-task-name');
        const taskDescription = document.querySelector('#edit-task-description');
        const taskDueDate = document.querySelector('#edit-task-due-date');
        const taskPriority = document.querySelector('#edit-task-priority');
        const taskStatus = document.querySelector('#edit-task-status');
        const taskNotes = document.querySelector('#edit-task-notes');
        const taskChecklist = document.querySelector('#edit-checklist-items');
        
        console.log('Displaying edit form for task:', task); // Debugging log
    
        taskTitle.value = task.title;
        console.log('Task title:', taskTitle.value); // Debugging log
        taskDescription.value = task.description;
        console.log('Task description:', taskDescription.value); // Debugging log

        // not filling the field with any date - returns date in dd/mm/yyyy correctly
        taskDueDate.value = task.getFormattedDate();
        console.log('Task due date:', taskDueDate.value); // Debugging log
        taskPriority.value = task.priority;
        console.log('Task priority:', taskPriority.value); // Debugging log
        taskStatus.value = task.status;
        console.log('Task status:', taskStatus.value); // Debugging log
        taskNotes.value = task.notes.join('\n');
        console.log('Task notes:', taskNotes.value); // Debugging log
        
        taskChecklist.innerHTML = '';
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
            taskChecklist.appendChild(checklistItem);
        });
    
        console.log('Edit form fields updated.'); // Debugging log
    }

    static addEditTaskEvents(project) {
        const editTaskBtns = document.querySelectorAll('.edit-task-btn');
        console.log(`Found ${editTaskBtns.length} edit task buttons.`); // Debugging log
    
        if (editTaskBtns.length === 0) {
            console.log('No edit task buttons found.');
            return;
        }
    
        editTaskBtns.forEach(btn => {
            console.log('Attaching event listener to edit task button.'); // Debugging log
            btn.addEventListener('click', () => {
                const taskId = btn.closest('.task-item').dataset.id;
                console.log(`Edit button clicked for task ID: ${taskId}`); // Debugging log
                const task = project.tasks.find(t => t.id === taskId);
                if (task) {
                    UI.displayEditTaskForm(task);
                } else {
                    console.log(`Task with ID ${taskId} not found.`);
                }
            });
        });
    }

    // TODO: add event listeners to edit task form
    // TODO: add edit project form and event listeners
    // TODO: add close buttons to forms
    // TODO: remove debugging logs

    
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
                
                const taskElement = e.target.closest('.task-item');
                const taskId = taskElement.dataset.id;
                
                
                const checklistItem = e.target.closest('.checklist-item');
                const checklistIndex = Array.from(checklistItem.parentElement.children).indexOf(checklistItem);
                
                
                const task = project.tasks.find(t => t.id === taskId);
                if (task && task.checklist[checklistIndex]) {
                    task.checklist[checklistIndex].checked = e.target.checked;
                    
                    
                    let projects = Storage.loadProjects();
                    
                    
                    const projectIndex = projects.findIndex(p => p._id === project._id);
                    
                    
                    if (projectIndex !== -1) {
                        projects[projectIndex] = project;
                    } else {
                        projects.push(project);
                    }
                    
                    
                    Storage.saveProjects(projects);
                }
            });
        });
    }

}