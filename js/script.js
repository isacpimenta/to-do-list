document.addEventListener("DOMContentLoaded", () => {
    // SELEÇÕES DE ELEMENTOS
    const todoForm = document.querySelector("#to-do-form");
    const todoInput = document.querySelector("#to-do-input");
    const todoList = document.querySelector("#to-do-list");
    const editForm = document.querySelector("#edit-form");
    const editInput = document.querySelector("#edit-input");
    const cancelEditBtn = document.querySelector("#cancel-edit-btn");
    const searchInput = document.querySelector("#search-input");
    const eraseBtn = document.querySelector("#erase-button");  // Corrigido de erase-btn para erase-button
    const filterBtn = document.querySelector("#filter-btn");

    // Verificar se todos os elementos foram selecionados corretamente
    console.log("Elementos selecionados:", {
        todoForm,
        todoInput,
        todoList,
        editForm,
        editInput,
        cancelEditBtn,
        searchInput,
        eraseBtn,
        filterBtn
    });

    // Verificar se algum elemento é null
    if (!todoForm || !todoInput || !todoList || !editForm || !editInput || !cancelEditBtn || !searchInput || !eraseBtn || !filterBtn) {
        console.error("Um ou mais elementos não foram encontrados no DOM.");
        return;
    }

    let oldInputValue;

    // Local Storage
    const getTodosLocalStorage = () => {
        const todos = JSON.parse(localStorage.getItem("todos")) || [];
        return todos;
    };

    const saveTodoLocalStorage = (todo) => {
        console.log("Salvando no localStorage:", todo);

        const todos = getTodosLocalStorage();
        todos.push(todo);
        localStorage.setItem("todos", JSON.stringify(todos));
    };

    const removeTodoLocalStorage = (todoText) => {
        const todos = getTodosLocalStorage();
        const filteredTodos = todos.filter((todo) => todo.text != todoText);
        localStorage.setItem("todos", JSON.stringify(filteredTodos));
    };

    const updateTodoStatusLocalStorage = (todoText) => {
        const todos = getTodosLocalStorage();
        todos.forEach((todo) => {
            if (todo.text === todoText) {
                todo.done = !todo.done;
            }
        });
        localStorage.setItem("todos", JSON.stringify(todos));
    };

    const updateTodoLocalStorage = (todoOldText, todoNewText) => {
        const todos = getTodosLocalStorage();
        todos.forEach((todo) => {
            if (todo.text === todoOldText) {
                todo.text = todoNewText;
            }
        });
        localStorage.setItem("todos", JSON.stringify(todos));
    };

    const loadTodos = () => {
        const todos = getTodosLocalStorage();
        todos.forEach((todo) => {
            saveTodo(todo.text, todo.done, 0);
        });
    };

    // FUNÇÕES
    const saveTodo = (text, done = 0, save = 1) => {
        console.log("saveTodo chamado com texto:", text);

        const todo = document.createElement("div");
        todo.classList.add("to-do");

        const todoTitle = document.createElement("h3");
        todoTitle.innerText = text;
        todo.appendChild(todoTitle);

        const doneBtn = document.createElement("button");
        doneBtn.classList.add("finish-to-do");
        doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        todo.appendChild(doneBtn);
        
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-to-do");
        editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        todo.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("remove-to-do");
        deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        todo.appendChild(deleteBtn);

        if (done) {
            todo.classList.add("done");
        }

        if (save) {
            saveTodoLocalStorage({ text, done });
        }

        todoList.appendChild(todo);

        todoInput.value = "";
        todoInput.focus();
    };

    const toggleForms = () => {
        editForm.classList.toggle("hide");
        todoForm.classList.toggle("hide");
        todoList.classList.toggle("hide");
    };

    const updateTodo = (text) => {
        const todos = document.querySelectorAll(".to-do");

        todos.forEach((todo) => {
            let todoTitle = todo.querySelector("h3");

            if (todoTitle.innerText === oldInputValue) {
                todoTitle.innerText = text;
                updateTodoLocalStorage(oldInputValue, text);
            }
        });
    };

    const getSearchedTodos = (search) => {
        const todos = document.querySelectorAll(".to-do");

        todos.forEach((todo) => {
            const todoTitle = todo.querySelector("h3").innerText.toLowerCase();
            todo.style.display = "flex";

            if (!todoTitle.includes(search.toLowerCase())) {
                todo.style.display = "none";
            }
        });
    };

    const filterTodos = (filterValue) => {
        const todos = document.querySelectorAll(".to-do");

        console.log("Filtrando tarefas com valor:", filterValue);

        switch (filterValue) {
            case "all":
                todos.forEach((todo) => (todo.style.display = "flex"));
                break;

            case "done":
                todos.forEach((todo) =>
                    todo.classList.contains("done")
                        ? (todo.style.display = "flex")
                        : (todo.style.display = "none")
                );
                break;

            case "to-do":  // Corrigido de "todo" para "to-do"
                todos.forEach((todo) =>
                    !todo.classList.contains("done")
                        ? (todo.style.display = "flex")
                        : (todo.style.display = "none")
                );
                break;

            default:
                break;
        }
    };

    // EVENTOS
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const inputValue = todoInput.value;

        if (inputValue) {
            saveTodo(inputValue);
        }
    });

    document.addEventListener("click", (e) => {
        const targetEl = e.target;
        const parentEl = targetEl.closest("div");
        let todoTitle;

        if (parentEl && parentEl.querySelector("h3")) {
            todoTitle = parentEl.querySelector("h3").innerText;
        }

        if (targetEl.classList.contains("finish-to-do")) {
            parentEl.classList.toggle("done");
            updateTodoStatusLocalStorage(todoTitle);
        }

        if (targetEl.classList.contains("remove-to-do")) {
            parentEl.remove();
            removeTodoLocalStorage(todoTitle);
        }
        
        if (targetEl.classList.contains("edit-to-do")) {
            toggleForms();
            editInput.value = todoTitle;
            oldInputValue = todoTitle;
        }
    });

    cancelEditBtn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleForms();
    });

    editForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const editInputValue = editInput.value;

        if (editInputValue) {
            updateTodo(editInputValue);
        }

        toggleForms();
    });

    searchInput.addEventListener("keyup", (e) => {
        const search = e.target.value;
        getSearchedTodos(search);
    });

    eraseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("keyup"));
    });

    filterBtn.addEventListener("change", (e) => {
        const filterValue = e.target.value;
        console.log("Filtro selecionado:", filterValue);
        filterTodos(filterValue);
    });

    loadTodos();
});

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-dark-mode');

    // Verifica se o modo escuro foi ativado anteriormente
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        toggleButton.innerHTML = '<i class="fa-sharp fa-solid fa-sun"></i>';
    }

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            toggleButton.innerHTML = '<i class="fa-sharp fa-solid fa-sun"></i>';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            toggleButton.innerHTML = '<i class="fa-sharp fa-solid fa-moon"></i>';
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});
