const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load tasks when page loads
window.onload = loadTasks;

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  createTaskElement(taskText);
  saveTasks();

  taskInput.value = "";
}

function createTaskElement(taskText, isCompleted = false) {
  // If heading doesn't exist, add it
  if (!document.querySelector("#taskList .list-heading")) {
    const headingLi = document.createElement("li");
    headingLi.textContent = "Your List";
    headingLi.className = "list-heading";
    taskList.appendChild(headingLi);
  }

  const li = document.createElement("li");
  if (isCompleted) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = taskText;

  const actions = document.createElement("div");
  actions.className = "actions";

  // Complete icon
  const checkIcon = document.createElement("i");
  checkIcon.className = "fas fa-check-circle complete";
  checkIcon.onclick = function () {
    li.classList.toggle("completed");
    saveTasks();
  };

  // Edit icon
  const editIcon = document.createElement("i");
  editIcon.className = "fas fa-edit edit";
  editIcon.onclick = function () {
    startEditing(li, span, actions, editIcon);
  };

  // Delete icon
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fas fa-trash delete";
  deleteIcon.onclick = function () {
    li.remove();
    saveTasks();

    // Remove heading if no tasks left
    if (taskList.children.length === 1) {
      taskList.innerHTML = "";
      taskList.classList.remove("has-tasks");
    }
  };

  actions.appendChild(checkIcon);
  actions.appendChild(editIcon);
  actions.appendChild(deleteIcon);

  li.appendChild(span);
  li.appendChild(actions);
  taskList.appendChild(li);

  taskList.classList.add("has-tasks");
}

// Save all tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    if (!li.classList.contains("list-heading")) {
      tasks.push({
        text: li.querySelector("span").textContent,
        completed: li.classList.contains("completed"),
      });
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (storedTasks.length > 0) {
    storedTasks.forEach((task) =>
      createTaskElement(task.text, task.completed)
    );
  }
}

// Editing logic
function startEditing(li, span, actions, editIcon) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;

  const saveIcon = document.createElement("i");
  saveIcon.className = "fas fa-save save";

  const finishEdit = () => {
    if (input.value.trim() !== "") {
      span.textContent = input.value.trim();
      saveTasks();
    }
    li.replaceChild(span, input);
    actions.replaceChild(editIcon, saveIcon);
  };

  saveIcon.onclick = finishEdit;

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") finishEdit();
  });

  li.replaceChild(input, span);
  actions.replaceChild(saveIcon, editIcon);
  input.focus();
}

// Add task when Enter is pressed in input box
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});
