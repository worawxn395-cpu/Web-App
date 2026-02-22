const API_URL = "https://script.google.com/macros/s/AKfycbyQHiXz48__YUcGRzX4LVwa77R35md17b4AYRAcD-0ia42fd7BA0Tf8OW4UvMJtTFRP7Q/exec";

let questions = [];
let answers = [];

/* โหลดคำถาม */
async function loadQuestions(){
  const res = await fetch(API_URL+"?action=getQuestions");
  questions = await res.json();
}

/* แสดงคำถาม */
async function renderQuestions(){
  if(!document.getElementById("questions")) return;
  await loadQuestions();
  const box = document.getElementById("questions");
  box.innerHTML="";
  answers=[];

  questions.forEach((q,i)=>{
    answers[i]=0;
    let div=document.createElement("div");
    div.className="question";
    div.innerHTML=`<p>${i+1}. ${q[1] || ""} ${q[0]}</p>`;

    ["1","2","3","4","5"].forEach(score=>{
      let btn=document.createElement("button");
      btn.innerText=score;
      btn.className="emoji";
      btn.onclick=()=>{
        answers[i]=score;
        div.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
      };
      div.appendChild(btn);
    });

    box.appendChild(div);
  });
}

/* ส่งแบบประเมิน */
async function submitForm(){
  if(answers.includes(0)){
    alert("กรุณาตอบให้ครบ");
    return;
  }

  const data = [
    document.getElementById("name").value,
    document.getElementById("number").value,
    document.getElementById("gender").value,
    document.getElementById("classroom").value,
    ...answers,
    document.getElementById("suggestion").value
  ];

  await fetch(API_URL+"?action=saveResponse",{
    method:"POST",
    body:JSON.stringify(data)
  });

  alert("บันทึกสำเร็จ");
}

/* หน้าแก้ไข */
async function renderEdit(){
  if(!document.getElementById("editQuestions")) return;
  await loadQuestions();
  const box=document.getElementById("editQuestions");
  box.innerHTML="";

  questions.forEach((q,i)=>{
    box.innerHTML+=`
    <div>
      <input value="${q[0]}" onchange="questions[${i}][0]=this.value">
      <input value="${q[1]||''}" onchange="questions[${i}][1]=this.value">
      <button onclick="questions.splice(${i},1);renderEdit()">ลบ</button>
    </div>`;
  });
}

function addQuestion(){
  const q=document.getElementById("newQuestion").value;
  const e=document.getElementById("newEmoji").value;
  questions.push([q,e]);
  renderEdit();
}

async function saveQuestions(){
  await fetch(API_URL+"?action=saveQuestions",{
    method:"POST",
    body:JSON.stringify(questions)
  });
  alert("บันทึกแล้ว");
}

/* Dashboard */
async function renderDashboard(){
  if(!document.getElementById("genderChart")) return;

  const res=await fetch(API_URL+"?action=getData");
  const data=await res.json();
  data.shift();

  let male=0,female=0;
  let rooms={};

  data.forEach(r=>{
    if(r[3]==="ชาย") male++;
    if(r[3]==="หญิง") female++;
    rooms[r[4]]=(rooms[r[4]]||0)+1;
  });

  new Chart(document.getElementById("genderChart"),{
    type:"pie",
    data:{
      labels:["ชาย","หญิง"],
      datasets:[{
        data:[male,female],
        backgroundColor:["#0d6efd","#ff69b4"]
      }]
    }
  });

  new Chart(document.getElementById("roomChart"),{
    type:"bar",
    data:{
      labels:Object.keys(rooms),
      datasets:[{
        label:"จำนวนต่อห้อง",
        data:Object.values(rooms),
        backgroundColor:"#0d6efd"
      }]
    }
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  renderQuestions();
  renderEdit();
  renderDashboard();
});
