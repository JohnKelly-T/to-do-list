import "./styles/reset.css";
import "./styles/global.css";
import displayDate from "./modules/display-date";
import TaskManager from "./modules/task-manager.js";
import DomController from "./modules/dom-controller.js";

displayDate();

let taskManager = new TaskManager();

// create default home project
taskManager.newProject("Home 🏠");

let domController = new DomController(taskManager);

domController.setUpEventListeners();