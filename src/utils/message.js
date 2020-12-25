const generateMessage=(username,text)=>{
return {
  username,
  message:text,
  createdAt:new Date().getTime()         //creates a javascript date object and .getTime returns a timestamp
};
}
const generateLocationMessage=(username,url)=>{
  return {
    username,
    url,
    createdAt:new Date().getTime()
  };
}

module.exports={
  generateMessage,
  generateLocationMessage
}
