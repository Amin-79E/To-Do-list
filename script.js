const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const emptyMsg = document.getElementById("empty-msg");
const footer = document.getElementById("footer");
const counter = document.getElementById("counter");

function updateUI() {
    const total = listContainer.querySelectorAll("li").length;
    const left = listContainer.querySelectorAll("li:not(.checked)").length;
    emptyMsg.style.display = total === 0 ? "block" : "none";
    footer.style.display = total === 0 ? "none" : "flex";
    counter.textContent = left + (left === 1 ? " task left" : " tasks left");
}

function makeTask(text, done) {
    const li = document.createElement("li");
    li.textContent = text;
    if (done) li.classList.add("checked");
    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
    return li;
}

function readTasks() {
    return Array.from(listContainer.querySelectorAll("li")).map(li => ({
        text: Array.from(li.childNodes)
            .filter(n => n.nodeType === 3)
            .map(n => n.nodeValue)
            .join(""),
        done: li.classList.contains("checked")
    }));
}

function addTask() {
    if (inputBox.value.trim() === "") return;
    listContainer.appendChild(makeTask(inputBox.value.trim(), false));
    inputBox.value = "";
    saveData();
}

function editTask(li) {
    if (li.querySelector("input")) return;
    const textNode = li.firstChild;
    if (!textNode || textNode.nodeType !== 3) return;
    const old = textNode.nodeValue;
    const input = document.createElement("input");
    input.className = "edit-input";
    input.value = old;
    li.replaceChild(input, textNode);
    input.focus();
    input.select();
    let done = false;
    function finish(save) {
        if (done) return;
        done = true;
        const value = input.value.trim();
        li.replaceChild(document.createTextNode(save && value ? value : old), input);
        saveData();
    }
    input.addEventListener("blur", () => finish(true));
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") finish(true);
        if (e.key === "Escape") finish(false);
    });
}

document.querySelector(".row button").addEventListener("click", addTask);
inputBox.addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
});

listContainer.addEventListener("click", e => {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
});

listContainer.addEventListener("dblclick", e => {
    if (e.target.tagName === "LI") editTask(e.target);
});

document.getElementById("clear-btn").addEventListener("click", () => {
    listContainer.querySelectorAll("li.checked").forEach(li => li.remove());
    saveData();
});

function saveData() {
    updateUI();
    fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(readTasks())
    }).catch(() => console.error("Could not save. Is the server running?"));
}

async function showTasks() {
    try {
        const res = await fetch("/api/tasks");
        const tasks = await res.json();
        if (Array.isArray(tasks)) {
            listContainer.innerHTML = "";
            tasks.forEach(t => listContainer.appendChild(makeTask(t.text, t.done)));
        }
    } catch (e) {
        console.error("Could not load tasks. Is the server running?");
    }
    updateUI();
}
showTasks();