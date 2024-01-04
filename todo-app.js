(function() {
    function createAppTitile(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название задачи или дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить в список';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        button.disabled = true;

        input.addEventListener('input', function(){
            if (input.value.trim() !== '') {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name, done, id) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        if (done) {
            item.classList.add('list-group-item-succes');
        }

        return {
            item,
            doneButton,
            deleteButton,
            id,
        };
    }

    function dataToJson(data) {
        return JSON.stringify(data);
    };

    function jsonToData(data) {
        return JSON.parse(data);
    };

    function getTodoData(listName) {
        return localStorage.getItem(listName);
    };

    function setTodoData(listName, data) {
        localStorage.setItem(listName, data);
    };

    function createTodoApp(container, listName, title = 'Список дел') {

        let todoAppTitle = createAppTitile(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        let todoData = getTodoData(listName);
        if (todoData) {
            let todoArray = jsonToData(todoData);
            todoArray.forEach(function(todoObject){
                let todoItem = createTodoItem(todoObject.name, todoObject.done);
                todoList.append(todoItem.item);
            })
        }

        todoItemForm.form.addEventListener('submit', function(e){
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            let todoData = getTodoData(listName);
            let todoArray = todoData ? jsonToData(todoData) : [];


            let id = Math.floor(Math.random() * 1000);
            let todoItem = createTodoItem(todoItemForm.input.value, false, id);

            let todoObject = {
                name: todoItemForm.input.value,
                done: false,
                id: id,
            };

            todoArray.push(todoObject);

            todoItem.doneButton.addEventListener('click', function() {
                let todo = todoArray.find(todo => todo.id === todoItem.id);
                if (todo) {
                    todo.done = !todo.done;
                    let jsonData = dataToJson(todoArray);
                    setTodoData(listName, jsonData);
                }
                todoItem.item.classList.toggle('list-group-item-success');
            });
            todoItem.deleteButton.addEventListener('click', function(){
                if (confirm('Вы уверены?')) {
                    todoItem.item.remove();
                }
            });

            todoList.append(todoItem.item);

            let jsonData = dataToJson(todoArray);

            setTodoData(listName, jsonData);

            todoItemForm.input.value = '';

        });
    }

    window.createTodoApp = createTodoApp;
})();
