export default class Task {
    description = null;
    dueDate = null;
    priority = null;
    isComplete = false;

    constructor(title) {
        this.title = title;
    }
}