const API_URL = "https://script.google.com/macros/s/AKfycbwT9gmANE3vUnih5HB55Os3-_fHjA4ovbBOjZ5GyYxP0bL_gxUj6eD_Yar5L0klOm0qEA/exec";

async function getQuestions(){
  const res = await fetch(API_URL + "?action=getQuestions");
  return await res.json();
}

async function saveQuestions(data){
  await fetch(API_URL + "?action=saveQuestions",{
    method:"POST",
    body: JSON.stringify(data)
  });
}

async function saveResponse(data){
  await fetch(API_URL + "?action=saveResponse",{
    method:"POST",
    body: JSON.stringify(data)
  });
}

async function getData(){
  const res = await fetch(API_URL + "?action=getData");
  return await res.json();
}
