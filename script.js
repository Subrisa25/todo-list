const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Function to add task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  // If no tasks yet, add heading inside UL
  if (!document.querySelector("#taskList .list-heading")) {
    const headingLi = document.createElement("li");
    headingLi.textContent = "Your List";
    headingLi.className = "list-heading";
    taskList.appendChild(headingLi);
  }

  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = taskText;

  const actions = document.createElement("div");
  actions.className = "actions";

  const checkIcon = document.createElement("i");
  checkIcon.className = "fas fa-check-circle complete";
  checkIcon.onclick = function () {
    li.classList.toggle("completed");
  };

  const editIcon = document.createElement("i");
  editIcon.className = "fas fa-edit edit";
  editIcon.onclick = function () {
    startEditing(li, span, actions);
  };

  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fas fa-trash delete";
  deleteIcon.onclick = function () {
    li.remove();

    // If only heading remains, remove heading too
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

  // Show border when tasks exist
  taskList.classList.add("has-tasks");

  taskInput.value = "";
}

// Inline editing
function startEditing(li, span, actions) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.className = "edit-input";

  // Function to save changes
  function saveTask() {
    span.textContent = input.value.trim() || span.textContent;
    li.replaceChild(span, input);

    // Restore all 3 icons (check + edit + delete)
    actions.innerHTML = "";
    actions.appendChild(checkIcon);
    actions.appendChild(editIcon);
    actions.appendChild(deleteIcon);
  }

  // Keep original icons to restore later
  const checkIcon = document.createElement("i");
  checkIcon.className = "fas fa-check-circle complete";
  checkIcon.onclick = function () {
    li.classList.toggle("completed");
  };

  const editIcon = document.createElement("i");
  editIcon.className = "fas fa-edit edit";
  editIcon.onclick = function () {
    startEditing(li, span, actions);
  };

  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fas fa-trash delete";
  deleteIcon.onclick = function () {
    li.remove();
  };

  // Save icon
  const saveIcon = document.createElement("i");
  saveIcon.className = "fas fa-check save";
  saveIcon.onclick = saveTask;

  // Replace span with input
  li.replaceChild(input, span);
  input.focus();

  // Save on Enter key
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      saveTask();
    }
  });

  // Show save + delete during editing
  actions.innerHTML = "";
  actions.appendChild(saveIcon);
  actions.appendChild(deleteIcon);
}

// Add task with Enter key
taskInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});
