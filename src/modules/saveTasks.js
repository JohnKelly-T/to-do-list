export default function (taskManager) {
    // create savefile

    let saveFile = {
        "taskIdCounter": taskManager.taskIdCounter,
        "projectIdCounter": taskManager.projectIdCounter,
        "projectList": taskManager.getProjects()
    }

    localStorage.setItem("todoSaveFile", JSON.stringify(saveFile));
}