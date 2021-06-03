// this js is client side
const chatMessages = document.querySelector('.chat');
const roomNames=document.querySelector('.room');
const userList=document.querySelector('.UserNames');
const socket = io();
// get string from get url
//emit server this things
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

// join chatroom throw
socket.emit('joinroom',{username,room});

//get room and users
socket.on('roomUsers',({room,users}) =>{
    outputRoomName(room);
    outputUsers(users);
});

//message from a server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    // scroll down 
    chatMessages.scrollTop = chatMessages.scrollHeight;

})

const sendBtn = document.getElementById('SendBtn');

sendBtn.addEventListener('click',()=>{
    buttonPress();
});
document.addEventListener('keypress',function(e){
    if(e.key==='Enter'){
        buttonPress();
    }
});

function buttonPress(){
    let inpMsg = document.getElementById('inpMsg').value;

    //emiiting message to server
    if(inpMsg!="")
    socket.emit('chatMessage',inpMsg);
    
    document.getElementById('inpMsg').value='';
    document.getElementById('inpMsg').focus();
    
}

// output to dom
function outputMessage(message){
    const chat = document.querySelector('.chat');
    let div = document.createElement('div');
    let text = document.createElement('div');
    let name = document.createElement('div');
    let time = document.createElement('span');
    time.classList.add('time');
    div.classList.add('message');
    text.classList.add('text');
    name.classList.add('name');
    name.innerHTML=`${message.username} `;
    text.innerText=`${message.text}`;
    time.innerHTML = `${message.time}`;
    name.append(time);
    div.append(name);
    
    div.append(text);
    
    chat.append(div);

}

function outputRoomName(room){
    console.log(room);
    roomNames.innerHTML = room;
}
function outputUsers(users){
    users.forEach(element => {
        console.log(element.username)
    });
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')
    }`;
}