
const express = require('express')
const { json } = require('express/lib/response')
const User = require('./users/model')

const server = express()
server.use(express.json())

server.get('/hello', (req, res)=>{
    res.json({message: "hello world"})
})

server.get('/api/users', async (req, res)=> {
    // res.json({message: "TEST: get /api/users"})
    try{
        const user = await User.find()
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({
            message: 'The users information could not be retrieved',
            err: err.message,
            stack: err.message
        })
    }
})
server.get('/api/users/:id', async (req, res)=> {
    // res.json({message: "TEST: get /api/users/:id"})
    try{
        const user = await User.findById(req.params.id)
        if(!user){
            res.status(404).json({message: "The user with the specified ID does not exist"})
        }else{
            res.status(200).json(user)
        }

    }catch(err){
        res.status(500).json({
            message: 'The user information could not be retrieved',
            err: err.message,
            stack: err.message
        }) 
    }
})
server.post('/api/users', async (req, res)=> {
    // res.json({message: "TEST: post /api/users"})
    const { name, bio} = req.body
    if(!name || !bio){
        res.status(400).json({message: "Please provide name and bio for the user"})
    }else{
        User.insert(req.body)
        .then( user => {
            res.status(201).json(user)
        })
        .catch(err=>{
            res.status(500).json({
                message: 'The user information could not be retrieved',
                err: err.message,
                stack: err.message
            })  
        })
    }

})
server.delete('/api/users/:id', async (req, res)=> {
    // res.json({message: "TEST: delete /api/users/:id"})

    try{
       const possibleUser = await User.findById(req.params.id)
       if(!possibleUser){
           res.status(404).json({message: "The user with the specified ID does not exist"})
       } else {
           const delUser = await User.remove(possibleUser.id)
           res.status(200).json(possibleUser)
       }
    }catch(err){
        res.status(500).json({
            message: 'The user information could not be retrieved',
            err: err.message,
            stack: err.message
        })   
    }
})
server.put('/api/users/:id', async (req, res)=> {
    // res.json({message: "TEST: put /api/users/:id"})

    try{
        const { name, bio} = req.body
        const possibleUser = await User.findById(req.params.id)
        if(!possibleUser){
            res.status(404).json({message: "The user with the specified ID does not exist"})
        }else if (!name || !bio){
            res.status(400).json({message: "Please provide name and bio for the user" })
        }else{
            const updateUser = await User.update(req.params.id, req.body)
            res.status(200).json(updateUser)
        }
    }catch(err){
        res.status(500).json({
            message: 'The user information could not be retrieved',
            err: err.message,
            stack: err.message
        })   
    }
})


server.use('*', (req, res)=>{
    res.status(404).json({
        message:" not found"
    })
})

module.exports = server;