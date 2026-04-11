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

todoAddButton.addEventListener('click', async (event) => {
    event.preventDefault()

    await addNewTask()
    renderTasks()
})

async function addNewTask() {
    try {
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
        await fetch('http://localhost:6767/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bodyJSON
        })

        todoInput.value = ''
    }
    catch(error) {
        alert('Ошибка при создании задачи')
    }
    finally {
        stopSpinner()
    }
}

async function removeTask(task) {
    try {
        // Отправка запроса на удаление элемента
        startSpinner()

        await fetch(`http://localhost:6767/api/todos/${task.id}`, {
            method: 'DELETE'
        })
    }
    catch (error) {
        alert('Ошибка при удалении задачи')
    }
    finally {
        stopSpinner()
    }
}

async function changeTaskStatus(task, newStatus) {
    try {
        startSpinner()

        await fetch(`http://localhost:6767/api/todos/${task.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: newStatus
            })
        })
    }
    catch {
        alert('Ошибка при изменении статуса')
    }
    finally {
        stopSpinner()
    }
}

async function renderTasks() {
    todoList.innerHTML = '';
    startSpinner();
    noDataText.classList.add('hidden');

    try {
        const response = await fetch('http://localhost:6767/api/todos');
        if (!response.ok) throw new Error('Ошибка сервера');

        const lsTasks = await response.json();

        if (lsTasks.length === 0) {
            noDataText.classList.remove('hidden');
            return;
        }

        lsTasks.forEach(task => {
            const li = document.createElement('li');
            li.innerText = task.text;

            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('buttonsContainer');

            const statusBtn = document.createElement('button');
            if (task.status === 'completed') {
                statusBtn.classList.add('completedBtn');
                statusBtn.innerText = 'Completed';
                statusBtn.onclick = async () => {
                    await changeTaskStatus(task, 'in-progress');
                    renderTasks();
                };
            } else {
                statusBtn.classList.add('workingBtn');
                statusBtn.innerText = 'Working';
                statusBtn.onclick = async () => {
                    await changeTaskStatus(task, 'completed');
                    renderTasks();
                };
            }

            const removeBtn = document.createElement('button');
            removeBtn.classList.add('removeBtn');
            removeBtn.innerText = 'Remove';
            removeBtn.onclick = async () => {
                await removeTask(task);
                renderTasks();
            };

            buttonsContainer.append(statusBtn, removeBtn);
            li.appendChild(buttonsContainer);
            todoList.appendChild(li);
        });

    } catch (error) {
        console.error(error);
        alert('Ошибка во время получения списка задач!');
        noDataText.classList.remove('hidden');
    } finally {
        stopSpinner();
    }
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