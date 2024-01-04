(function () {

    function dataToJson(data) {
        return JSON.stringify(data);
    };

    function jsonToData(data) {
        return JSON.parse(data);
    };

    function getTodoData() {
        return localStorage.getItem('id');
    };

    function setTodoData() {
        localStorage.setItem('id', data);
    };

});