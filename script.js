const API="https://script.google.com/macros/s/AKfycbzRKmnrMS6fLxxgKwNnb861RTjX4qzoF-erOtjtjlOaRx-1EiYAGbfKx9xWRtjWO0LT3Q/exec";

function createData(data){
return fetch(API,{method:"POST",body:JSON.stringify({...data,action:"create"})});
}

function updateData(data){
return fetch(API,{method:"POST",body:JSON.stringify({...data,action:"update"})});
}

function deleteData(row){
return fetch(API,{method:"POST",body:JSON.stringify({action:"delete",row})});
}

function getData(){
return fetch(API).then(r=>r.json());
}
