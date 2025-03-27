import Project from "./project";
import Task from "./task";

export default class TaskManager {
    static projectIdCounter;
    #projectList = {};

    constructor(projectIdCounter = 0) {
        TaskManager.projectIdCounter = projectIdCounter;
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

        this.#projectList[projectId].addTask(task);
    }

    newProject(projectTitle) {
        let project = new Project(projectTitle);
        this.#projectList[TaskManager.projectIdCounter++] = project;
    }

    getProjects() {
        return this.#projectList;
    }
}