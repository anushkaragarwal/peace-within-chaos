function showDiary() {
    document.getElementById("diary").style.display = "block";
}

window.onload = function() {
    let saved = JSON.parse(localStorage.getItem("entries")) || [];
    saved.forEach(function(text, index) {
        addEntryToPage(text, index);
    });
};

function saveEntry() {
    let text = document.getElementById("entry").value;

    if (text.trim() === "") {
        alert("Write something first 🙂");
        return;
    }

    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.push(text);

    localStorage.setItem("entries", JSON.stringify(entries));

    addEntryToPage(text, entries.length - 1);

    document.getElementById("entry").value = "";
}

function addEntryToPage(text, index) {
    let container = document.createElement("div");
    container.className = "entryCard";

    let paragraph = document.createElement("p");
    paragraph.textContent = text;

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function() {
        deleteEntry(index);
    };

    container.appendChild(paragraph);
    container.appendChild(deleteBtn);

    document.getElementById("savedEntries").appendChild(container);
}

function deleteEntry(index) {
    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.splice(index, 1);
    localStorage.setItem("entries", JSON.stringify(entries));
    location.reload();
}

/* ================= CANVAS SECTION ================= */

let canvas;
let ctx;
let drawing = false;
let currentColor = "black";
let brushSize = 3;
function useEraser() {
    currentColor = "white";
}
function showCanvas() {
    document.getElementById("canvasContainer").style.display = "block";

    canvas = document.getElementById("chaosCanvas");
    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousedown", function() {
        drawing = true;
    });

    canvas.addEventListener("mouseup", function() {
        drawing = false;
        ctx.beginPath();
    });

    canvas.addEventListener("mousemove", function(e) {
        if (!drawing) return;

        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.strokeStyle = currentColor;

        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });
}

function changeColor(color) {
    currentColor = color;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function changeBrushSize(size) {
    brushSize = size;
}