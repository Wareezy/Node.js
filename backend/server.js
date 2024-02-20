import express from 'express';
import {config} from 'dotenv';
import cors from 'cors'
import friendsRouter from '../backend/routes/friends.js'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import { addFriend,deleteFriend,addUser,checkUser} from './models/database.js';
config()

//3 ways to deal with json web tokens
//1.only the backend user can access the token, they will have to send and delete the token
//2. the backend user doesnt set the toen they send it with a response with the user then the front end user will have to set the token and 
//delete it
//3.the backend user will set the token and the front end user will delete the token


const PORT=process.env.PORT

const app=express();


//will allow this user to use the json data
app.use(cors({
    //orgin is the website local host of the frontend
    origin:'http://localhost:8080',
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static('views'))

// app.post('/login',(req,res)=>{
//     const {username}=req.body
//     //we assigned a token
//     //2 methods ..... sign and verify

//     //for bcrypt we use compare and hash
//     const token=jwt.sign({username:username},process.env.SECRET_KEY,{expiresIn:'1h'})
//     res.cookie('jwt',token)
//     res.json({
//         msg:"you have logged in"
//     })
// })
//authenticate must be above the root
// we need to use verify to check if the token is there but we need to find the token
const authenticate=(req,res,next)=>{
let {cookie}=req.headers
let tokenInHeader =cookie && cookie.split('=')[1]

if(tokenInHeader===null) res.sendStatus(401)//jwt is not store on the server at all, they are store on the browser then it is everytime send to the server

//this piece of code is used to verify the token

//works the same as bcrypt checks the token but doesnt return true its just returns an error/ and if the token has expired
jwt.verify(tokenInHeader,process.env.SECRET_KEY,(err,user)=>{

    if(err) return res.sendStatus(403)
    req.user=user
    next()

    //web token is made out of a header
    //a paylod which has data that you sending with
    //IAT is the time they registered (issued at)


    //header
    //payload
    //verification signature

})
}
app.use('/friends',authenticate,friendsRouter)


// app.use('/friends',addFriend)
// app.use('/friends',deleteFriend)

app.post('/users',(req,res)=>{

    const {username,password}=req.body
    bcrypt.hash(password,10,async (err,hash)=>{
        if(err) throw err
        await addUser(username,hash)
        res.send({
            msg: "you have created an account"
        })
    })

})

//checks for the values
//auth is a middleware this is used for a piece of code to run before the route
const auth=async (req,res,next)=>{
    //{} destructuring then it will actually become the key,not dependent on the order
    //[] destructuring is dependent on the order in which you call the values
    const {password,username}= req.body
    //check user will look at the username
    const hashedPassword= await checkUser(username)
    //takes the hash and the original password and it compares the 2
    bcrypt.compare(password,hashedPassword,(err,result)=>{
        //takes a object and either returns an error or a result of true
if(err) throw err
if(result === true){
    const {username}=req.body
    //we assigned a token
    //2 methods ..... sign and verify

    //for bcrypt we use compare and hash
    const token=jwt.sign({username:username},process.env.SECRET_KEY,{expiresIn:'1h'})
    //when httpOnly that means only the backend person can access the cookie and not the front end
    // res.cookie('jwt',token,{httpOnly:false})
    res.send({
        //the token that is being created is sent to the user
        token:token,
        msg:'i have logged in!!!! YAY!!'
        })
    next()
}else{
    res.send({msg:'The username or passwords is incorrect'})
}
    })
}

//normal route when user logs in this checks their data and checks to see if their details is correct
app.post('/login',auth, (req,res)=>{
    // res.send({
    // msg:'i have logged in!!!! YAY!!'
    // })
})

// app.delete('/logOut',(req,res)=>{
//     res.clearCookie('jwt')
//     res.send({
//         msg:'You have logged out'
//     })
// })
app.listen(PORT,()=>{
        console.log(`It is running on http://localhost:${PORT}/`)
    })
