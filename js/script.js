// SELEÇÕES DE ELEMENTOS
const todoForm = document.querySelector("#to-do-form");
const todoInput = document.querySelector("#to-do-input");
const todoList = document.querySelector("#to-do-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");


// FUNÇÕES


// EVENTOS
todoForm.addEventListener("submit", (e) => {

    e.preventDefault()

    const inputValue = todoInput.value

    if(inputValue) {
        console.log(inputValue)
        //save todo
    }
})
