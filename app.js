// Load tasks from localStorage or start with empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Add a new task
document.getElementById('addTaskBtn').addEventListener('click', () => {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    input.value = '';
    saveTasks();
    renderTasks();
  }
});

// Live search and filter
document.getElementById('searchInput').addEventListener('input', renderTasks);
document.getElementById('filterDropdown').addEventListener('change', renderTasks);

// Save to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render all tasks based on filters
function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const filterValue = document.getElementById('filterDropdown').value;

  let filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchValue)
  );

  if (filterValue === 'active') {
    filteredTasks = filteredTasks.filter(task => !task.completed);
  } else if (filterValue === 'completed') {
    filteredTasks = filteredTasks.filter(task => task.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    const span = document.createElement('span');
    span.textContent = task.text;

    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
    completeBtn.className = 'complete-btn';
    completeBtn.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// Initial render
renderTasks();
