// Задача:
// Нужно опустошить список (убрать тестовые ul)
// Нужно добавить событие при нажатии на кнопку чтобы текст в инпуте попадал в список как тэг li

const todoAddButton = document.querySelector('#todoAddButton')
const todoInput = document.querySelector('#todoInput')
const todoList = document.querySelector('#todoList')

todoAddButton.addEventListener('click', (event) => {
    event.preventDefault()

    const text = todoInput.value.trim()

    if (!text) {
        alert('Заполните поле с задачей!')
        return
    }

    // Добавляем текст
    const li = document.createElement('li')
    li.innerText = text
    
    // Добавляем кнопку удаления
    const removeBtn = document.createElement('button')
    removeBtn.classList.add('removeBtn')
    removeBtn.innerText = 'Remove'
    li.appendChild(removeBtn)

    // Добавляем событие для removeBtn
    removeBtn.addEventListener('click', () => {
        li.remove()
    })

    // В список добавляем готовый li
    todoList.appendChild(li)

    todoInput.value = ''
})

