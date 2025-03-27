export default class Project {
    static taskIdCounter = 0;
    #taskList = {};

    constructor(title) {
        this.title = title;
    }

    addTask(task) {
        this.#taskList[Project.taskIdCounter++] = task;
    }

    getTask(taskId) {
        return this.#taskList[taskId];
    }

    getTaskList() {
        return this.#taskList;
    }
}