
// canvas
const canvas = document.getElementById("chaosCanvas");
const ctx = canvas.getContext("2d");

// controls
const colorPicker = document.getElementById("colorPicker");
const brushSlider = document.getElementById("brushSize");

let drawing = false;
let brushColor = "#000000";
let brushSize = 5;
let brushMode = "normal";
let hue = 0;

// events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

colorPicker.addEventListener("input", () => {
brushColor = colorPicker.value;
});

brushSlider.addEventListener("input", () => {
brushSize = brushSlider.value;
});

// start
function startDrawing(e){
drawing = true;
draw(e);
}

// stop
function stopDrawing(){
drawing = false;
ctx.beginPath();
}

// draw
function draw(e){

if(!drawing) return;

ctx.lineWidth = brushSize;
ctx.lineCap = "round";

// rainbow brush
if(brushMode === "rainbow"){
ctx.strokeStyle = `hsl(${hue},100%,50%)`;
hue++;
}

// glow brush
else if(brushMode === "glow"){
ctx.strokeStyle = brushColor;
ctx.shadowBlur = 20;
ctx.shadowColor = brushColor;
}

// sparkle brush
else if(brushMode === "sparkle"){
ctx.strokeStyle = brushColor;

for(let i=0;i<3;i++){
ctx.beginPath();
ctx.arc(
e.offsetX + Math.random()*10-5,
e.offsetY + Math.random()*10-5,
2,
0,
Math.PI*2
);
ctx.fillStyle = brushColor;
ctx.fill();
}
}

// normal
else{
ctx.strokeStyle = brushColor;
ctx.shadowBlur = 0;
}

// draw line
ctx.lineTo(e.offsetX,e.offsetY);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(e.offsetX,e.offsetY);

}

// brush modes
function setNormalBrush(){
brushMode="normal";
ctx.shadowBlur=0;
}

function setSparkleBrush(){
brushMode="sparkle";
}

function setRainbowBrush(){
brushMode="rainbow";
}

function setGlowBrush(){
brushMode="glow";
}

// eraser
function eraserTool(){
brushColor="white";
brushMode="normal";
}

// clear
function clearCanvas(){
ctx.clearRect(0,0,canvas.width,canvas.height);
}

// download
function downloadCanvas(){

const link=document.createElement("a");
link.download="chaos-art.png";
link.href=canvas.toDataURL();
link.click();

}
function saveWriting(){

const text=document.getElementById("writingBox").value;

const visibility=document.querySelector(
'input[name="visibility"]:checked'
).value;

const entry={

text:text,

visibility:visibility

};

localStorage.setItem("writingEntry",JSON.stringify(entry));

alert("Your writing has been saved.");

}