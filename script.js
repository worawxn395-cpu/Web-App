const API="https://script.google.com/macros/s/AKfycbzRKmnrMS6fLxxgKwNnb861RTjX4qzoF-erOtjtjlOaRx-1EiYAGbfKx9xWRtjWO0LT3Q/exec";
function apiGet(action){
return fetch(API_URL+"?action="+action)
.then(r=>r.json());
}

function apiPost(action,data){
return fetch(API_URL+"?action="+action,{
method:"POST",
body:JSON.stringify(data)
}).then(r=>r.json());
}

function getQuestions(){ return apiGet("getQuestions"); }
function saveQuestions(data){ return apiPost("saveQuestions",data); }

function saveResponse(data){ return apiPost("saveResponse",data); }
function getData(){ return apiGet("getData"); }
