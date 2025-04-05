export default class Project {
    taskList = {};

    constructor(title) {
        this.title = title;
    }

    addTask(task, taskId) {
        this.taskList[taskId] = task;
    }

    getTask(taskId) {
        return this.taskList[taskId];
    }

    getTaskList() {
        return this.taskList;
    }
}