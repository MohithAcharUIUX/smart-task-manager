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
    this.tasks = this.tasks.filter(t => t.id !== id); // `filter()` used here
    this.saveTasks();
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  getFilteredTasks(filter = 'all', search = '') {
    // `filter()` to filter tasks based on the completion status
    return this.tasks.filter(task => {
      const matchesSearch = task.text.toLowerCase().includes(search.toLowerCase());
      if (filter === 'completed') return task.completed && matchesSearch;
      if (filter === 'active') return !task.completed && matchesSearch;
      return matchesSearch;
    });
  }

  getCompletedTasks() {
    // `filter()` to return only completed tasks
    return this.tasks.filter(task => task.completed);
  }

  getActiveTasks() {
    // `filter()` to return only active tasks
    return this.tasks.filter(task => !task.completed);
  }

  getTaskTextLength() {
    // `map()` to get text length of all tasks
    return this.tasks.map(task => task.text.length);
  }

  getTaskSummary() {
    // `reduce()` to calculate the total number of characters in all tasks
    return this.tasks.reduce((total, task) => total + task.text.length, 0);
  }

  // Higher-Order Function: Finding a task by text
  findTaskByText(searchText) {
    return this.tasks.find(task => task.text.toLowerCase().includes(searchText.toLowerCase())); // `find()`
  }

  // `some()` - Check if there is any task that is completed
  anyCompleted() {
    return this.tasks.some(task => task.completed); // `some()` to check if any task is completed
  }

  // `every()` - Check if all tasks are completed
  allCompleted() {
    return this.tasks.every(task => task.completed); // `every()` to check if all tasks are completed
  }

  // Example of Object Destructuring for extracting properties from tasks
  getTasksSummary() {
    return this.tasks.map(({ text, completed }) => ({
      text,
      completed,
    }));
  }
}

const taskManager = new TaskManager();

// DOM references
const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const searchInput = document.getElementById('searchInput');
const filterDropdown = document.getElementById('filterDropdown');

// Render tasks using `forEach()`
function renderTasks() {
  const filter = filterDropdown.value;
  const search = searchInput.value;
  const tasks = taskManager.getFilteredTasks(filter, search);

  taskList.innerHTML = '';
  tasks.forEach(task => { // `forEach()` to render each task
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <span onclick="handleToggle(${task.id})">${task.text}</span>
      <button onclick="handleDelete(${task.id})">❌</button>
    `;
    taskList.appendChild(li);
  });
}

// Handling toggle and delete operations
window.handleToggle = function(id) {
  taskManager.toggleTask(id);
  renderTasks();
};

window.handleDelete = function(id) {
  taskManager.deleteTask(id);
  renderTasks();
};

// Add a task and render the updated list
function handleAdd() {
  const text = taskInput.value.trim();
  if (!text) return alert('Enter a task');
  taskManager.addTask(text);
  taskInput.value = '';
  renderTasks();
}

// Show task summary: total characters in tasks using `reduce()`
function showTaskSummary() {
  const totalLength = taskManager.getTaskSummary(); // Using `reduce()` to calculate total task text length
  console.log('Total characters in tasks:', totalLength);
}

// Show task status summaries
function showStatusSummary() {
  console.log('Any Completed:', taskManager.anyCompleted()); // `some()` to check if any task is completed
  console.log('All Completed:', taskManager.allCompleted()); // `every()` to check if all tasks are completed
}

// Log all tasks with destructuring example
function logTaskSummary() {
  const tasksSummary = taskManager.getTasksSummary();
  console.log(tasksSummary); // Logs an array of task summaries
}

addTaskBtn.addEventListener('click', handleAdd);
searchInput.addEventListener('input', renderTasks);
filterDropdown.addEventListener('change', renderTasks);

// Initial rendering
renderTasks();
