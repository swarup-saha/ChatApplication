
const generate = (text)=>{
    return{
        text,
        CreatedAt: new Date().getTime()
    }
}


const generateLocation = (url)=>{
    return{
        url,
        CreatedAt: new Date().getTime()
    }
}
module.exports = {
    generate, generateLocation
}