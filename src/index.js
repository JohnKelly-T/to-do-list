import "./styles/reset.css";
import "./styles/global.css";
import displayDate from "./modules/display-date";
import TaskManager from task-manager.js;

displayDate();

let taskManager = new TaskManager();