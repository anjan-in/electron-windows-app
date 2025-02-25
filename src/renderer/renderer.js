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

document.addEventListener("DOMContentLoaded", async () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    // Load Tasks
    const tasks = await window.taskAPI.loadTasks();
    tasks.forEach((task, index) => addTaskToList(task, index));

    // Add Task
    addTaskButton.addEventListener("click", () => {
        if (taskInput.value.trim() !== "") {
            window.taskAPI.addTask(taskInput.value);
            addTaskToList(taskInput.value, taskList.children.length);
            taskInput.value = "";
        }
    });   

    function addTaskToList(task, index) {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between";
        listItem.textContent = task;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-danger btn-sm";
        deleteBtn.textContent = "❌";
        deleteBtn.onclick = () => {
            window.taskAPI.deleteTask(index);
            listItem.remove();
        };

        listItem.appendChild(deleteBtn);
        taskList.appendChild(listItem);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const browseFileButton = document.getElementById("browseFile");
    const filePathDisplay = document.getElementById("filePath");

    browseFileButton.addEventListener("click", async () => {
        const filePath = await window.fileAPI.openFileDialog();
        if (filePath) {
            filePathDisplay.innerHTML = `Selected File: <strong>${filePath}</strong>`;
            filePathDisplay.onclick = () => window.fileAPI.openFile(filePath);
            filePathDisplay.style.cursor = "pointer";
            filePathDisplay.style.color = "blue";
        }
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    const notesTextArea = document.getElementById("notesText");
    const saveButton = document.getElementById("saveNote");

    // Load Saved Note
    notesTextArea.value = await window.electronAPI.loadNote();

    // Save Note
    saveButton.addEventListener("click", () => {
        window.electronAPI.saveNote(notesTextArea.value);
        alert("Note saved successfully!");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const selectImageButton = document.getElementById("selectImage");
    const imageDisplay = document.getElementById("imageDisplay");

    selectImageButton.addEventListener("click", async () => {
        const imagePath = await window.imageAPI.selectImage();
        if (imagePath) {
            imageDisplay.src = `file://${imagePath}`;
            imageDisplay.style.display = "block";
        }
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    const refreshButton = document.getElementById("refreshSystemInfo");

    async function loadSystemInfo() {
        const info = await window.systemAPI.getSystemInfo();
        document.getElementById("cpu").textContent = info.cpu;
        document.getElementById("totalMemory").textContent = info.totalMemory;
        document.getElementById("freeMemory").textContent = info.freeMemory;
        document.getElementById("osType").textContent = info.osType;
        document.getElementById("uptime").textContent = info.uptime;
    }

    // Load system info on startup
    await loadSystemInfo();

    // Refresh on button click
    refreshButton.addEventListener("click", loadSystemInfo);
});

// document.addEventListener("DOMContentLoaded", () => {
//     const fetchClipboardButton = document.getElementById("fetchClipboard");
//     const clipboardHistoryList = document.getElementById("clipboardHistory");

//     async function updateClipboardHistory() {
//         const history = await window.clipboardAPI.getClipboardText();
//         clipboardHistoryList.innerHTML = ''; // Clear previous list

//         history.forEach(text => {
//             const listItem = document.createElement("li");
//             listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
//             listItem.textContent = text;

//             const copyButton = document.createElement("button");
//             copyButton.classList.add("btn", "btn-sm", "btn-secondary");
//             copyButton.textContent = "Copy";
//             copyButton.onclick = () => window.clipboardAPI.copyToClipboard(text);

//             listItem.appendChild(copyButton);
//             clipboardHistoryList.appendChild(listItem);
//         });
//     }

//     fetchClipboardButton.addEventListener("click", updateClipboardHistory);
// });

document.addEventListener("DOMContentLoaded", () => {
    const fetchClipboardButton = document.getElementById("fetchClipboard");
    const clipboardHistoryList = document.getElementById("clipboardHistory");

    if (!fetchClipboardButton) return; // Ensure button exists

    async function updateClipboardHistory() {
        const history = await window.clipboardAPI.getClipboardText();
        clipboardHistoryList.innerHTML = ''; 

        history.forEach(text => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            listItem.textContent = text;

            const copyButton = document.createElement("button");
            copyButton.classList.add("btn", "btn-sm", "btn-secondary");
            copyButton.textContent = "Copy";
            copyButton.onclick = () => {
                window.clipboardAPI.copyToClipboard(text);
                alert("Copied to clipboard!");
            };

            listItem.appendChild(copyButton);
            clipboardHistoryList.appendChild(listItem);
        });
    }

    fetchClipboardButton.addEventListener("click", updateClipboardHistory);
});

