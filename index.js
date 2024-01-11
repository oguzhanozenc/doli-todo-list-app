import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-2b0dd-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const taskListInDB = ref(database, "taskList");

const taskInputEl = document.getElementById("task-input");
const addTaskButtonEl = document.getElementById("add-task-button");
const taskListEl = document.getElementById("task-list");

addTaskButtonEl.addEventListener("click", function () {
  let taskValue = taskInputEl.value;

  push(taskListInDB, taskValue);

  clearTaskInput();
});

onValue(taskListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let tasksArray = Object.entries(snapshot.val());

    clearTaskList();

    for (let i = 0; i < tasksArray.length; i++) {
      let currentTask = tasksArray[i];
      let currentTaskID = currentTask[0];
      let currentTaskValue = currentTask[1];

      appendTaskToTaskList(currentTask);
    }
  } else {
    taskListEl.innerHTML = "There are no tasks yet.";
  }
});

function clearTaskList() {
  taskListEl.innerHTML = "";
}

function clearTaskInput() {
  taskInputEl.value = "";
}

function appendTaskToTaskList(task) {
  let taskID = task[0];
  let taskValue = task[1];

  let newTaskElement = document.createElement("li");

  let taskText = document.createElement("span");
  taskText.textContent = taskValue;

  let deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", function () {
    let exactLocationOfTaskInDB = ref(database, `taskList/${taskID}`);
    remove(exactLocationOfTaskInDB);
  });

  newTaskElement.appendChild(taskText);
  newTaskElement.appendChild(deleteButton);

  newTaskElement.addEventListener("click", function () {
    newTaskElement.classList.toggle("crossed-out");
  });

  taskListEl.append(newTaskElement);
}
