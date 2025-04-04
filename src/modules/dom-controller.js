import { format, isToday, isTomorrow, isBefore, isThisYear, isFuture, isPast } from "date-fns";

export default class DOMController {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.loadProjects();

        // set active nav
        let homeNav = document.querySelector("#home");
        this.changeActiveNav(homeNav);
    }

    setUpEventListeners() {
        let projectListDiv = document.querySelector("#project-list");
        let contentViewContainer = document.querySelector(".content-view-container");
        let addTaskDialog = document.querySelector(".add-task-dialog");
        let dialogForm = document.querySelector(".dialog-form");
        let addProjectButton = document.querySelector("#add-project");
        let sideNav = document.querySelector(".side-nav");

        sideNav.addEventListener("click", (e) => {
            if (e.target.matches("#completed")) {
                this.loadCompletedTasksPage();
            }

            if (e.target.matches("#today")) {
                this.loadTodayPage();
            }

            if (e.target.matches("#upcoming")) {
                this.loadUpcomingPage();
            }

            if (e.target.matches("#overdue")) {
                this.loadOverDuePage();
            }

            if (e.target.matches(".nav-btn")) {
                this.changeActiveNav(e.target);
            }
        });

        projectListDiv.addEventListener("click", (e) => {
            let projectId;

            if (!e.target.matches("#project-list")) {
                projectId = Number(e.target.closest(".project-nav").dataset.id);
            }
            
            if (e.target.matches(".project-nav")) {
                this.loadProjectPage(projectId);
            }

            if (e.target.matches(".delete-project-button")) {
                // go back to home if current project is deleted
                if (Number(contentViewContainer.dataset.projectId) === projectId) {
                    this.loadProjectPage(0);
                }

                this.taskManager.deleteProject(projectId);
                console.log(this.taskManager.getProjects());
                e.target.closest(".project-nav").remove();
            }
        });

        contentViewContainer.addEventListener("click", (e) => {
            if (e.target.matches(".add-task-button")) {
                let projectInput = document.querySelector("#project-input");
                // clear project Input
                projectInput.innerHTML = "";

                let projectList = this.taskManager.getProjects();
                
                for (let id in projectList) {
                    let option = document.createElement("option");
                    option.textContent = projectList[id].title;
                    option.value = id;

                    if (id === contentViewContainer.dataset.projectId) {
                        option.selected = true;
                    }

                    projectInput.appendChild(option);
                }
                
                let dateInput = document.querySelector("#date-input");

                // clear date input
                dateInput.value = "";

                // set date input value to today if on today page
                if (contentViewContainer.dataset.type === "today") {
                    
                    dateInput.value = format(new Date(Date.now()), "yyyy-MM-dd");
                }

                addTaskDialog.show();
            }

            if (e.target.matches(".delete-button")) {
                let card = e.target.closest(".card");
                this.taskManager.deleteTask(card.dataset.projectId, card.dataset.taskId);
                card.remove();
            }

            if (e.target.matches(".card-checkbox")) {
                let card = e.target.closest(".card");
                this.taskManager.completeTask(card.dataset.projectId, card.dataset.taskId);
                card.remove();
            }
        });

        dialogForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            let titleInput = dialogForm.querySelector("#title-input").value;
            let descriptionInput = dialogForm.querySelector("#description-input").value;
            let projectId = dialogForm.querySelector("#project-input").value;
            let dateInput = dialogForm.querySelector("#date-input").value;
            let priorityInput = dialogForm.querySelector("#priority-input").value;

            let date = dateInput === "" ? dateInput : new Date(dateInput);

            // convert to null if they're empty

            titleInput = titleInput === "" ? null : titleInput;
            descriptionInput = descriptionInput === "" ? null : descriptionInput;
            dateInput = dateInput === "" ? null : dateInput;
            priorityInput = priorityInput === "" ? null : priorityInput;

            this.taskManager.newTask(projectId, titleInput, descriptionInput, date, priorityInput);
            // reload respective page
            switch (contentViewContainer.dataset.type) {
                case "today": 
                    this.loadTodayPage();
                    break;
                case "upcoming": 
                    this.loadUpcomingPage();
                    break;
                case "completed": 
                    this.loadCompletedTasksPage();
                    break;
                case "overdue": 
                    this.loadOverDuePage();
                    break;
                case "project": 
                    this.loadProjectPage(contentViewContainer.dataset.projectId);
            }

            addTaskDialog.close();
            this.clearDialogForm();
        })

        
        addTaskDialog.addEventListener("click", (e) => {
            // close dialog and clear inputs
            if (e.target.matches(".add-task-dialog") || e.target.matches("#cancel-dialog")) {
                addTaskDialog.close();

                dialogForm.querySelector("#title-input").value = "";
                dialogForm.querySelector("#description-input").value = "";
                dialogForm.querySelector("#project-input").value = 0;
                dialogForm.querySelector("#date-input").value = "";
                dialogForm.querySelector("#priority-input").value = "";
            }
        });

        addProjectButton.addEventListener("click", (e) => {
            this.createProjectNavForm();
        });

    }

    changeActiveNav(activeNav) {
        let navs = document.querySelectorAll(".nav-btn");

        Object.values(navs).forEach(navBtn => {
            if (navBtn === activeNav) {
                navBtn.classList.add("active-nav");
            } else {
                navBtn.classList.remove("active-nav");
            }
        })
    }

    loadTodayPage() {
        this.clearContentView();

        let container = document.querySelector(".content-view-container");

        // add dataset attribute to tell page type
        container.dataset.type = "today";

        // remove project id from dataset
        delete container.dataset.projectId;

        let pageHeader = document.createElement("div");
        pageHeader.classList.add("page-header");

        let pageTitle = document.createElement("div");
        pageTitle.classList.add("page-title");
        pageTitle.textContent = "Today 📆";

        let addTaskButton = document.createElement("button");


        addTaskButton.classList.add("add-task-button"); 
        addTaskButton.innerHTML = 'Add Task <svg class="add-task-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11.5 12.5V16q0 .213.144.356t.357.144t.356-.144T12.5 16v-3.5H16q.213 0 .356-.144t.144-.357t-.144-.356T16 11.5h-3.5V8q0-.213-.144-.356t-.357-.144t-.356.144T11.5 8v3.5H8q-.213 0-.356.144t-.144.357t.144.356T8 12.5zm.503 8.5q-1.867 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709"/></svg>';    

        pageHeader.appendChild(pageTitle);
        pageHeader.appendChild(addTaskButton);

        container.appendChild(pageHeader);
        
        let taskListDiv = document.createElement("div")
        taskListDiv.classList.add("task-list");

        container.appendChild(taskListDiv);

        // load tasks of current day
        let projects = this.taskManager.getProjects();

        Object.entries(projects).forEach(([projectId, project]) => {
            let projectTasks = this.taskManager.getProjectTasks(projectId);

            for (let taskId in projectTasks) {
                if (isToday(projectTasks[taskId].dueDate) && !projectTasks[taskId].isComplete) {
                    let title = projectTasks[taskId].title;
                    let description = projectTasks[taskId].description;
                    let dueDate = projectTasks[taskId].dueDate;
                    let priority = projectTasks[taskId].priority;

                    let card = this.createTodayCard(projectId, taskId, title, description, dueDate, priority);

                    taskListDiv.appendChild(card);
                }
            }
        });
    }

    loadUpcomingPage() {
        this.clearContentView();

        let container = document.querySelector(".content-view-container");

        // add dataset attribute to tell page type
        container.dataset.type = "upcoming";

        // remove project id from dataset
        delete container.dataset.projectId;

        let pageHeader = document.createElement("div");
        pageHeader.classList.add("page-header");

        let pageTitle = document.createElement("div");
        pageTitle.classList.add("page-title");
        pageTitle.textContent = "Upcoming 🗓️";

        let addTaskButton = document.createElement("button");


        addTaskButton.classList.add("add-task-button"); 
        addTaskButton.innerHTML = 'Add Task <svg class="add-task-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11.5 12.5V16q0 .213.144.356t.357.144t.356-.144T12.5 16v-3.5H16q.213 0 .356-.144t.144-.357t-.144-.356T16 11.5h-3.5V8q0-.213-.144-.356t-.357-.144t-.356.144T11.5 8v3.5H8q-.213 0-.356.144t-.144.357t.144.356T8 12.5zm.503 8.5q-1.867 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709"/></svg>';    

        pageHeader.appendChild(pageTitle);
        pageHeader.appendChild(addTaskButton);

        container.appendChild(pageHeader);
        
        let taskListDiv = document.createElement("div")
        taskListDiv.classList.add("task-list");

        container.appendChild(taskListDiv);

        // load tasks of current day
        let projects = this.taskManager.getProjects();

        Object.entries(projects).forEach(([projectId, project]) => {
            let projectTasks = this.taskManager.getProjectTasks(projectId);

            for (let taskId in projectTasks) {
                if (isFuture(projectTasks[taskId].dueDate) && !projectTasks[taskId].isComplete) {
                    let title = projectTasks[taskId].title;
                    let description = projectTasks[taskId].description;
                    let dueDate = projectTasks[taskId].dueDate;
                    let priority = projectTasks[taskId].priority;

                    let card = this.createFullInfoCard(projectId, taskId, title, description, dueDate, priority);

                    taskListDiv.appendChild(card);
                }
            }
        });
    }

    loadCompletedTasksPage() {
        this.clearContentView();

        let container = document.querySelector(".content-view-container");

        // add dataset attribute to tell page type
        container.dataset.type = "completed";

        // remove project id from dataset
        delete container.dataset.projectId;

        let pageHeader = document.createElement("div");
        pageHeader.classList.add("page-header");

        let pageTitle = document.createElement("div");
        pageTitle.classList.add("page-title");
        pageTitle.textContent = "Completed ☑️";

        pageHeader.appendChild(pageTitle);

        container.appendChild(pageHeader);
        
        let taskListDiv = document.createElement("div")
        taskListDiv.classList.add("task-list");

        container.appendChild(taskListDiv);

        // load completed tasks
        let projects = this.taskManager.getProjects();

        Object.entries(projects).forEach(([projectId, project]) => {
            let projectTasks = this.taskManager.getProjectTasks(projectId);

            for (let taskId in projectTasks) {
                if (projectTasks[taskId].isComplete) {
                    let title = projectTasks[taskId].title;
                    let description = projectTasks[taskId].description;
                    let dueDate = projectTasks[taskId].dueDate;
                    let priority = projectTasks[taskId].priority;

                    let card = this.createCompletedCard(projectId, taskId, title, description, dueDate, priority);

                    taskListDiv.appendChild(card);
                }
            }
        });
    }

    loadOverDuePage() {
        this.clearContentView();

        let container = document.querySelector(".content-view-container");

        // add dataset attribute to tell page type
        container.dataset.type = "overdue";

        // remove project id from dataset
        delete container.dataset.projectId;

        let pageHeader = document.createElement("div");
        pageHeader.classList.add("page-header");

        let pageTitle = document.createElement("div");
        pageTitle.classList.add("page-title");
        pageTitle.textContent = "Overdue ❗";

        pageHeader.appendChild(pageTitle);

        container.appendChild(pageHeader);
        
        let taskListDiv = document.createElement("div")
        taskListDiv.classList.add("task-list");

        container.appendChild(taskListDiv);

        // load tasks of current day
        let projects = this.taskManager.getProjects();

        Object.entries(projects).forEach(([projectId, project]) => {
            let projectTasks = this.taskManager.getProjectTasks(projectId);

            for (let taskId in projectTasks) {
                if ( projectTasks[taskId].dueDate
                    && !isToday(projectTasks[taskId].dueDate) 
                    && isBefore(projectTasks[taskId].dueDate, Date.now()) 
                    && !projectTasks[taskId].isComplete) {
                    let title = projectTasks[taskId].title;
                    let description = projectTasks[taskId].description;
                    let dueDate = projectTasks[taskId].dueDate;
                    let priority = projectTasks[taskId].priority;

                    let card = this.createFullInfoCard(projectId, taskId, title, description, dueDate, priority);

                    taskListDiv.appendChild(card);
                }
            }
        });
    }

    loadProjectPage(projectId) {
        this.clearContentView();

        let container = document.querySelector(".content-view-container");

        // add dataset attribute to tell page type
        container.dataset.type = "project";

        // set project id to the container
        container.dataset.projectId = projectId;

        let pageHeader = document.createElement("div");
        pageHeader.classList.add("page-header");

        let pageTitle = document.createElement("div");
        pageTitle.classList.add("page-title");
        pageTitle.textContent = this.taskManager.getProject(projectId).title;

        let addTaskButton = document.createElement("button");


        addTaskButton.classList.add("add-task-button"); 
        addTaskButton.innerHTML = 'Add Task <svg class="add-task-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11.5 12.5V16q0 .213.144.356t.357.144t.356-.144T12.5 16v-3.5H16q.213 0 .356-.144t.144-.357t-.144-.356T16 11.5h-3.5V8q0-.213-.144-.356t-.357-.144t-.356.144T11.5 8v3.5H8q-.213 0-.356.144t-.144.357t.144.356T8 12.5zm.503 8.5q-1.867 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709"/></svg>';    

        pageHeader.appendChild(pageTitle);
        pageHeader.appendChild(addTaskButton);

        container.appendChild(pageHeader);
        
        let taskListDiv = document.createElement("div")
        taskListDiv.classList.add("task-list");

        container.appendChild(taskListDiv);

        // load tasks
        let projectTasks = this.taskManager.getProjectTasks(projectId);
        

        for (let taskId in projectTasks) {
            if (!projectTasks[taskId].isComplete) {
                let title = projectTasks[taskId].title;
                let description = projectTasks[taskId].description;
                let dueDate = projectTasks[taskId].dueDate;
                let priority = projectTasks[taskId].priority;

                let card = this.createCard(projectId, taskId, title, description, dueDate, priority);

                taskListDiv.appendChild(card);
            }
        };
    }

    loadProjects() {
        let projects = this.taskManager.getProjects();

        // clear project list div
        let projectListDiv = document.querySelector("#project-list");
        projectListDiv.innerHTML = "";

        for (const id in projects) {
            this.createProjectNav(id, projects[id]);
        }
    }

    clearContentView() {
        let contentViewContainer = document.querySelector(".content-view-container");
        contentViewContainer.innerHTML = "";
    }

    clearDialogForm() {
        let dialogForm = document.querySelector(".dialog-form");

        dialogForm.querySelector("#title-input").value = "";
        dialogForm.querySelector("#description-input").value = "";
        dialogForm.querySelector("#project-input").value = 0;
        dialogForm.querySelector("#date-input").value = "";
        dialogForm.querySelector("#priority-input").value = "";
    }

    // components section
    createCard(projectId, taskId, title, description, dueDate, priority) {
        let card = document.createElement("div");
        
        card.dataset.projectId = projectId;
        card.dataset.taskId = taskId;
        card.classList.add("card");

        // card radio checkbox
        let radioInput = document.createElement("input")
        radioInput.type = "radio";
        radioInput.classList.add("card-checkbox");

        card.appendChild(radioInput);

        // card info section
        let cardInfo = document.createElement("div");
        cardInfo.classList.add("card-info");

        let taskTitle = document.createElement("div");
        taskTitle.classList.add("task-title");
        taskTitle.textContent = title;

        let extraInfo = document.createElement("div");
        extraInfo.classList.add("extra-info");

        if (dueDate) {
            let dateTag = document.createElement("div");
            dateTag.classList.add("extra-info-tag");
            
            if (isToday(dueDate)) {
                dueDate = "Today";
                dateTag.classList.add("today");
            } else if (isTomorrow(dueDate)) {
                dueDate = "Tomorrow";
                dateTag.classList.add("tomorrow");
            } else if (isBefore(dueDate,  Date.now())) {
                dueDate = "Overdue";
                dateTag.classList.add("pastToday");
            } else if (isThisYear(dueDate)) {
                dueDate = format(dueDate, "d MMM");
            } else if (!isThisYear(dueDate)) {
                dueDate = format(dueDate, "d MMM yyyy");
            }

            dateTag.innerHTML = `
                <svg class="card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="M4 7v2h16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 5h2a2 2 0 0 1 2 2v2H4V7a2 2 0 0 1 2-2h2m8 0V3m0 2H8m0-2v2M4 9.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.5"/></g></svg>
                ${dueDate}
            `
            extraInfo.appendChild(dateTag);
        }

        cardInfo.appendChild(taskTitle);
        cardInfo.appendChild(extraInfo);

        card.appendChild(cardInfo);

        // card options
        let cardOptions = document.createElement("div");
        cardOptions.classList.add("card-options");

        let editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h8.386l-1 1H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192h12.77q.23 0 .423-.192t.192-.423v-7.489l1-1v8.489q0 .69-.462 1.153T18.384 20zM10 14v-2.615l8.944-8.944q.166-.166.348-.23t.385-.063q.189 0 .368.064t.326.21L21.483 3.5q.16.166.242.365t.083.4t-.061.382q-.06.18-.226.345L12.52 14zm10.814-9.715l-1.112-1.17zM11 13h1.092l6.666-6.666l-.546-.546l-.61-.584L11 11.806zm7.212-7.211l-.61-.585zl.546.546z" stroke-width="0.2" stroke="currentColor"/></svg>`;

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z" stroke-width="0.2" stroke="currentColor"/></svg>`;

        cardOptions.appendChild(editButton);
        cardOptions.appendChild(deleteButton);

        card.appendChild(cardOptions);

        // add priority for card
        if (priority === "high") {
            card.classList.add("high-priority");
        } else if (priority === "medium") {
            card.classList.add("medium-priority");
        } else if (priority === "low") {
            card.classList.add("low-priority");
        }

        return card;
        
    }

    createCompletedCard(projectId, taskId, title, description, dueDate, priority) {
        let card = document.createElement("div");
        
        card.dataset.projectId = projectId;
        card.dataset.taskId = taskId;
        card.classList.add("card");

        // card info section
        let cardInfo = document.createElement("div");
        cardInfo.classList.add("card-info");

        let taskTitle = document.createElement("div");
        taskTitle.classList.add("task-title");
        taskTitle.classList.add("completed-task-title");
        taskTitle.textContent = title;

        let extraInfo = document.createElement("div");
        extraInfo.classList.add("extra-info");

        let projectTitle = this.taskManager.getProject(projectId).title;

        let projectTag = document.createElement("div");
        projectTag.classList.add("extra-info-tag");
        projectTag.innerHTML = `
                <svg class="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h4.31q.323 0 .628.13q.305.132.522.349L11.596 7h7.789q.69 0 1.153.463T21 8.616v8.769q0 .69-.462 1.153T19.385 19zm0-1h14.769q.269 0 .442-.173t.173-.442v-8.77q0-.269-.173-.442T19.385 8h-8.19L9.366 6.173q-.096-.096-.202-.134Q9.06 6 8.946 6h-4.33q-.269 0-.442.173T4 6.616v10.769q0 .269.173.442t.443.173M4 18V6zm10.9-3.338l1.392 1.063q.131.087.24.006t.059-.217l-.51-1.741l1.461-1.188q.106-.087.056-.22q-.05-.134-.186-.134h-1.766l-.554-1.685q-.05-.136-.192-.136t-.192.136l-.554 1.685h-1.765q-.137 0-.187.134q-.05.133.056.22l1.461 1.188l-.51 1.74q-.05.137.06.218t.239-.006z"/></svg>
                ${projectTitle}
            `;

        extraInfo.appendChild(projectTag);


        cardInfo.appendChild(taskTitle);
        cardInfo.appendChild(extraInfo);

        card.appendChild(cardInfo);

        // card options
        let cardOptions = document.createElement("div");
        cardOptions.classList.add("card-options");

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z" stroke-width="0.2" stroke="currentColor"/></svg>`;

        cardOptions.appendChild(deleteButton);

        card.appendChild(cardOptions);

        return card;
    }

    createTodayCard(projectId, taskId, title, description, dueDate, priority) {
        let card = document.createElement("div");
        
        card.dataset.projectId = projectId;
        card.dataset.taskId = taskId;
        card.classList.add("card");

        // card radio checkbox
        let radioInput = document.createElement("input")
        radioInput.type = "radio";
        radioInput.classList.add("card-checkbox");

        card.appendChild(radioInput);

        // card info section
        let cardInfo = document.createElement("div");
        cardInfo.classList.add("card-info");

        let taskTitle = document.createElement("div");
        taskTitle.classList.add("task-title");
        taskTitle.textContent = title;

        let extraInfo = document.createElement("div");
        extraInfo.classList.add("extra-info");

        let projectTitle = this.taskManager.getProject(projectId).title;

        let projectTag = document.createElement("div");
        projectTag.classList.add("extra-info-tag");
        projectTag.innerHTML = `
                <svg class="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h4.31q.323 0 .628.13q.305.132.522.349L11.596 7h7.789q.69 0 1.153.463T21 8.616v8.769q0 .69-.462 1.153T19.385 19zm0-1h14.769q.269 0 .442-.173t.173-.442v-8.77q0-.269-.173-.442T19.385 8h-8.19L9.366 6.173q-.096-.096-.202-.134Q9.06 6 8.946 6h-4.33q-.269 0-.442.173T4 6.616v10.769q0 .269.173.442t.443.173M4 18V6zm10.9-3.338l1.392 1.063q.131.087.24.006t.059-.217l-.51-1.741l1.461-1.188q.106-.087.056-.22q-.05-.134-.186-.134h-1.766l-.554-1.685q-.05-.136-.192-.136t-.192.136l-.554 1.685h-1.765q-.137 0-.187.134q-.05.133.056.22l1.461 1.188l-.51 1.74q-.05.137.06.218t.239-.006z"/></svg>
                ${projectTitle}
            `;

        extraInfo.appendChild(projectTag);

        cardInfo.appendChild(taskTitle);
        cardInfo.appendChild(extraInfo);

        card.appendChild(cardInfo);

        // card options
        let cardOptions = document.createElement("div");
        cardOptions.classList.add("card-options");

        let editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h8.386l-1 1H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192h12.77q.23 0 .423-.192t.192-.423v-7.489l1-1v8.489q0 .69-.462 1.153T18.384 20zM10 14v-2.615l8.944-8.944q.166-.166.348-.23t.385-.063q.189 0 .368.064t.326.21L21.483 3.5q.16.166.242.365t.083.4t-.061.382q-.06.18-.226.345L12.52 14zm10.814-9.715l-1.112-1.17zM11 13h1.092l6.666-6.666l-.546-.546l-.61-.584L11 11.806zm7.212-7.211l-.61-.585zl.546.546z" stroke-width="0.2" stroke="currentColor"/></svg>`;

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z" stroke-width="0.2" stroke="currentColor"/></svg>`;

        cardOptions.appendChild(editButton);
        cardOptions.appendChild(deleteButton);

        card.appendChild(cardOptions);

        // add priority for card
        if (priority === "high") {
            card.classList.add("high-priority");
        } else if (priority === "medium") {
            card.classList.add("medium-priority");
        } else if (priority === "low") {
            card.classList.add("low-priority");
        }

        return card;
    }

    createFullInfoCard(projectId, taskId, title, description, dueDate, priority) {
        let card = document.createElement("div");
        
        card.dataset.projectId = projectId;
        card.dataset.taskId = taskId;
        card.classList.add("card");

        // card radio checkbox
        let radioInput = document.createElement("input")
        radioInput.type = "radio";
        radioInput.classList.add("card-checkbox");

        card.appendChild(radioInput);

        // card info section
        let cardInfo = document.createElement("div");
        cardInfo.classList.add("card-info");

        let taskTitle = document.createElement("div");
        taskTitle.classList.add("task-title");
        taskTitle.textContent = title;

        let extraInfo = document.createElement("div");
        extraInfo.classList.add("extra-info");

        let projectTitle = this.taskManager.getProject(projectId).title;

        let projectTag = document.createElement("div");
        projectTag.classList.add("extra-info-tag");
        projectTag.innerHTML = `
                <svg class="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h4.31q.323 0 .628.13q.305.132.522.349L11.596 7h7.789q.69 0 1.153.463T21 8.616v8.769q0 .69-.462 1.153T19.385 19zm0-1h14.769q.269 0 .442-.173t.173-.442v-8.77q0-.269-.173-.442T19.385 8h-8.19L9.366 6.173q-.096-.096-.202-.134Q9.06 6 8.946 6h-4.33q-.269 0-.442.173T4 6.616v10.769q0 .269.173.442t.443.173M4 18V6zm10.9-3.338l1.392 1.063q.131.087.24.006t.059-.217l-.51-1.741l1.461-1.188q.106-.087.056-.22q-.05-.134-.186-.134h-1.766l-.554-1.685q-.05-.136-.192-.136t-.192.136l-.554 1.685h-1.765q-.137 0-.187.134q-.05.133.056.22l1.461 1.188l-.51 1.74q-.05.137.06.218t.239-.006z"/></svg>
                ${projectTitle}
            `;

        extraInfo.appendChild(projectTag);

        if (dueDate) {
            let dateTag = document.createElement("div");
            dateTag.classList.add("extra-info-tag");
            
            if (isToday(dueDate)) {
                dueDate = "Today";
                dateTag.classList.add("today");
            } else if (isTomorrow(dueDate)) {
                dueDate = "Tomorrow";
                dateTag.classList.add("tomorrow");
            } else if (isBefore(dueDate,  Date.now())) {
                dueDate = "Overdue";
                dateTag.classList.add("pastToday");
            } else if (isThisYear(dueDate)) {
                dueDate = format(dueDate, "d MMM");
            } else if (!isThisYear(dueDate)) {
                dueDate = format(dueDate, "d MMM yyyy");
            }

            dateTag.innerHTML = `
                <svg class="card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="M4 7v2h16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 5h2a2 2 0 0 1 2 2v2H4V7a2 2 0 0 1 2-2h2m8 0V3m0 2H8m0-2v2M4 9.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.5"/></g></svg>
                ${dueDate}
            `
            extraInfo.appendChild(dateTag);
        }

        cardInfo.appendChild(taskTitle);
        cardInfo.appendChild(extraInfo);

        card.appendChild(cardInfo);

        // card options
        let cardOptions = document.createElement("div");
        cardOptions.classList.add("card-options");

        let editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h8.386l-1 1H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192h12.77q.23 0 .423-.192t.192-.423v-7.489l1-1v8.489q0 .69-.462 1.153T18.384 20zM10 14v-2.615l8.944-8.944q.166-.166.348-.23t.385-.063q.189 0 .368.064t.326.21L21.483 3.5q.16.166.242.365t.083.4t-.061.382q-.06.18-.226.345L12.52 14zm10.814-9.715l-1.112-1.17zM11 13h1.092l6.666-6.666l-.546-.546l-.61-.584L11 11.806zm7.212-7.211l-.61-.585zl.546.546z" stroke-width="0.2" stroke="currentColor"/></svg>`;

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z" stroke-width="0.2" stroke="currentColor"/></svg>`;

        cardOptions.appendChild(editButton);
        cardOptions.appendChild(deleteButton);

        card.appendChild(cardOptions);

        // add priority for card
        if (priority === "high") {
            card.classList.add("high-priority");
        } else if (priority === "medium") {
            card.classList.add("medium-priority");
        } else if (priority === "low") {
            card.classList.add("low-priority");
        }

        return card;
    }

    createProjectNav(projectId, project) {
        let projectListDiv = document.querySelector("#project-list");

        let projectNav = document.createElement("button");
        projectNav.classList.add("nav-btn", "project-nav");
        projectNav.innerHTML = '<svg class="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h4.31q.323 0 .628.13q.305.132.522.349L11.596 7h7.789q.69 0 1.153.463T21 8.616v8.769q0 .69-.462 1.153T19.385 19zm0-1h14.769q.269 0 .442-.173t.173-.442v-8.77q0-.269-.173-.442T19.385 8h-8.19L9.366 6.173q-.096-.096-.202-.134Q9.06 6 8.946 6h-4.33q-.269 0-.442.173T4 6.616v10.769q0 .269.173.442t.443.173M4 18V6zm10.9-3.338l1.392 1.063q.131.087.24.006t.059-.217l-.51-1.741l1.461-1.188q.106-.087.056-.22q-.05-.134-.186-.134h-1.766l-.554-1.685q-.05-.136-.192-.136t-.192.136l-.554 1.685h-1.765q-.137 0-.187.134q-.05.133.056.22l1.461 1.188l-.51 1.74q-.05.137.06.218t.239-.006z"/></svg>'
        projectNav.dataset.id = projectId;

        let navTitle = document.createElement("div");
        navTitle.textContent = project.title;
        navTitle.classList.add("nav-btn-text");

        let taskCount = document.createElement("div");
        taskCount.classList.add("task-count");
        let count = Object.keys(project.getTaskList()).length;
        taskCount.textContent = count === 0 ? "" : count;

        let deleteProjectButton = document.createElement("button");
        deleteProjectButton.classList.add("delete-project-button");
        deleteProjectButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z" stroke-width="0.2" stroke="currentColor"/></svg>`;
    
        projectNav.appendChild(navTitle);
        projectNav.appendChild(taskCount);

        if (projectId != 0) projectNav.appendChild(deleteProjectButton);

        if (projectId == 0) projectNav.id = "home";

        projectListDiv.appendChild(projectNav);
    }

    createProjectNavForm() {
        let projectListDiv = document.querySelector("#project-list");

        let projectNav = document.createElement("form");
        projectNav.classList.add("nav-form");
        projectNav.innerHTML = '<svg class="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h4.31q.323 0 .628.13q.305.132.522.349L11.596 7h7.789q.69 0 1.153.463T21 8.616v8.769q0 .69-.462 1.153T19.385 19zm0-1h14.769q.269 0 .442-.173t.173-.442v-8.77q0-.269-.173-.442T19.385 8h-8.19L9.366 6.173q-.096-.096-.202-.134Q9.06 6 8.946 6h-4.33q-.269 0-.442.173T4 6.616v10.769q0 .269.173.442t.443.173M4 18V6zm10.9-3.338l1.392 1.063q.131.087.24.006t.059-.217l-.51-1.741l1.461-1.188q.106-.087.056-.22q-.05-.134-.186-.134h-1.766l-.554-1.685q-.05-.136-.192-.136t-.192.136l-.554 1.685h-1.765q-.137 0-.187.134q-.05.133.056.22l1.461 1.188l-.51 1.74q-.05.137.06.218t.239-.006z"/></svg>';

        let navTitleInput = document.createElement("input");
        navTitleInput.type = "text";
        navTitleInput.name = "project-title";
        navTitleInput.placeholder = "Project Title";

        navTitleInput.classList.add("nav-form-input");

        let taskCount = document.createElement("div");
        taskCount.classList.add("task-count");

        projectNav.appendChild(navTitleInput);
        projectNav.appendChild(taskCount);

        projectListDiv.appendChild(projectNav);

        navTitleInput.focus();

        // submit when clicked outside of form 
        projectNav.addEventListener("focusout", (e) => {
            projectNav.requestSubmit();
        });

        projectNav.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const projectTitle = formData.get("project-title");

            if (!projectTitle) {
                projectNav.remove();
            }
            else {
                this.taskManager.newProject(projectTitle);
                this.loadProjects();
            }
        })
    }
}