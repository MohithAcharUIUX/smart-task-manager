let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.getElementById('addTaskBtn').addEventListener('click', () => {
  const taskInput = document.getElementById('taskInput');
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    saveTasks();
    taskInput.value = '';
    renderTasks();
  }
});

document.getElementById('searchInput').addEventListener('input', renderTasks);
document.getElementById('filterDropdown').addEventListener('change', renderTasks);

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  const search = document.getElementById('searchInput').value.toLowerCase();
  const filter = document.getElementById('filterDropdown').value;

  let filtered = tasks.filter(task => task.text.toLowerCase().includes(search));

  if (filter === 'active') {
    filtered = filtered.filter(task => !task.completed);
  } else if (filter === 'completed') {
    filtered = filtered.filter(task => task.completed);
  }

  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const taskText = document.createElement('span');
    taskText.textContent = task.text;

    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
    completeBtn.className = 'complete-btn';
    completeBtn.addEventListener('click', () => {
      task.completed = !task.completed;
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

    li.appendChild(taskText);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

renderTasks();
