import Project from "./project";
import Task from "./task";
import TaskManager from "./task-manager";

export default function () {
    let saveFile = localStorage.getItem("todoSaveFile");
    
    if (saveFile) {
        let taskManager = new TaskManager();

        saveFile = JSON.parse(saveFile);

        taskManager.taskIdCounter = saveFile.taskIdCounter;
        taskManager.projectIdCounter = saveFile.projectIdCounter;
        
        let newProjectList = {};

        let projectList = saveFile.projectList;

        Object.entries(projectList).forEach(([projectId, project]) => {

            // create new project class
            let newProject = new Project(project.title);

            Object.entries(project.taskList).forEach(([taskId, task]) => {
                task.dueDate = task.dueDate ? new Date(task.dueDate) : null;

                // create new task class from object
                let newTask = new Task(task.title);
                newTask.description = task.description;
                newTask.dueDate = task.dueDate;
                newTask.priority = task.priority;
                newTask.isComplete = task.isComplete

                // add task to project
                newProject.addTask(newTask, taskId);
            });

            // add project to project list

            newProjectList[projectId] = newProject;
        });

        taskManager.projectList = newProjectList;

        return taskManager;
    } else {
        return;
    }
}