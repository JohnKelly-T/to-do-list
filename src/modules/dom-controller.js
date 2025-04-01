export default class DOMController {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.loadProjects();
    }

    setUpEventListeners() {
        let projectListDiv = document.querySelector("#project-list");

        projectListDiv.addEventListener("click", (e) => {
            let navButton = e.target.closest(".project-nav");
            
            if (navButton) {
                let projectId = Number(navButton.dataset.id);
                let projectTitle = this.taskManager.getProject(projectId).title;
                let taskList = this.taskManager.getProjectTasks(projectId);
                this.loadTasksPage(projectTitle, taskList);
            }
        });
    }

    loadTasksPage(headerTitle, taskList, withAddButton = true) {
        let container = document.querySelector(".content-view-container");

        let pageHeader = document.createElement("div");
        pageHeader.classList.add("page-header");

        let pageTitle = document.createElement("div");
        pageTitle.classList.add("page-title");
        pageTitle.textContent = headerTitle;

        let addTaskButton = document.createElement("button");

        if (withAddButton) {
            addTaskButton.classList.add("add-task-button"); 
            addTaskButton.innerHTML = 'Add Task <svg class="add-task-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11.5 12.5V16q0 .213.144.356t.357.144t.356-.144T12.5 16v-3.5H16q.213 0 .356-.144t.144-.357t-.144-.356T16 11.5h-3.5V8q0-.213-.144-.356t-.357-.144t-.356.144T11.5 8v3.5H8q-.213 0-.356.144t-.144.357t.144.356T8 12.5zm.503 8.5q-1.867 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709"/></svg>';    
        }
        
        let sortDropdown = document.createElement("div");
        sortDropdown.classList.add("sort-dropdown");

        let sortButton = document.createElement("button");
        sortButton.classList.add("sort-button");
        sortButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m10.5 12.5l4 4.107l4-4.107m-8-4l-4-4l-4 3.997m4-3.997v12m8-12v12" stroke-width="1.2"/></svg>';

        let sortDropdownMenu = document.createElement("div");
        sortDropdownMenu.classList.add("sort-dropdown-menu");

        let sortDateAdded = document.createElement("button");
        sortDateAdded.setAttribute("data-value", "date-added");
        sortDateAdded.textContent = "Date Added";

        let sortPriority = document.createElement("button");
        sortPriority.setAttribute("data-value", "priority");
        sortPriority.textContent = "Priority";

        let sortDueDate = document.createElement("button");
        sortDueDate.setAttribute("data-value", "due-date");
        sortDueDate.textContent = "Due Date";

        sortDropdownMenu.appendChild(sortDateAdded);
        sortDropdownMenu.appendChild(sortPriority);
        sortDropdownMenu.appendChild(sortDueDate);

        sortDropdown.appendChild(sortButton);
        sortDropdown.appendChild(sortDropdownMenu);

        pageHeader.appendChild(pageTitle);

        if (withAddButton) pageHeader.appendChild(addTaskButton);

        pageHeader.appendChild(sortDropdown);

        container.appendChild(pageHeader);

    }

    loadProjects() {
        let projects = this.taskManager.getProjects();
        for (const id in projects) {
            this.createProjectNav(id, projects[id]);
        }
    }

    createProjectNav(projectId, project) {
        console.log(project.title);
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

        projectNav.appendChild(navTitle);
        projectNav.appendChild(taskCount);

        projectListDiv.appendChild(projectNav);
    }
}