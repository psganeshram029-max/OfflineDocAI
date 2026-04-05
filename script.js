// PDF LIB
const { jsPDF } = window.jspdf;

// PAGE SWITCH
function openPage(id){
  document.querySelectorAll(".section").forEach(s => s.style.display="none");
  document.getElementById(id).style.display="block";
}

// TIME
setInterval(()=>{
  document.getElementById("time").innerText = new Date().toLocaleString();
},1000);

// 🔥 REPORT COUNT (NO FORCE RESET)
let reportCount = parseInt(localStorage.getItem("reports") || "0");

// DATA
let data = [

 {k:["fever"],c:"Fever",m:"Paracetamol",a:"Take rest and stay hydrated"},
 {k:["cough"],c:"Cough",m:"Cough Syrup",a:"Drink warm fluids"},
 {k:["headache"],c:"Headache",m:"Pain reliever",a:"Proper sleep"},
 {k:["stomach","pain"],c:"Gastric Issue",m:"Antacid",a:"Avoid spicy food"},

 {k:["breath","asthma","wheezing","breathing problem"],c:"Asthma",
  m:"Bronchodilator Inhaler",
  a:"Avoid dust, use inhaler, consult doctor if severe"},

 {k:["sugar","diabetes","frequent urination","thirst"],c:"Diabetes",
  m:"Metformin / Insulin",
  a:"Control sugar intake, monitor glucose regularly"},

 {k:["bp","pressure","hypertension","high bp"],c:"Hypertension",
  m:"Amlodipine / Beta blockers",
  a:"Reduce salt, exercise regularly, monitor BP"},

 {k:["chest pain","heart attack"],c:"Emergency",
  m:"Immediate medical attention",
  a:"Go to nearest hospital immediately"}
];

// LAST RESULT
let lastResult = {};

// ANALYZE
function check(){

let name = document.getElementById("name").value;
let age = document.getElementById("age").value;
let country = document.getElementById("country").value;
let phone = document.getElementById("phone").value;
let fullPhone = country + " " + phone;

let input = document.getElementById("symptom").value.toLowerCase();
let result = document.getElementById("result");

result.innerHTML = `<div class="spinner"></div><p>Analyzing...</p>`;

setTimeout(()=>{

let f = data.find(d => d.k.some(k => input.includes(k)));

if(f){

lastResult = {
  name,
  age,
  phone: fullPhone,
  condition: f.c,
  medicine: f.m,
  advice: f.a
};

// DISPLAY
if(f.c === "Emergency"){
  result.innerHTML = `
  <div class="card" style="background:red;">
    ⚠️ ${f.a}
  </div>`;
}else{
  result.innerHTML = `
  <div class="card">
    👤 ${name} (${age})<br>
    📱 ${fullPhone}<br>
    🩺 ${f.c}<br>
    💊 ${f.m}<br>
    📌 ${f.a}
  </div>`;
}

// 🔥 PATIENT COUNT (HISTORY)
let h = JSON.parse(localStorage.getItem("h") || "[]");
h.push(lastResult);
localStorage.setItem("h", JSON.stringify(h));

loadHistory();
updateCount();

}else{
  result.innerHTML = `<div class="card">No match found</div>`;
}

},1000);
}

// PDF DOWNLOAD
function downloadPDF(){

if(!lastResult.name){
  alert("Analyze first!");
  return;
}

let doc = new jsPDF();

// HEADER
doc.setFontSize(18);
doc.setFont(undefined, "bold");
doc.text("OFFLINEDOC AI CLINIC", 60, 20);

doc.setFontSize(10);
doc.setFont(undefined, "normal");
doc.text("Basic Medical Assessment Report", 65, 28);

doc.line(10, 32, 200, 32);

// PATIENT
doc.setFontSize(12);
doc.setFont(undefined, "bold");
doc.text("Patient Information", 10, 45);

doc.setFont(undefined, "normal");
doc.text("Name: " + lastResult.name, 10, 55);
doc.text("Age: " + lastResult.age, 10, 65);
doc.text("Phone: " + lastResult.phone, 10, 75);

doc.line(10, 85, 200, 85);

// MEDICAL
doc.setFont(undefined, "bold");
doc.text("Medical Assessment", 10, 100);

doc.setFont(undefined, "normal");
doc.text("Condition: " + lastResult.condition, 10, 110);
doc.text("Medicine: " + lastResult.medicine, 10, 120);
doc.text("Advice: " + lastResult.advice, 10, 130);

doc.line(10, 140, 200, 140);

// DATE
doc.text("Report Generated: " + new Date().toLocaleString(), 10, 155);

// SIGN
doc.text("Doctor Signature:", 140, 180);
doc.line(140, 185, 200, 185);

// FOOTER
doc.setFontSize(10);
doc.text("System Generated Report - OfflineDoc AI", 10, 200);

// SAVE
doc.save("Medical_Report.pdf");

// 🔥 REPORT COUNT
reportCount++;
localStorage.setItem("reports", reportCount);
updateReports();
}

// HISTORY
function loadHistory(){
let h = JSON.parse(localStorage.getItem("h") || "[]");

document.getElementById("historyList").innerHTML =
h.map((p,i)=>`
<div class="card">
${p.name} (${p.age})<br>
📱 ${p.phone}<br>
🩺 ${p.condition}
<button onclick="del(${i})">❌</button>
</div>
`).join("");
}

// DELETE
function del(i){
let h = JSON.parse(localStorage.getItem("h") || "[]");
h.splice(i,1);
localStorage.setItem("h", JSON.stringify(h));
loadHistory();
updateCount();
}

// CLEAR
function clearHistory(){
localStorage.removeItem("h");
loadHistory();
updateCount();
}

// PATIENT COUNT
function updateCount(){
let h = JSON.parse(localStorage.getItem("h") || "[]");
document.getElementById("count").innerText = h.length;
}

// REPORT COUNT
function updateReports(){
document.getElementById("reports").innerText =
  localStorage.getItem("reports") || 0;
}

// INIT
loadHistory();
updateCount();
updateReports();