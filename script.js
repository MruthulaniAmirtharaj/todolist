const addBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");

window.onload = () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasksByDate")) || {};
  for (const date in storedTasks) {
    storedTasks[date].forEach(task => {
      addTaskToDOM(date, task.text, task.completed);
    });
  }
};

addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const selectedDate = taskDate.value;

  if (!selectedDate) {
    alert("⚠️ Please select a date before adding the task.");
    return;
  }

  if (taskText === "") return;

  addTaskToDOM(selectedDate, taskText, false);
  saveTaskToLocal(selectedDate, taskText, false);
  taskInput.value = "";
});

function addTaskToDOM(date, text, completed) {
  let dateSection = document.getElementById(`section-${date}`);
  
  if (!dateSection) {
    dateSection = document.createElement("div");
    dateSection.id = `section-${date}`;
    dateSection.innerHTML = `<h3>${date}</h3><ul></ul>`;
    taskList.appendChild(dateSection);
  }

  const ul = dateSection.querySelector("ul");
  const li = document.createElement("li");
  li.style.display = "flex";
  li.style.alignItems = "center";
  li.style.gap = "10px";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;

  const label = document.createElement("label");
  label.textContent = text;
  if (completed) label.style.opacity = "0.5";

  const editBtn = document.createElement("span");
  editBtn.textContent = "✏️";
  editBtn.style.cursor = "pointer";

  editBtn.addEventListener("click", () => {
  const newText = prompt("Edit your task:", label.textContent);
  if (newText !== null && newText.trim() !== "") {
    updateTaskInLocal(date, text, newText.trim(), checkbox.checked);
    label.textContent = newText.trim();
  }
});


  const dltBtn = document.createElement("span");
  dltBtn.textContent = "🗑️";
  dltBtn.style.cursor = "pointer";

  checkbox.addEventListener("change", () => {
    label.style.opacity = checkbox.checked ? "0.5" : "1";
    updateCompletionInLocal(date, text, checkbox.checked);
  });

  dltBtn.addEventListener("click", () => {
    li.remove();
    deleteTaskFromLocal(date, text);
    if (ul.children.length === 0) dateSection.remove();
  });

  const btnGroup = document.createElement("div");
  btnGroup.style.marginLeft = "auto";  
  btnGroup.style.display = "flex";
  btnGroup.style.gap = "5px";




  li.appendChild(checkbox);
  li.appendChild(label);
  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(dltBtn);
  li.appendChild(btnGroup);
  ul.appendChild(li);
}

function saveTaskToLocal(date, text, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasksByDate")) || {};
  if (!tasks[date]) tasks[date] = [];
  tasks[date].push({ text, completed });
  localStorage.setItem("tasksByDate", JSON.stringify(tasks));
}

function updateCompletionInLocal(date, text, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasksByDate")) || {};
  if (tasks[date]) {
    const task = tasks[date].find(t => t.text === text);
    if (task) task.completed = completed;
    localStorage.setItem("tasksByDate", JSON.stringify(tasks));
  }
}

function deleteTaskFromLocal(date, text) {
  const tasks = JSON.parse(localStorage.getItem("tasksByDate")) || {};
  if (tasks[date]) {
    tasks[date] = tasks[date].filter(t => t.text !== text);
    if (tasks[date].length === 0) delete tasks[date];
    localStorage.setItem("tasksByDate", JSON.stringify(tasks));
  }
}

function updateTaskInLocal(date, oldText, newText, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasksByDate")) || {};
  if (tasks[date]) {
    const task = tasks[date].find(t => t.text === oldText);
    if (task) {
      task.text = newText;
      task.completed = completed;
    }
    localStorage.setItem("tasksByDate", JSON.stringify(tasks));
  }
}



const darkToggle = document.getElementById("toggleDark");

if (localStorage.getItem("darkMode") === "on") {
  document.body.classList.add("dark");
  darkToggle.checked = true;
}

darkToggle.addEventListener("change", () => {
  if (darkToggle.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "on");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "off");
  }
});

