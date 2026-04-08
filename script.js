// Задача:
// Нужно опустошить список (убрать тестовые ul)
// Нужно добавить событие при нажатии на кнопку чтобы текст в инпуте попадал в список как тэг li

const todoAddButton = document.querySelector('#todoAddButton')
const todoInput = document.querySelector('#todoInput')
const todoList = document.querySelector('#todoList')
const spinnerSvg = document.querySelector('#spinnerSvg')
const noDataText = document.querySelector('#noDataText')

// Первоначальный рендер (отрисовка) задач
renderTasks()

todoAddButton.addEventListener('click', (event) => {
    event.preventDefault()

    addNewTask()
})

function addNewTask() {
    const text = todoInput.value.trim()

    if (!text) {
        alert('Заполните поле с задачей!')
        return
    }

    const bodyJSON = JSON.stringify(
        {
            text: text
        }
    )

    startSpinner()

    // Отправляем POST запрос
    fetch('http://localhost:6767/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyJSON
    }).finally(() => {
        stopSpinner()
        renderTasks()
    })

    todoInput.value = ''
}

function removeTask(task) {
    // Отправка запроса на удаление элемента
    startSpinner()

    fetch(`http://localhost:6767/api/todos/${task.id}`, {
        method: 'DELETE'
    }).finally(() => {
        stopSpinner()
        renderTasks()
    })
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

    startSpinner()

    fetch('http://localhost:6767/api/todos', {
        method: 'GET'
    }).then(response => {
        return response.json()
    }).then(backendData => {
        const lsTasks = backendData

        console.log(lsTasks)

        for (const task of lsTasks) {
            // Добавляем текст
            const li = document.createElement('li')
            li.innerText = task.text

            const buttonsContainer = document.createElement('div')
            buttonsContainer.classList.add('buttonsContainer')

            // Добавляем кнопку completed
            if (task.status === 'completed') {
                const completedBtn = document.createElement('button')
                completedBtn.classList.add('completedBtn')
                completedBtn.innerText = 'Completed'
                buttonsContainer.appendChild(completedBtn)

                completedBtn.addEventListener('click', () => {
                    changeTaskStatus(task, 'Working')
                    renderTasks()
                })
            }
            else if (task.status === 'in-progress') {
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
            })

            // В список добавляем готовый li
            todoList.appendChild(li)
        }

        if (lsTasks.length < 1) {
            noDataText.classList.remove('hidden')
        }
    }).catch(error => {
        alert(error || 'Ошибка во время получения списка задач!')

        noDataText.classList.remove('hidden')
    }).finally(() => {
        stopSpinner()
    })
}

function startSpinner() {
    spinnerSvg.classList.remove('hidden')
}

function stopSpinner() {
    spinnerSvg.classList.add('hidden')
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