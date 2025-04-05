import "./styles/reset.css";
import "./styles/global.css";
import "./styles/tasks.css";
import displayDate from "./modules/display-date";
import TaskManager from "./modules/task-manager.js";
import DomController from "./modules/dom-controller.js";
import {add, sub} from "date-fns";

displayDate();

let taskManager = new TaskManager();

// create default home project
taskManager.newProject("Home 🏠");

// create quick task project
taskManager.newProject("Quick Tasks");

// create sample 
// normal task no date no priority
taskManager.newTask(0, "Completed Task", "This is a sample task", null, null);
taskManager.completeTask(0, 0);

taskManager.newTask(0, "High Priority task today", "This is a sample task",  new Date(Date.now()), "high");
// task with date
taskManager.newTask(0, "Medium Priority task upcoming", "This is a sample task", new add(Date.now(), {"years": 1}), "medium");
// tasks with different priorities
taskManager.newTask(0, "Low Priority task overdue", "This is a sample task", new sub(Date.now(), {"days": 1}), "low");
taskManager.newTask(0, "Regular task without date", "This is a sample task", null, null);

let domController = new DomController(taskManager);

// open home project by default
domController.loadProjectPage(0);

domController.setUpEventListeners();