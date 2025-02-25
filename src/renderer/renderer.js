console.log("Renderer process loaded.");
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

document.addEventListener("DOMContentLoaded", () => {
    // Notes App
    document.getElementById("saveNote").addEventListener("click", () => {
        const note = document.getElementById("notesText").value;
        alert("Note saved: " + note);
    });

    // Task Manager
    document.getElementById("addTask").addEventListener("click", () => {
        const taskInput = document.getElementById("taskInput");
        if (taskInput.value.trim() !== "") {
            const taskList = document.getElementById("taskList");
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";
            listItem.textContent = taskInput.value;
            taskList.appendChild(listItem);
            taskInput.value = "";
        }
    });
});
