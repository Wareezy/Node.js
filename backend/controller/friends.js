import {getFriends,getFriend,addFriend,deleteFriend,patchFriend} from '../models/database.js'
export default{
    //we are writing them as objects

    //getFriends is the name of the method to call the function
    //middleware will be added to check if the token exists
    getMany:async(req,res)=>{
        res.send(await getFriends())
        }
        
,

    postMany:async (req,res)=>
    {
        //does destructuring in the declared order
    const {name,age}=req.body
    await addFriend(name,age)
    // const name=req.body.name
    // const age=req.body.age
    res.send(await getFriends())
    },

    getUnique:async(req,res)=>{
        res.send(await getFriend(+req.params.id))
            }

            ,
            deleteUnique:async(req,res)=>{
                    //(where do you want to remove,how many, what do u want to add)
            await deleteFriend(req.params.name)
               res.json(await getFriends())
            
                }
                ,
                editUnique:async(req,res)=>{

                    const [friend]= await getFriend(+req.params.id)
                    //looking for a matching object with id
                    let {name,age}= req.body
                    
                    // "? means that the value is null
                    name? name=name:{name}=friend
                    age? age=age: {age}=friend
                    console.log(friend);
                    //updating name value with users parsed data which is what we used
                    await patchFriend(name,age,+req.params.id);
                    //send takes in multiple types of data to the user
                    //json is when you know what type of data that you want to send
                    res.json(await getFriends())
                            }
}