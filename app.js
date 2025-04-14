let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

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

document.getElementById('searchInput').addEventListener('input', renderTasks);
document.getElementById('filterDropdown').addEventListener('change', renderTasks);

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

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

    const span = document.createElement('span');
    span.textContent = task.text;

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

    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

renderTasks();
