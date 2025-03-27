import Project from "./project";
import Task from "./task";

export default class TaskManager {
    #taskIdCounter = 0;
    #projectIdCounter = 0;
    #projectList = {};

    set projectIdCounter(storedCounter) {
        this.#projectIdCounter = storedCounter;
    }

    set taskIdCounter(storedCounter) {
        this.#taskIdCounter = storedCounter;
    }

    newTask(projectId, title, description, dueDate, priority) {
        let task = new Task(title);

        if (description !== null) {
            task.description = description;
        }

        if (dueDate !== null) {
            task.dueDate = dueDate;
        }

        if (priority !== null) {
            task.priority = priority;
        }

        this.#projectList[projectId].addTask(task, this.#taskIdCounter++);
    }

    getTask(projectId, taskId) {
        let task = this.#projectList[projectId].getTask(taskId);

        // return only a copy of task
        return { ...task };
    }

    editTask(projectId, taskId, title, description, dueDate, priority) {
        let task = this.#projectList[projectId].getTask(taskId);

        if (title !== null) {
            task.title = title;
        }

        if (description !== null) {
            task.description = description;
        }

        if (dueDate !== null) {
            task.dueDate = dueDate;
        }

        if (priority !== null) {
            task.priority = priority;
        }
    }

    deleteTask(projectId, taskId) {
        delete this.#projectList[projectId].getTaskList()[taskId];
    }

    newProject(projectTitle) {
        let project = new Project(projectTitle);
        this.#projectList[this.#projectIdCounter++] = project;
    }

    editProject(projectId, newProjectTitle) {
        this.#projectList[projectId].title = newProjectTitle;
    }

    deleteProject(projectId) {
        delete this.#projectList[projectId];
    }

    getProjects() {
        return this.#projectList;
    }

    getProjectTasks(projectId) {
        let tasks = [];

        Object.values(this.#projectList[projectId].getTaskList()).forEach(task => {
            tasks.push(task);
        });

        return tasks;
    }

    getCompletedTasks() {
        let tasks = [];

        Object.values(this.#projectList).forEach( project => {
            Object.values(project.getTaskList()).forEach(task => {
                if (task.isComplete) {
                    tasks.push(task);
                }
            });
        });

        return tasks;
    }

    getAllTasks() {
        let tasks = [];

        Object.values(this.#projectList).forEach( project => {
            Object.values(project.getTaskList()).forEach(task => {
                tasks.push(task);
            });
        });

        return tasks;
    }
}