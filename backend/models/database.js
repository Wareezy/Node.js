import mysql from 'mysql2'
import {config} from 'dotenv'

config()

const pool=mysql.createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
}).promise()


const getFriends =async()=>{
    const [result] =await pool.query(`SELECT * FROM mates`)

    return result
}

const getFriend=async(id)=>{
const [result] = await pool.query(`
SELECT * FROM mates WHERE id=?
`,[id])
return result
//prepared statement accepts the query but not the data with it
}




const addFriend =async(name,age)=>{
     const [friend]=await pool.query(`
     INSERT INTO mates(name,age) VALUES (?,?)
     `,[name,age])
     return getFriend(friend.insertId)
}



const deleteFriend=async(name)=>{
    const [friend] = await pool.query(`
    DELETE FROM mates WHERE name=?;
    `,[name])
    //prepared statement accepts the query but not the data with it
    }


    
const patchFriend=async(name,age,id)=>{
    const [friend] = await pool.query(`
    UPDATE mates
SET name = ?, age = ?
WHERE id=?;
    `,[name,age,id])
    //prepared statement accepts the query but not the data with it
    }
// console.log(await addFriend('Darren',100))

// console.log(await getFriend(1))

  
const addUser = async(username,password)=>{
 await pool.query(`
   INSERT INTO users ( username, password) VALUES (?,?);

    `,[username,password])
}
//console.log(await addUser('mattdean','uhfhfhh'))

const checkUser=async (username)=>{
    const [[{password}]]=await pool.query(
        `SELECT password FROM users WHERE username=?`,[username]
    )
    return password
}
// console.log(await checkUser('andrew'))


export {getFriends,getFriend,addFriend,deleteFriend,patchFriend,
    
    addUser,checkUser
}