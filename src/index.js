import "./styles/reset.css";
import "./styles/global.css";
import "./styles/tasks.css";
import displayDate from "./modules/display-date";
import TaskManager from "./modules/task-manager.js";
import DomController from "./modules/dom-controller.js";
import {add, sub} from "date-fns";
import saveTasks from "./modules/saveTasks.js";
import loadTasks from "./modules/loadTasks.js";

displayDate();

// load theme from localStorage
let storedTheme = localStorage.getItem("todoTheme");

if (storedTheme) {
    document.documentElement.classList.add(storedTheme);
} else {
    // load preferred theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.add(prefersDark ? "dark" : "light");
}

// load task manager from local storage
let taskManager = loadTasks();

// load sample data if save file does not exist
if (!taskManager) {
    taskManager = new TaskManager();
    // create default home project
    taskManager.newProject("Home 🏠");

    // create quick task project
    taskManager.newProject("Quick Tasks");

    // create sample tasks

    taskManager.newTask(0, "Completed Task", "This is a sample task", null, null);
    taskManager.completeTask(0, 0);
    taskManager.newTask(0, "High Priority task today", "This is a sample task",  new Date(Date.now()), "high");
    taskManager.newTask(0, "Medium Priority task upcoming", "This is a sample task", new add(Date.now(), {"years": 1}), "medium");
    taskManager.newTask(0, "Low Priority task overdue", "This is a sample task", new sub(Date.now(), {"days": 1}), "low");
    taskManager.newTask(0, "Regular task without date", "This is a sample task", null, null);

    // save tasks
    saveTasks(taskManager);
}

let domController = new DomController(taskManager);

// open home project by default
domController.loadProjectPage(0);

domController.setUpEventListeners();