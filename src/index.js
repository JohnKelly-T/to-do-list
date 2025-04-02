import "./styles/reset.css";
import "./styles/global.css";
import "./styles/tasks.css";
import displayDate from "./modules/display-date";
import TaskManager from "./modules/task-manager.js";
import DomController from "./modules/dom-controller.js";

displayDate();

let taskManager = new TaskManager();

// create default home project
taskManager.newProject("Home 🏠");

let domController = new DomController(taskManager);

// open home project by default
domController.loadTasksPage("Home 🏠", taskManager.getProjectTasks(0));

domController.setUpEventListeners();