document.addEventListener("DOMContentLoaded", () => {
    // SELEÇÕES DE ELEMENTOS
    const todoForm = document.querySelector("#to-do-form");
    const todoInput = document.querySelector("#to-do-input");
    const todoList = document.querySelector("#to-do-list");
    const editForm = document.querySelector("#edit-form");
    const editInput = document.querySelector("#edit-input");
    const cancelEditBtn = document.querySelector("#cancel-edit-btn");
    const searchInput = document.querySelector("#search-input");
    const eraseBtn = document.querySelector("#erase-button");
    const filterBtn = document.querySelector("#filter-btn");
    const toggleButton = document.getElementById('toggle-dark-mode');
    const fileInput = document.getElementById('background-upload');
    const setBackgroundButton = document.getElementById('set-background');
    const showUploadButton = document.getElementById('show-upload'); // Botão para mostrar formulário de fundo
    const bgAlterForm = document.getElementById('bg-alter'); // Formulário de alteração de imagem de fundo
    const toolbar = document.getElementById('toolbar'); // Barra de ferramentas

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
        filterBtn,
        toggleButton,
        fileInput,
        setBackgroundButton,
        showUploadButton,
        bgAlterForm,
        toolbar
    });

    // Verificar se algum elemento é null
    if (!todoForm || !todoInput || !todoList || !editForm || !editInput || !cancelEditBtn || !searchInput || !eraseBtn || !filterBtn || !toggleButton || !fileInput || !setBackgroundButton || !showUploadButton || !bgAlterForm || !toolbar) {
        console.error("Um ou mais elementos não foram encontrados no DOM.");
        return;
    }

    let oldInputValue;

    // Local Storage
    const getTodosLocalStorage = () => JSON.parse(localStorage.getItem("todos")) || [];

    const saveTodoLocalStorage = (todo) => {
        console.log("Salvando no localStorage:", todo);
        const todos = getTodosLocalStorage();
        todos.push(todo);
        localStorage.setItem("todos", JSON.stringify(todos));
    };

    const removeTodoLocalStorage = (todoText) => {
        const todos = getTodosLocalStorage();
        const filteredTodos = todos.filter((todo) => todo.text !== todoText);
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
            const todoElement = document.createElement("div");
            todoElement.classList.add("to-do");
    
            const todoTitle = document.createElement("h3");
            todoTitle.innerText = todo.text;
            todoElement.appendChild(todoTitle);
    
            const doneBtn = document.createElement("button");
            doneBtn.classList.add("finish-to-do");
            doneBtn.innerHTML = '<i class="fa-solid fa-check" aria-label="Marcar como concluído"></i>';
            todoElement.appendChild(doneBtn);
    
            const editBtn = document.createElement("button");
            editBtn.classList.add("edit-to-do");
            editBtn.innerHTML = '<i class="fa-solid fa-pen" aria-label="Editar tarefa"></i>';
            todoElement.appendChild(editBtn);
    
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("remove-to-do");
            deleteBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-label="Remover tarefa"></i>';
            todoElement.appendChild(deleteBtn);
    
            if (todo.done) {
                todoElement.classList.add("done");
            }
    
            todoList.appendChild(todoElement);
        });
    };
    

    // FUNÇÕES
    const saveTodo = (text, done = 0) => {
        const todos = getTodosLocalStorage();
        const todoExists = todos.some((todo) => todo.text === text);
    
        if (todoExists) {
            alert('A tarefa já existe!');
            return;
        }
    
        console.log("saveTodo chamado com texto:", text);
    
        const todo = document.createElement("div");
        todo.classList.add("to-do");
    
        const todoTitle = document.createElement("h3");
        todoTitle.innerText = text;
        todo.appendChild(todoTitle);
    
        const doneBtn = document.createElement("button");
        doneBtn.classList.add("finish-to-do");
        doneBtn.innerHTML = '<i class="fa-solid fa-check" aria-label="Marcar como concluído"></i>';
        todo.appendChild(doneBtn);
    
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-to-do");
        editBtn.innerHTML = '<i class="fa-solid fa-pen" aria-label="Editar tarefa"></i>';
        todo.appendChild(editBtn);
    
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("remove-to-do");
        deleteBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-label="Remover tarefa"></i>';
        todo.appendChild(deleteBtn);
    
        if (done) {
            todo.classList.add("done");
        }
    
        saveTodoLocalStorage({ text, done });
        todoList.appendChild(todo);
    
        todoInput.value = "";
        todoInput.focus();
    };

    const toggleForms = () => {
        editForm.classList.add("hide");
        todoForm.classList.remove("hide");
        todoList.classList.remove("hide");
        bgAlterForm.classList.add("hide"); // Oculta o formulário de alterar imagem de fundo
        toolbar.classList.remove("hide"); // Garante que a toolbar seja visível
    };

    const updateTodo = (text) => {
        const todos = getTodosLocalStorage();
        const todoExists = todos.some((todo) => todo.text === text && todo.text !== oldInputValue);
    
        if (todoExists) {
            alert('A tarefa já existe!');
            return;
        }
    
        const todosElements = document.querySelectorAll(".to-do");
        todosElements.forEach((todo) => {
            const todoTitle = todo.querySelector("h3");
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
            todo.style.display = todoTitle.includes(search.toLowerCase()) ? "flex" : "none";
        });
    };

    const filterTodos = (filterValue) => {
        const todos = document.querySelectorAll(".to-do");
        console.log("Filtrando tarefas com valor:", filterValue);

        switch (filterValue) {
            case "all":
                todos.forEach((todo) => todo.style.display = "flex");
                break;

            case "done":
                todos.forEach((todo) => todo.style.display = todo.classList.contains("done") ? "flex" : "none");
                break;

            case "to-do":
                todos.forEach((todo) => todo.style.display = !todo.classList.contains("done") ? "flex" : "none");
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
        const parentEl = targetEl.closest(".to-do");
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
            editForm.classList.remove("hide");
            todoForm.classList.add("hide");
            todoList.classList.add("hide");
            bgAlterForm.classList.add("hide");
            toolbar.classList.remove("hide");
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

    // Configuração do Modo Escuro
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

    // Mostrar Formulário de Alteração de Imagem
    showUploadButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Botão de upload clicado'); // Verifique se este log aparece no console
        bgAlterForm.classList.remove('hide');
        todoForm.classList.add('hide');
        editForm.classList.add('hide');
        toolbar.style.display = 'none';
    });

    // Aplicar Imagem de Fundo e alternar formulários
    setBackgroundButton.addEventListener('click', (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.body.style.backgroundImage = `url(${e.target.result})`;
                localStorage.setItem('background', e.target.result);
                // Alterar formulários e toolbar
                bgAlterForm.classList.add("hide");
                todoForm.classList.remove("hide");
                editForm.classList.add("hide");
                toolbar.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecione uma imagem primeiro.');
        }
    });    

    // Restaurar imagem de fundo ao carregar a página
    const storedBackground = localStorage.getItem('background');
    if (storedBackground) {
        document.body.style.backgroundImage = `url(${storedBackground})`;
    }

    loadTodos();
});
