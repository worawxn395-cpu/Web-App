const API_URL = "https://script.google.com/macros/s/AKfycbyQHiXz48__YUcGRzX4LVwa77R35md17b4AYRAcD-0ia42fd7BA0Tf8OW4UvMJtTFRP7Q/exec";

let questions = [];
let answers = [];

/* โหลดคำถาม */
async function loadQuestions(){
  const res = await fetch(API_URL+"?action=getQuestions");
  questions = await res.json();
}

/* ===========================
   หน้าแบบประเมิน
=========================== */
async function renderQuestions(){
  if(!document.getElementById("questions")) return;

  await loadQuestions();
  const box = document.getElementById("questions");
  box.innerHTML="";
  answers=[];

  const ratingEmojis = [
    {score:5, emoji:"😍"},
    {score:4, emoji:"😊"},
    {score:3, emoji:"😐"},
    {score:2, emoji:"😕"},
    {score:1, emoji:"😡"}
  ];

  questions.forEach((q,i)=>{
    answers[i]=0;

    let div=document.createElement("div");
    div.className="question-card";

    div.innerHTML=`<p><b>${i+1}. ${q[0]}</b></p>`;

    ratingEmojis.forEach(r=>{
      let btn=document.createElement("button");
      btn.innerHTML=`${r.emoji}<br><small>${r.score}</small>`;
      btn.className="rating-btn";

      btn.onclick=()=>{
        answers[i]=r.score;
        div.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
      };

      div.appendChild(btn);
    });

    box.appendChild(div);
  });
}

/* ส่งข้อมูล */
async function submitForm(){

  if(answers.includes(0)){
    alert("กรุณาตอบให้ครบทุกข้อ");
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
  location.reload();
}

/* ===========================
   หน้าแก้ไข
=========================== */

async function renderEdit(){
  if(!document.getElementById("editQuestions")) return;

  await loadQuestions();
  const box=document.getElementById("editQuestions");
  box.innerHTML="";

  questions.forEach((q,i)=>{
    box.innerHTML+=`
      <div class="edit-row">
        <input value="${q[0]}" onchange="questions[${i}][0]=this.value">
        <button onclick="questions.splice(${i},1);renderEdit()">ลบ</button>
      </div>
    `;
  });
}

function addQuestion(){
  const q=document.getElementById("newQuestion").value;
  if(!q) return;
  questions.push([q]);
  renderEdit();
}

async function saveQuestions(){
  await fetch(API_URL+"?action=saveQuestions",{
    method:"POST",
    body:JSON.stringify(questions)
  });
  alert("บันทึกแล้ว");
}

/* ===========================
   DASHBOARD
=========================== */

async function renderDashboard(){
  if(!document.getElementById("totalCount")) return;

  const res=await fetch(API_URL+"?action=getData");
  const data=await res.json();

  data.shift(); // ลบ header

  document.getElementById("totalCount").innerText = data.length;

  let male=0,female=0;
  let rooms={};
  let scoreSums=[];
  let scoreCounts=0;

  data.forEach(r=>{
    if(r[3]==="ชาย") male++;
    if(r[3]==="หญิง") female++;

    rooms[r[4]]=(rooms[r[4]]||0)+1;

    let scores=r.slice(5,r.length-1);
    scores.forEach((s,i)=>{
      scoreSums[i]=(scoreSums[i]||0)+Number(s);
    });

    scoreCounts++;
  });

  /* กราฟเพศ */
  new Chart(document.getElementById("genderChart"),{
    type:"pie",
    data:{
      labels:["ชาย","หญิง"],
      datasets:[{
        data:[male,female],
        backgroundColor:["#4facfe","#ff6ec7"]
      }]
    }
  });

  /* กราฟห้อง */
  new Chart(document.getElementById("roomChart"),{
    type:"bar",
    data:{
      labels:Object.keys(rooms),
      datasets:[{
        label:"จำนวนต่อห้อง",
        data:Object.values(rooms),
        backgroundColor:"#00c6ff"
      }]
    }
  });

  /* กราฟคะแนนเฉลี่ย */
  const averages=scoreSums.map(s=> (s/scoreCounts).toFixed(2));

  new Chart(document.getElementById("scoreChart"),{
    type:"bar",
    data:{
      labels:averages.map((_,i)=>"ข้อ "+(i+1)),
      datasets:[{
        label:"คะแนนเฉลี่ย",
        data:averages,
        backgroundColor:"#0d6efd"
      }]
    },
    options:{
      scales:{
        y:{beginAtZero:true,max:5}
      }
    }
  });
}

/* โหลดหน้า */
document.addEventListener("DOMContentLoaded",()=>{
  renderQuestions();
  renderEdit();
  renderDashboard();
});
