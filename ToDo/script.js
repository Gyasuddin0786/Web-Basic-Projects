document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.querySelector('.add-todo-input');
    const addButton = document.querySelector('.btn-primary');
    const todoListContainer = document.querySelector('.row.mx-1.px-5.pb-3.w-80');
    const filterSelect = document.querySelector('.view-opt-label + select');
    const sortSelect = document.querySelector('.text-secondary + select');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const renderTodos = () => {
        const filter = filterSelect.value;
        const sort = sortSelect.value;

        let filteredTodos = todos.filter((todo) => {
            if (filter === 'all') return true;
            if (filter === 'completed') return todo.completed;
            if (filter === 'active') return !todo.completed;
            return true; 
        });

        filteredTodos.sort((a, b) => {
            if (sort === 'added-date-asc') return a.created - b.created;
            if (sort === 'due-date-desc') return (b.dueDate || 0) - (a.dueDate || 0);
            return 0;
        });

        todoListContainer.innerHTML = '';
        filteredTodos.forEach((todo, index) => {
            const todoItem = document.createElement('div');
            todoItem.className = `row px-3 align-items-center todo-item rounded ${
                todo.completed ? 'completed' : ''
            }`;
            todoItem.innerHTML = `
                <div class="col-auto m-1 p-0 d-flex align-items-center">
                    <h2 class="m-0 p-0">
                        <i class="fa ${todo.completed ? 'fa-check-square-o' : 'fa-square-o'} text-primary btn m-0 p-0" data-index="${index}" data-action="toggle-complete"></i>
                    </h2>
                </div>
                <div class="col px-1 m-1 d-flex align-items-center">
                    <input type="text" class="form-control form-control-lg border-0 edit-todo-input bg-transparent rounded px-3" readonly value="${todo.text}" />
                </div>
                <div class="col-auto m-1 p-0 todo-actions">
                    <div class="row d-flex align-items-center justify-content-end">
                        <h5 class="m-0 p-0 px-2">
                            <i class="fa fa-pencil text-info btn m-0 p-0" data-index="${index}" data-action="edit"></i>
                        </h5>
                        <h5 class="m-0 p-0 px-2">
                            <i class="fa fa-trash-o text-danger btn m-0 p-0" data-index="${index}" data-action="delete"></i>
                        </h5>
                    </div>
                </div>
            `;
            todoListContainer.appendChild(todoItem);
        });
    };

    const addTodo = () => {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false, created: Date.now(), dueDate: null });
            saveTodos();
            renderTodos();
            todoInput.value = '';
        }
    };

    const deleteTodo = (index) => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    };

    const toggleComplete = (index) => {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
    };

    const editTodo = (index) => {
        const todoText = todos[index].text;
        const newText = prompt('Edit your todo:', todoText);
        if (newText !== null && newText.trim()) {
            todos[index].text = newText.trim();
            saveTodos();
            renderTodos();
        }
    };

    addButton.addEventListener('click', addTodo);

    todoListContainer.addEventListener('click', (e) => {
        const target = e.target;
        const index = target.getAttribute('data-index');
        const action = target.getAttribute('data-action');
        if (action === 'delete') {
            deleteTodo(index);
        } else if (action === 'toggle-complete') {
            toggleComplete(index);
        } else if (action === 'edit') {
            editTodo(index);
        }
    });

    filterSelect.addEventListener('change', renderTodos);
    sortSelect.addEventListener('change', renderTodos);

    renderTodos();
});
