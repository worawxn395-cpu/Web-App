const API = "https://script.google.com/macros/s/AKfycbznJWp2xBHmbz5Nuk3GdeeFEvBeSQNQ_QXcTqEqjhIzVX1FJtG2UOc1qtfbUSFgFHY9EA/exec

let configData = {questions:[],emojis:[]};
let answers=[];

/* โหลด config ทุกหน้า */
function loadConfig(callback){
fetch(API+"?action=config")
.then(r=>r.json())
.then(data=>{
configData=data;
if(document.getElementById("questions")) renderQuestions();
if(document.getElementById("editQuestions")) renderEdit();
if(callback) callback();
});
}

/* หน้าแบบประเมิน */
function renderQuestions(){
const box=document.getElementById("questions");
box.innerHTML="";
answers=[];

configData.questions.forEach((q,i)=>{
answers[i]=0;
let div=document.createElement("div");
div.className="mb-4 p-4 bg-sky-50 rounded-xl";

div.innerHTML=`<p class="font-medium mb-2">ข้อที่ ${i+1} : ${q}</p>`;

configData.emojis.forEach((e,index)=>{
let btn=document.createElement("button");
btn.innerText=e;
btn.className="text-2xl p-2 mx-1";
btn.onclick=()=>{
answers[i]=index+1;
div.querySelectorAll("button").forEach(b=>b.classList.remove("active-emoji"));
btn.classList.add("active-emoji");
};
div.appendChild(btn);
});
box.appendChild(div);
});
}

/* ส่งแบบประเมิน */
function submitForm(){
if(!name.value || !number.value || !gender.value || !classroom.value || answers.includes(0)){
Swal.fire("กรุณากรอกให้ครบ");
return;
}

let url=API+"?action=save"+
"&name="+encodeURIComponent(name.value)+
"&number="+encodeURIComponent(number.value)+
"&gender="+encodeURIComponent(gender.value)+
"&classroom="+encodeURIComponent(classroom.value);

answers.forEach((ans,i)=>{
url+="&q"+(i+1)+"="+ans;
});

fetch(url)
.then(()=>Swal.fire("บันทึกสำเร็จ"));
}

/* หน้าแก้ไข */
function renderEdit(){
const box=document.getElementById("editQuestions");
box.innerHTML="";

configData.questions.forEach((q,i)=>{
box.innerHTML+=`
<div class="flex gap-2 mb-2">
<span>${i+1}.</span>
<input value="${q}"
onchange="configData.questions[${i}]=this.value"
class="w-full p-2 border rounded">
</div>`;
});

const emoBox=document.getElementById("editEmojis");
emoBox.innerHTML="";
configData.emojis.forEach((e,i)=>{
emoBox.innerHTML+=`
<input value="${e}"
onchange="configData.emojis[${i}]=this.value"
class="w-16 p-2 border rounded text-center">
`;
});
}

function addQuestion(){
let q=document.getElementById("newQuestion").value;
if(!q) return;
configData.questions.push(q);
renderEdit();
}

function saveConfig(){
fetch(API+"?action=saveConfig"+
"&questions="+encodeURIComponent(JSON.stringify(configData.questions))+
"&emojis="+encodeURIComponent(JSON.stringify(configData.emojis))
)
.then(()=>Swal.fire("บันทึกสำเร็จ"));
}

/* Dashboard */
if(document.getElementById("genderChart")){
fetch(API+"?action=dashboard")
.then(r=>r.json())
.then(data=>{
document.getElementById("total").innerText=
"จำนวนผู้ตอบทั้งหมด: "+data.total;

new Chart(genderChart,{
type:'pie',
data:{
labels:Object.keys(data.gender),
datasets:[{data:Object.values(data.gender),
backgroundColor:["#0284c7","#f472b6"]
}
});

new Chart(classChart,{
type:'bar',
data:{
labels:Object.keys(data.classroom),
datasets:[{data:Object.values(data.classroom),
backgroundColor:"#0ea5e9"}]
}
});

new Chart(avgChart,{
type:'bar',
data:{
labels:data.avg.map((_,i)=>"Q"+(i+1)),
datasets:[{data:data.avg,
backgroundColor:"#38bdf8"}]
}
});
});
}

loadConfig();
