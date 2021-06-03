const users = [];
// add user to join 
function userJoin(id,username,room){
    let user = {
        id,username,room
    }
    users.push(user);
    return user;
}

//  remove current user
function userLeave(id){
    let index = users.findIndex(user => user.id === id);
    if(index!==-1){
        return users.splice(index,1)[0];
    }

}
// get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

//get cuurent user
function getCurrentUser(id){

    let Username =  users.find(user =>user.id===id);
    console.log(Username);
    return Username;
}



module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}