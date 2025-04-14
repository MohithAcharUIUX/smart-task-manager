class Task {
  constructor(text) {
    this.id = Date.now();
    this.text = text;
    this.completed = false;
  }
}

class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  }

  addTask(text) {
    const task = new Task(text);
    this.tasks.push(task);
    this.saveTasks();
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  getFilteredTasks(filter = 'all', search = '') {
    return this.tasks.filter(task => {
      const matchesSearch = task.text.toLowerCase().includes(search.toLowerCase());
      if (filter === 'completed') return task.completed && matchesSearch;
      if (filter === 'active') return !task.completed && matchesSearch;
      return matchesSearch;
    });
  }
}

const taskManager = new TaskManager();

// DOM references
const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const searchInput = document.getElementById('searchInput');
const filterDropdown = document.getElementById('filterDropdown');

function renderTasks() {
  const filter = filterDropdown.value;
  const search = searchInput.value;
  const tasks = taskManager.getFilteredTasks(filter, search);

  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <span onclick="handleToggle(${task.id})">${task.text}</span>
      <button onclick="handleDelete(${task.id})">❌</button>
    `;
    taskList.appendChild(li);
  });
}

// Handlers (exposed for onclick)
window.handleToggle = function(id) {
  taskManager.toggleTask(id);
  renderTasks();
};

window.handleDelete = function(id) {
  taskManager.deleteTask(id);
  renderTasks();
};

function handleAdd() {
  const text = taskInput.value.trim();
  if (!text) return alert('Enter a task');
  taskManager.addTask(text);
  taskInput.value = '';
  renderTasks();
}

// Debounce utility
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Async example: fetch sample tasks (optional)
async function fetchInitialTasks() {
  if (taskManager.tasks.length > 0) return;

  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
  const data = await res.json();
  data.forEach(todo => {
    taskManager.tasks.push({
      id: todo.id,
      text: todo.title,
      completed: todo.completed
    });
  });
  taskManager.saveTasks();
  renderTasks();
}

// Event listeners
addTaskBtn.addEventListener('click', handleAdd);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') handleAdd();
});
filterDropdown.addEventListener('change', renderTasks);
searchInput.addEventListener('input', debounce(renderTasks));

// Init
fetchInitialTasks();
