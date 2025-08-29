const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load tasks on page load
window.onload = loadTasks;

// Add task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }
  createTaskElement(taskText);
  saveTasks();
  taskInput.value = "";
  updateHeadingAndBorder();
}

// Create task element
function createTaskElement(taskText, isCompleted = false) {
  const li = document.createElement("li");
  if (isCompleted) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = taskText;

  const actions = createActions(li, span);

  li.appendChild(span);
  li.appendChild(actions);
  taskList.appendChild(li);

  updateHeadingAndBorder();
}

// Create action icons for a task
function createActions(li, span) {
  const actions = document.createElement("div");
  actions.className = "actions";

  // Complete
  const checkIcon = createIcon("fas fa-check-circle complete", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  // Edit
  const editIcon = createIcon("fas fa-edit edit", () => {
    startEditing(li, span);
  });

  // Delete
  const deleteIcon = createIcon("fas fa-trash delete", () => {
    li.remove();
    saveTasks();
    updateHeadingAndBorder();
  });

  actions.appendChild(checkIcon);
  actions.appendChild(editIcon);
  actions.appendChild(deleteIcon);

  return actions;
}

// Helper to create icons
function createIcon(className, onClick) {
  const icon = document.createElement("i");
  icon.className = className;
  icon.onclick = onClick;
  return icon;
}

// Start editing a task
function startEditing(li, span) {
  const originalText = span.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.className = "edit-input";
  input.value = originalText;

  const actions = li.querySelector(".actions");

  // Save & Delete icons during editing
  const saveIcon = createIcon("fas fa-save save", finishEdit);
  const deleteIcon = createIcon("fas fa-trash delete", () => {
    li.remove();
    saveTasks();
    updateHeadingAndBorder();
  });

  li.replaceChild(input, span);
  actions.innerHTML = "";
  actions.appendChild(saveIcon);
  actions.appendChild(deleteIcon);

  input.focus();
  input.select();

  function finishEdit() {
    const newVal = input.value.trim();
    span.textContent = newVal || originalText; // if empty → restore old text
    li.replaceChild(span, input);
    const newActions = createActions(li, span);
    li.replaceChild(newActions, actions);
    saveTasks();
  }

  function cancelEdit() {
    span.textContent = originalText; // restore old text
    li.replaceChild(span, input);
    const newActions = createActions(li, span);
    li.replaceChild(newActions, actions);
  }

  // Enter = save, Esc = cancel
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finishEdit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  });
}

// Save tasks in localStorage
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
  updateHeadingAndBorder();
}

// Add heading and border when tasks exist
function updateHeadingAndBorder() {
  // Count only real tasks (exclude heading)
  const tasks = Array.from(taskList.children).filter(
    (li) => !li.classList.contains("list-heading")
  );

  if (tasks.length > 0) {
    taskList.classList.add("has-tasks");
    if (!document.querySelector(".list-heading")) {
      const heading = document.createElement("li");
      heading.textContent = "Your List";
      heading.className = "list-heading";
      taskList.insertBefore(heading, taskList.firstChild);
    }
  } else {
    taskList.classList.remove("has-tasks");
    taskList.innerHTML = ""; // remove everything including heading
  }
}

// Add task when pressing Enter in input
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});
