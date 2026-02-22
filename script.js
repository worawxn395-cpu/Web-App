const API_URL = "https://script.google.com/macros/s/AKfycbyn3iPnGgsTKkEvMoemrCPtFeMjRsIsyrIEQt1Bejx-gnMFLK8LSBh6hUfO-gpVD7weaA/exec";

const EMOJIS = ["😍","😊","😐","😕","😡"];

async function getQuestions(){
  const res = await fetch(API_URL+"?action=getQuestions");
  return await res.json();
}

async function saveResponse(data){
  await fetch(API_URL+"?action=saveResponse",{
    method:"POST",
    body:JSON.stringify(data)
  });
}

async function saveQuestions(data){
  await fetch(API_URL+"?action=saveQuestions",{
    method:"POST",
    body:JSON.stringify(data)
  });
}

async function getDashboard(){
  const res = await fetch(API_URL+"?action=getDashboard");
  return await res.json();
}
