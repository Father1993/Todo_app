(function() {

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

    function writeTodoData(listName, data) {
        let jsonData = dataToJson(data);
        setTodoData(listName, jsonData);
    }

    function readTodoData(listName) {
        let todoData = getTodoData(listName);
        if (todoData) {
            return jsonToData(todoData);
        }
        return [];
    }


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

    function createTodoItem(name, done, id, listName) {
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
            item.classList.add('list-group-item-success');
        }
        
        doneButton.addEventListener('click', function() {

            let todoArray = readTodoData(listName);
            let todo = todoArray.find(todo => todo.id === id);
            if (todo) {
                todo.done = !todo.done;
                writeTodoData(listName, todoArray);
            }
            item.classList.toggle('list-group-item-success');
        })

        deleteButton.addEventListener('click', function(){
            if (confirm ('Вы уверены?')) {
                item.remove();

                let todoArray = readTodoData(listName);
                todoArray = todoArray.filter(todo => todo.id !== id);        
                writeTodoData(listName, todoArray);
            }
        })

        return {
            item,
            doneButton,
            deleteButton,
            id,
        };
    }

    function createTodoApp(container, listName, title = 'Список дел') {

        let todoAppTitle = createAppTitile(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        let todoArray = readTodoData(listName);

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        let todoData = getTodoData(listName);
        if (todoData) {
            todoArray = jsonToData(todoData);
            todoArray.forEach(function(todoObject){
                let todoItem = createTodoItem(todoObject.name, todoObject.done, todoObject.id, listName);
                todoList.append(todoItem.item);
            })
        }

        todoItemForm.form.addEventListener('submit', function(e){
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            todoArray = readTodoData(listName);

            let id = Math.floor(Math.random() * 1000);
            let todoItem = createTodoItem(todoItemForm.input.value, false, id, listName);

            let todoObject = {
                name: todoItemForm.input.value,
                done: false,
                id: id,
            };

            todoArray.push(todoObject);

            todoList.append(todoItem.item);

            writeTodoData(listName, todoArray);

            todoItemForm.input.value = '';

        });
    }

    window.createTodoApp = createTodoApp;
})();