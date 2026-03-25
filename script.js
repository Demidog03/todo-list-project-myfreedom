// Задача:
// Нужно опустошить список (убрать тестовые ul)
// Нужно добавить событие при нажатии на кнопку чтобы текст в инпуте попадал в список как тэг li

const todoAddButton = document.querySelector('#todoAddButton')
const todoInput = document.querySelector('#todoInput')
const todoList = document.querySelector('#todoList')

// Первоначальный рендер (отрисовка) задач
renderTasks()

todoAddButton.addEventListener('click', (event) => {
    event.preventDefault()

    addNewTask()
    renderTasks()
})

function addNewTask() {
    const text = todoInput.value.trim()

    if (!text) {
        alert('Заполните поле с задачей!')
        return
    }

    const lsTasks = JSON.parse(localStorage.getItem('tasks') || '[]')

    // Сохраняем данные в localStorage
    const newLSTasks = JSON.stringify([...lsTasks, { id: Date.now(), text: text, status: 'Working' }])
    localStorage.setItem('tasks', newLSTasks)

    todoInput.value = ''
}

function removeTask(task) {
    const lsTasks = JSON.parse(localStorage.getItem('tasks') || '[]')

    // Удалении задачи из localStorage
    const filteredTasks = JSON.stringify(lsTasks.filter(t => t.id !== task.id))
    localStorage.setItem('tasks', filteredTasks)
}

function changeTaskStatus(task, newStatus) {
    const lsTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const taskToChange = lsTasks.find(t => t.id === task.id)
    taskToChange.status = newStatus

    // Меняем статус задачи из localStorage
    const filteredTasks = JSON.stringify([...lsTasks])
    localStorage.setItem('tasks', filteredTasks)
}

function renderTasks() {
    // При каждом рендере очищать список
    todoList.innerHTML = ''

    const lsTasks = JSON.parse(localStorage.getItem('tasks') || '[]')

    for (const task of lsTasks) {
        // Добавляем текст
        const li = document.createElement('li')
        li.innerText = task.text

        const buttonsContainer = document.createElement('div')
        buttonsContainer.classList.add('buttonsContainer')

        // Добавляем кнопку completed
        if (task.status === 'Completed') {
            const completedBtn = document.createElement('button')
            completedBtn.classList.add('completedBtn')
            completedBtn.innerText = 'Completed'
            buttonsContainer.appendChild(completedBtn)

            completedBtn.addEventListener('click', () => {
                changeTaskStatus(task, 'Working')
                renderTasks()
            })
        }
        else if (task.status === 'Working') {
            const workingBtn = document.createElement('button')
            workingBtn.classList.add('workingBtn')
            workingBtn.innerText = 'Working'
            buttonsContainer.appendChild(workingBtn)

            workingBtn.addEventListener('click', () => {
                changeTaskStatus(task, 'Completed')
                renderTasks()
            })
        }
        
        // Добавляем кнопку удаления
        const removeBtn = document.createElement('button')
        removeBtn.classList.add('removeBtn')
        removeBtn.innerText = 'Remove'
        buttonsContainer.appendChild(removeBtn)

        li.appendChild(buttonsContainer)

        // Добавляем событие для removeBtn
        removeBtn.addEventListener('click', () => {
            removeTask(task)
            renderTasks()
        })

        // В список добавляем готовый li
        todoList.appendChild(li)
    }
}


// localStorage.setItem('student', 'Arman')
// localStorage.setItem('student', 'Kairat')
// console.log(localStorage.getItem('student'))

// const tasks = ['Помыть посуду', 'Заправить машину', 'Записаться к врачу']

// localStorage.setItem('tasks', JSON.stringify(tasks))
// const localStorageTasks = JSON.parse(localStorage.getItem('tasks'))
// console.log(localStorageTasks)

// const tasks = [{ id: 1, text: 'Помыть посуду' }, { id: 2, text: 'Заправить машину' }, { id: 3, text: 'Записаться к врачу' }]
// console.log(Date.now())