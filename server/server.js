const express = require("express")
const app = express()
const path = require("path")
const formidable = require("formidable")
const jwt = require("jsonwebtoken")
const ObjectID = require('mongodb').ObjectID; //This does, that you can search and update a document that has an specific objectID
const detect = require("detect-file-type")
const {v1: uuidv1} = require("uuid")
const fs = require("fs")
const { resolveSoa } = require("dns")

// const isAuthendicated = require('./middleware.js')

// ################### MONGO ########################################################################
const mongoClient = require("mongodb").MongoClient

// Connecting with the URL, we use localhost
const mongoUrl = "mongodb://localhost:27017"

// THE DATABASE & COLLECTION
let db = ''
let userCollection = ''
let postsCollection = ''


mongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, response) => {
    if(err){console.log('Can NOT connect to mongo'); return; }
    console.log('Connected to mongo')
  
    db = response.db("facebook")
    userCollection = db.collection("users")
    postsCollection = db.collection("posts")
    chatCollection = db.collection("chat")

})



// ##################################################################################################
                                        // ROUTES SIGNUP //
// ##################################################################################################







app.get("/signup", (req, res) => {

    res.sendFile(path.join(__dirname, "views", "signup.html"))

})


app.post("/signup", (req, res) => {

    try{

        // Get the form with npm package formidbale
        const form = formidable({multiples: false})

        // Parse the data from the formidable form
        form.parse(req, (err, fields, files) => {

            if(err){return res.send("Error in form!")}

            // Store data in variables
            let txtEmail = fields.txtEmail
            let txtPassword = fields.txtPassword
            let txtFirstname = fields.txtFirstname
            let txtLastname = fields.txtLastname

            // profileImage.name + profileImage.path
            detect.fromFile( files.profileImage.path, (err, fileResult)=>{

                //Unique-id for filename
                let pictureName = uuidv1()+'.'+fileResult.ext
                
                // Check if extension is valid
                let allowedImageTypes = ['jpg', 'jpeg', 'png']

                if( !allowedImageTypes.includes(fileResult.ext) ){
                    return res.send('Image not allowed!')
                }

                // Move temp path to a new place -  images/userImages
                let oldPath = files.profileImage.path
                let newPath = path.join(__dirname, '..', 'public', 'images', 'userImages', pictureName)
                
                fs.rename(oldPath, newPath, err => {

                    if(err){console.log("Connot move file"); return;}
                    
                    if( txtEmail === "" && txtPassword === "" && txtFirstname === "" && txtLastname === ""){
        
                        res.status(500).send("Fields can't be empty!")
                        return;
        
                    }

                    
                    // Connect to the database and check if the email already exsists 
                    userCollection.find({"email":txtEmail}).toArray( (err, mongoResponse) => {
                        
                        if(err){ console.log("database error - cannot read")}
                        
                        if( mongoResponse.length != 0 ){
                            res.status(500).send("User already exsist!")
                            return
                        }

                        // If email does NOT exsist, insert the new user
                        userCollection.insertOne({

                            "email": txtEmail,
                            "password": txtPassword,
                            "firstName": txtFirstname,
                            "lastName": txtLastname,
                            "profileImage": pictureName, 
                            "status":1,
                            "unReadMessages":[],
                            "notifications":[],
                            "friends":[],
                            "friendRequests":[]

                        },  (err, jUser) => {

                            res.send(`User Created with following info:
                            
                                    </br></br>
                                    Email: ${txtEmail},</br>
                                    Firstname: ${txtFirstname},</br>
                                    Lastname: ${txtLastname},</br>
                                    UserID: ${jUser.insertedId}</br>
                                    <a href="login">Login here</a>
                                ` 
                            )

                        
                        })

                    })  

                })

            })

        })
        
    }catch(err){
        console.log('Error')
    }

})




// ##################################################################################################
                                        // ROUTES LOGIN //
// ##################################################################################################

app.get("/login", (req, res) => {

    res.sendFile(path.join(__dirname, "views", "login.html"))

})


app.post("/login", (req, res) => {
    
    try{
        const form = formidable({multiples: true})
        
        form.parse(req, (err, fields, files) =>{
            
            let txtEmail = fields.txtEmail; 
            let txtPassword = fields.txtPassword

            // UPDATE YOUR OWN PROFILE  - TO-DO: ADD catch error?
            userCollection.findOneAndUpdate({"email": txtEmail, "password": txtPassword}, {$set: {"status": 1}},  { returnOriginal: false }, (err, documentReturned) => {

                let userID  =  documentReturned.value._id.toString();                    

                if(documentReturned.ok == 1){

                    chatCollection.findOne({ "_id" : ObjectID(userID) }, (err, resultChat) => {

                        if(err){console.log('Error in ChatCollection FindOne'); return; }

                        if(resultChat){

                            userCollection.updateMany({"friends._id": ObjectID(userID)}, {$set : {"friends.$.status": 1}})

                            // If it matches store the NON sensetive data in a web token 
                            var token = jwt.sign({id: userID, "email":documentReturned.value.email, "firstName":documentReturned.value.firstName, "lastName":documentReturned.value.lastName, "profileImage":documentReturned.value.profileImage  }, 'the jwt secret key')
                            
                            // send the token back to the client, to get stored in a cookie
                            res.send(token)



                        }else{

                            chatCollection.insertOne({ _id : new ObjectID(userID), "chats":[] })
                            
                            userCollection.updateMany({"friends._id": ObjectID(userID)}, {$set : {"friends.$.status": 1}})
                            
                            // If it matches store the NON sensetive data in a web token 
                            var token = jwt.sign({id: userID, "email":documentReturned.value.email, "firstName":documentReturned.value.firstName, "lastName":documentReturned.value.lastName, "profileImage":documentReturned.value.profileImage  }, 'the jwt secret key')
                            
                            // send the token back to the client, to get stored in a cookie
                            res.send(token)

                        }


                    })
                    

                    // userCollection.updateMany({"friends._id": ObjectID(userID)}, {$set : {"friends.$.status": 1}})
                    // // If it matches store the NON sensetive data in a web token 
                    // var token = jwt.sign({id: userID, "email":documentReturned.value.email, "firstName":documentReturned.value.firstName, "lastName":documentReturned.value.lastName, "profileImage":documentReturned.value.profileImage  }, 'the jwt secret key')
                    
                    // // send the token back to the client, to get stored in a cookie
                    // res.send(token)

                }
                
            })

        })

    }catch(err){
        if(err){console.log("Error"); return; }
        console.log(" // Login // System is down for mainstance - try again later!")
    }

})


// ##################################################################################################
                                        // ROUTES LOGOUT //
// ##################################################################################################

app.get("/logout", isAuthendicated, (req, res) => {

    // UPDATE YOUR OWN PROFILE  - TO-DO: ADD catch error?
    userCollection.findOneAndUpdate({"_id": ObjectID(req.id)}, {$set: {"status": 0}},  { returnOriginal: false }, (err, documentReturned) => {

        if(documentReturned.ok == 1){

            userCollection.updateMany({"friends._id": ObjectID(req.id)}, {$set : {"friends.$.status": 0}})
            
            res.status(200).send({"status":1})


        }
        
    })

})




// ##################################################################################################
                                        // ROUTES FACEBOOK APP //
// ##################################################################################################

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})


// Should be GET/users/:id
app.get("/getData", isAuthendicated, (req, res) => {

        // GET USER OBJECT THOUGH DATA IN MONGO
        userCollection.find({"_id": ObjectID(req.id)}).toArray((err, mongoResponse) => {

            if(err){console.log('Couldnt get data from Mongo'); return; }

            // SEND USER OBJECT TO FRONTEND
            res.status(200).send(mongoResponse)

        })

})


// GET POSTS TO FRONTPAGE
app.get("/getPosts", isAuthendicated, (req, res) => {
 
    userCollection.find({_id : ObjectID(req.id)}).toArray((err, mongoFriendsArray) => {
        
        let loggedInUsersFriends = []

        for(let i = 0; mongoFriendsArray[0].friends.length > i; i++){
            
            loggedInUsersFriends.push(mongoFriendsArray[0].friends[i]._id.toString())

        }
                        
        // GET USER OBJECT THOUGH DATA IN MONGO - {"author.author_id" : id}
        postsCollection.find().toArray((err, mongoResponse) => {

            let myOwnAndfriendsPosts = []

            if(err){console.log('Couldnt get data from Mongo'); return; }

            // ONLY GET POSTS FROM YOUR FRIENDLIST & YOUR OWN
            for(let i = 0; mongoResponse.length > i; i++){
            
                if( loggedInUsersFriends.includes(mongoResponse[i].author.author_id) ||  mongoResponse[i].author.author_id == req.id){

                    myOwnAndfriendsPosts.push(mongoResponse[i])

                }
            }

            // SEND USER OBJECT TO FRONTEND
            res.status(200).send(myOwnAndfriendsPosts)

        })


    })    

})


// ##################################################################################################
                                        // SEARCH -------- //
// ##################################################################################################

// GET USERS FOR SEARCH
app.get("/users", isAuthendicated, (req, res)=>{

    try{

        // Getting the request from the frontend
        let searchFor = req.query.searchFor;

        //  REGEX for the input from the frontend
        var regexConst = new RegExp( searchFor, 'i') // A, a incasesentive

        // GET USER OBJECT THOUGH DATA IN MONGO
        userCollection.find({"firstName": regexConst}).toArray((err, ajUsers) => {

            results = []

            // Check if theres i a error
            if(err){ console.log("database error - cannot read");
                // Send back empty array
                res.status(500).send([]);
                return;
            } 

            for(let i = 0; ajUsers.length > i; i++){

                let aUser = {"_id":ajUsers[i]._id.toString(), "firstName": ajUsers[i].firstName, "lastName": ajUsers[i].lastName, "profileImage": ajUsers[i].profileImage, "status": ajUsers[i].status }
                results.push( aUser )

            }

            // JSON, same as JSON.PARSE
            res.status(200).json(results)
            
        })
        
    }catch(err){
        if(err){console.log("Could not find users"); return; }
        console.log("message")
    }


})




// ##################################################################################################
                                        // UPDATE USER -------- //
// ##################################################################################################


// UPDATE USER
app.post("/users/:id", isAuthendicated, (req, res) => {

    try{
        
        // let {id} = req.params
        // let userID = req.params.id

        const form = formidable({multiples: true})

        form.parse(req, (err, fields, files) =>{

            let txtFirstname = fields.firstName
            let txtLastname = fields.lastName

            // UPDATE YOUR OWN PROFILE  - TO-DO: ADD catch error?
            userCollection.findOneAndUpdate({"_id": ObjectID(req.id)}, {$set: {"firstName": txtFirstname, "lastName": txtLastname}},  { returnOriginal: false }, (err, documentReturned) => {

                if(documentReturned.ok == 1){

                    userCollection.updateMany({"friends._id": req.id}, {$set : {"friends.$.firstName": txtFirstname, "friends.$.lastName": txtLastname }})
                    var token = jwt.sign({id: req.id, "email":documentReturned.value.email, "firstName":documentReturned.value.firstName, "lastName":documentReturned.value.lastName, "profileImage":documentReturned.value.profileImage  }, 'the jwt secret key')
                }
                
                res.send({"userObject": documentReturned.value, "token": token})

            })
        
        })

    }catch(err){
        if(err){console.log("Couldt not update!"); return; }
        console.log(err)
    }

})




// ##################################################################################################
                                        // NEW POST -------- //
// ##################################################################################################


// CREATE NEW POST
app.post("/posts", isAuthendicated, (req, res) => {

        // FORM PARSE - GET DATA FROM CREATE POST FORM(frontend)
        const form = formidable({multiples: true})

        form.parse(req, (err, fields, files) =>{
            
            function isEmpty(obj) {
                return Object.keys(obj).length === 0 
            }

           if( isEmpty(files) == true){
                

                try{


                    // INSERT INTO POSTS COLLECTION  - {postMessage}
                    postsCollection.insertOne({

                        "body": fields.postMessage,
                        "image": "",
                        "likes": 0,
                        "likedBy":[],
                        "comments":[],
                        "author":{
                            "author_id": req.id,
                            "firstName": req.firstName,
                            "lastName": req.lastName,
                            "profileImage": req.profileImage
                        }

                    })


                    userCollection.find({_id : ObjectID(req.id)}).toArray((err, mongoFriendsArray) => {
                    
                        let loggedInUsersFriends = []
        
                        for(let i = 0; mongoFriendsArray[0].friends.length > i; i++){
                            
                            loggedInUsersFriends.push(mongoFriendsArray[0].friends[i]._id.toString())
        
                        }
                                        
                        // GET USER OBJECT THOUGH DATA IN MONGO - {"author.author_id" : id}
                        postsCollection.find().toArray((err, mongoResponse) => {
        
                            let myOwnAndfriendsPosts = []
                
                            if(err){console.log('Couldnt get data from Mongo'); return; }
        
                            // ONLY GET POSTS FROM YOUR FRIENDLIST & YOUR OWN
                            for(let i = 0; mongoResponse.length > i; i++){
                            
                                if( loggedInUsersFriends.includes(mongoResponse[i].author.author_id) ||  mongoResponse[i].author.author_id == req.id){
        
                                    myOwnAndfriendsPosts.push(mongoResponse[i])
        
                                }
        
                            }
        
                            // SEND USER OBJECT TO FRONTEND
                            res.status(200).send(myOwnAndfriendsPosts)
                
                        })
        
        
                    })


                    
                }catch(err){
                    if(err){console.log("message"); return; }
                    console.log("message")
                }

           }else{


                try{

                    detect.fromFile( files.image.path, (err, fileResult)=>{

                        if(err){ console.log('No image attacted'); next() }

                        //Unique-id for filename
                        let pictureName = uuidv1()+'.'+fileResult.ext
                        
                        // Check if extension is valid
                        let allowedImageTypes = ['jpg', 'jpeg', 'png']
                    
                        if( !allowedImageTypes.includes(fileResult.ext) ){
                            return res.send('Image not allowed!')
                        }
                    
                        // Move temp path to a new place -  images/userImages
                        let oldPath = files.image.path
                        let newPath = path.join(__dirname, '..', 'public', 'images', 'posts', pictureName)
                        
                        fs.rename(oldPath, newPath, err => {
                    
                            if(err){console.log("Connot move file"); return;}


                            // INSERT INTO POSTS COLLECTION  - {postMessage}
                            postsCollection.insertOne({

                                "body": fields.postMessage,
                                "image": pictureName,
                                "likes": 0,
                                "likedBy":[],
                                "comments":[],
                                "author":{
                                    "author_id": req.id,
                                    "firstName": req.firstName,
                                    "lastName": req.lastName,
                                    "profileImage": req.profileImage
                                }

                            })


                            userCollection.find({_id : ObjectID(req.id)}).toArray((err, mongoFriendsArray) => {
                            
                                let loggedInUsersFriends = []
                
                                for(let i = 0; mongoFriendsArray[0].friends.length > i; i++){
                                    
                                    loggedInUsersFriends.push(mongoFriendsArray[0].friends[i]._id.toString())
                
                                }
                                                
                                // GET USER OBJECT THOUGH DATA IN MONGO - {"author.author_id" : id}
                                postsCollection.find().toArray((err, mongoResponse) => {
                
                                    let myOwnAndfriendsPosts = []
                        
                                    if(err){console.log('Couldnt get data from Mongo'); return; }
                
                                    // ONLY GET POSTS FROM YOUR FRIENDLIST & YOUR OWN
                                    for(let i = 0; mongoResponse.length > i; i++){
                                    
                                        if( loggedInUsersFriends.includes(mongoResponse[i].author.author_id) ||  mongoResponse[i].author.author_id == req.id){
                
                                            myOwnAndfriendsPosts.push(mongoResponse[i])
                
                                        }
                
                                    }
                
                                    // SEND USER OBJECT TO FRONTEND
                                    res.status(200).send(myOwnAndfriendsPosts)
                        
                                })
                
                            })
                    
                        })
                    })


                    
                }catch(err){
                    if(err){console.log("message"); return; }
                    console.log("message")
                }

           }
            
        })
   
})



 
// ##################################################################################################
                                        // LIKE POST / UNLIKE -------- //
// ##################################################################################################

// LIKE POST
app.get("/likeUnlike/:word/:postID", isAuthendicated, (req, res) => {

        let likeUnlike = req.params.word
        let postID = req.params.postID

        // CHECK WETHER IT A LIKE OR AN UNLIKE
        if( likeUnlike == 'like' ){

            postsCollection.findOneAndUpdate({"_id": ObjectID(postID)}, { $inc:{ "likes": 1 }, $push:{ "likedBy" : req.id}   }, { returnOriginal: false }, (err, documentReturned)=>{

                if( documentReturned.ok == 1 ){

                    // PUSH ALL POSTS TO FRONTEND AGAIN 
                    userCollection.find({_id : ObjectID(req.id)}).toArray((err, mongoFriendsArray) => {
                    
                        let loggedInUsersFriends = []
        
                        for(let i = 0; mongoFriendsArray[0].friends.length > i; i++){
                            
                            loggedInUsersFriends.push(mongoFriendsArray[0].friends[i]._id.toString())
        
                        }

                                        
                        // GET USER OBJECT THOUGH DATA IN MONGO - {"author.author_id" : id}
                        postsCollection.find().toArray((err, mongoResponse) => {
        
                            let myOwnAndfriendsPosts = []
                
                            if(err){console.log('Couldnt get data from Mongo'); return; }
        
                            // ONLY GET POSTS FROM YOUR FRIENDLIST & YOUR OWN
                            for(let i = 0; mongoResponse.length > i; i++){
                            
                                if( loggedInUsersFriends.includes(mongoResponse[i].author.author_id) ||  mongoResponse[i].author.author_id == req.id){
        
                                    myOwnAndfriendsPosts.push(mongoResponse[i])
        
                                }
        
                            }
        
                            // SEND USER OBJECT TO FRONTEND
                            res.status(200).send(myOwnAndfriendsPosts)
                
                        })
        
        
                    })


                }

            })
            
        }else if(likeUnlike == 'unlike'){
            
            postsCollection.findOneAndUpdate({"_id": ObjectID(postID)}, { $inc:{ "likes": -1 }, $pull:{ "likedBy" : req.id}   }, { returnOriginal: false }, (err, documentReturned)=>{

                if( documentReturned.ok == 1 ){

                    // PUSH ALL POSTS TO FRONTEND AGAIN 
                    userCollection.find({_id : ObjectID(req.id)}).toArray((err, mongoFriendsArray) => {
                    
                        let loggedInUsersFriends = []
        
                        for(let i = 0; mongoFriendsArray[0].friends.length > i; i++){
                            
                            loggedInUsersFriends.push(mongoFriendsArray[0].friends[i]._id.toString())
        
                        }

                                        
                        // GET USER OBJECT THOUGH DATA IN MONGO - {"author.author_id" : id}
                        postsCollection.find().toArray((err, mongoResponse) => {
        
                            let myOwnAndfriendsPosts = []
                
                            if(err){console.log('Couldnt get data from Mongo'); return; }
        
                            // ONLY GET POSTS FROM YOUR FRIENDLIST & YOUR OWN
                            for(let i = 0; mongoResponse.length > i; i++){
                            
                                if( loggedInUsersFriends.includes(mongoResponse[i].author.author_id) ||  mongoResponse[i].author.author_id == req.id){
        
                                    myOwnAndfriendsPosts.push(mongoResponse[i])
        
                                }
        
                            }
        
                            // SEND USER OBJECT TO FRONTEND
                            res.status(200).send(myOwnAndfriendsPosts)
                
                        })
        
                    })

                }

            })

        }

})

// ##################################################################################################
                                        // COMMENT ON POST -------- //
// ##################################################################################################


app.post("/postComment/:postID", isAuthendicated, (req, res) => {

    // GRAB POST ID
    let postID = req.params.postID.toString()
    let userID = req.id.toString()

    try{

        const form = formidable({multiples: true})

        form.parse(req, (err, fields, files) =>{

            let comment = {

               _id : new ObjectID(),
               "comment": fields.postComment,
               "likes":0,
               "likedBy":[],
               "author":{
                   _id: ObjectID(userID),
                   "firstName": req.firstName,
                   "lastName": req.lastName,
                   "profileImage": req.profileImage
               }

             }
    
            postsCollection.findOneAndUpdate({"_id": ObjectID(postID)}, { $push : { "comments": comment }  }, { returnOriginal: false }, (err, documentReturned)=>{
        
                res.send(comment)
        
            })
        })
              
    }catch(err){
        if(err){console.log("Error in postComment"); return; }
        console.log(err)
    }


})


// LIKE A COMMENT
app.post("/likeComment/:postID/:commentID", isAuthendicated, (req, res) => {

    let postID = req.params.postID
    let commentID = req.params.commentID

    // { $inc:{ "likes": 1 }, $push:{ "likedBy" : req.id}
    postsCollection.findOneAndUpdate({ "_id": ObjectID(postID), "comments._id": ObjectID(commentID) }, {$inc: { "comments.$.likes":+1 }, $push:{"comments.$.likedBy": req.id } }, { returnOriginal: false }, (err, documentReturned)=>{


        userCollection.find({_id : ObjectID(req.id)}).toArray((err, mongoFriendsArray) => {
                    
            let loggedInUsersFriends = []

            for(let i = 0; mongoFriendsArray[0].friends.length > i; i++){
                
                loggedInUsersFriends.push(mongoFriendsArray[0].friends[i]._id.toString())

            }

                            
            // GET USER OBJECT THOUGH DATA IN MONGO - {"author.author_id" : id}
            postsCollection.find().toArray((err, mongoResponse) => {

                let myOwnAndfriendsPosts = []
    
                if(err){console.log('Couldnt get data from Mongo'); return; }

                // ONLY GET POSTS FROM YOUR FRIENDLIST & YOUR OWN
                for(let i = 0; mongoResponse.length > i; i++){
                
                    if( loggedInUsersFriends.includes(mongoResponse[i].author.author_id) ||  mongoResponse[i].author.author_id == req.id){

                        myOwnAndfriendsPosts.push(mongoResponse[i])

                    }

                }

                // SEND USER OBJECT TO FRONTEND
                res.status(200).send(myOwnAndfriendsPosts)
    
            })

        })

    })

})


// UNLIKE A COMMENT
app.post("/unlikeComment/:postID/:commentID", isAuthendicated, (req, res) => {

    let postID = req.params.postID
    let commentID = req.params.commentID

    // { $inc:{ "likes": 1 }, $push:{ "likedBy" : req.id}
    postsCollection.findOneAndUpdate({ "_id": ObjectID(postID), "comments._id": ObjectID(commentID) }, {$inc: { "comments.$.likes":-1 }, $pull:{"comments.$.likedBy": req.id } }, { returnOriginal: false }, (err, documentReturned)=>{

        userCollection.find({_id : ObjectID(req.id)}).toArray((err, mongoFriendsArray) => {
                    
            let loggedInUsersFriends = []

            for(let i = 0; mongoFriendsArray[0].friends.length > i; i++){
                
                loggedInUsersFriends.push(mongoFriendsArray[0].friends[i]._id.toString())

            }

                            
            // GET USER OBJECT THOUGH DATA IN MONGO - {"author.author_id" : id}
            postsCollection.find().toArray((err, mongoResponse) => {

                let myOwnAndfriendsPosts = []
    
                if(err){console.log('Couldnt get data from Mongo'); return; }

                // ONLY GET POSTS FROM YOUR FRIENDLIST & YOUR OWN
                for(let i = 0; mongoResponse.length > i; i++){
                
                    if( loggedInUsersFriends.includes(mongoResponse[i].author.author_id) ||  mongoResponse[i].author.author_id == req.id){

                        myOwnAndfriendsPosts.push(mongoResponse[i])

                    }

                }

                // SEND USER OBJECT TO FRONTEND
                res.status(200).send(myOwnAndfriendsPosts)
    
            })

        })

    })

})


// DELETE A COMMENt
app.post("/deleteComment/:postID/:commentID", isAuthendicated, (req, res) => {

    let postID = req.params.postID
    let commentID = req.params.commentID

    postsCollection.findOneAndUpdate({ "_id": ObjectID(postID)}, { $pull:{"comments": { "_id" : ObjectID(commentID) } } }, { returnOriginal: false }, (err, documentReturned)=>{
        userCollection.find({_id : ObjectID(req.id)}).toArray((err, mongoFriendsArray) => {
                        
            let loggedInUsersFriends = []

            for(let i = 0; mongoFriendsArray[0].friends.length > i; i++){
                
                loggedInUsersFriends.push(mongoFriendsArray[0].friends[i]._id.toString())

            }
                            
            // GET USER OBJECT THOUGH DATA IN MONGO - {"author.author_id" : id}
            postsCollection.find().toArray((err, mongoResponse) => {

                let myOwnAndfriendsPosts = []

                if(err){console.log('Couldnt get data from Mongo'); return; }

                // ONLY GET POSTS FROM YOUR FRIENDLIST & YOUR OWN
                for(let i = 0; mongoResponse.length > i; i++){
                
                    if( loggedInUsersFriends.includes(mongoResponse[i].author.author_id) ||  mongoResponse[i].author.author_id == req.id){

                        myOwnAndfriendsPosts.push(mongoResponse[i])

                    }

                }

                // SEND USER OBJECT TO FRONTEND
                res.status(200).send(myOwnAndfriendsPosts)

            })

        })

    })

})



// ##################################################################################################
                                        // DELETE POST -------- //
// ##################################################################################################

// DELETE POST
app.delete("/posts/:postid", isAuthendicated, (req, res) => {

        let postID = req.params.postid

        try{

            postsCollection.deleteOne({"_id": ObjectID(postID), "author.author_id": req.id})

            // PUSH ALL POSTS TO FRONTEND AGAIN 
            userCollection.find({_id : ObjectID(req.id)}).toArray((err, mongoFriendsArray) => {

                let loggedInUsersFriends = []

                for(let i = 0; mongoFriendsArray[0].friends.length > i; i++){
                    
                    loggedInUsersFriends.push(mongoFriendsArray[0].friends[i]._id.toString())

                }

                                
                // GET USER OBJECT THOUGH DATA IN MONGO - {"author.author_id" : id}
                postsCollection.find().toArray((err, mongoResponse) => {

                    let myOwnAndfriendsPosts = []
        
                    if(err){console.log('Couldnt get data from Mongo'); return; }

                    // ONLY GET POSTS FROM YOUR FRIENDLIST & YOUR OWN
                    for(let i = 0; mongoResponse.length > i; i++){
                    
                        if( loggedInUsersFriends.includes(mongoResponse[i].author.author_id) ||  mongoResponse[i].author.author_id == req.id){

                            myOwnAndfriendsPosts.push(mongoResponse[i])

                        }

                    }

                    // SEND USER OBJECT TO FRONTEND
                    res.status(200).send(myOwnAndfriendsPosts)
        
                })

            })
            
        }catch(err){
            if(err){console.log("Could not delete post"); return; }
            console.log(err)
        }
})



// ##################################################################################################
                                        // ADD FRIEND -------- //
// ##################################################################################################

app.post("/sendFriendRequest", isAuthendicated, (req, res) => {

    // FORM PARSE - GET DATA FROM CREATE POST FORM(frontend)
    const form = formidable({multiples: true})

    form.parse(req, (err, fields, files) =>{

        let sentFriendRequestToUser = {_id: fields._id, firstName: fields.firstName, lastName: fields.lastName, profileImage: fields.profileImage, status: fields.status}

        let FriendRequest = {_id: req.id, "firstName": req.firstName, "lastName": req.lastName, "profileImage": req.profileImage, "status":0 }


        userCollection.find({"_id": ObjectID(sentFriendRequestToUser._id), "friendRequests._id": req.id}).toArray((err, response) => {


            if(response.length == 0 ){

                userCollection.findOneAndUpdate({ "_id": ObjectID(sentFriendRequestToUser._id) }, {$push : { "friendRequests":  FriendRequest }})
                res.send('Friend Request sent ')
                return;
            }

            res.send('FriendRequest already sent!')

        })

    })

})



app.post("/acceptFriend/:newFriendId", isAuthendicated, async (req, res) => {

    let user = await userCollection.findOne({"_id": ObjectID(req.id), "friendRequests._id": req.params.newFriendId})

    let myObject = {"_id": user._id, "firstName": user.firstName, "lastName": user.lastName, "profileImage": user.profileImage, "status": 0}

    userCollection.findOneAndUpdate({"_id": ObjectID(req.id)}, { $pull:{ "friendRequests" : { "_id": req.params.newFriendId}}  }, { returnOriginal: false }, (err, documentReturned)=>{


        userCollection.findOneAndUpdate({"_id": ObjectID(req.params.newFriendId)}, {$push : {"friends": myObject } }, { returnOriginal: false }, (err, friendData)=>{

            let newFriend = {"_id": friendData.value._id, "firstName": friendData.value.firstName, "lastName": friendData.value.lastName, "profileImage": friendData.value.profileImage, "status": 0}

            userCollection.findOneAndUpdate({"_id": ObjectID(req.id)} , {$push : {"friends": newFriend}})

            chatCollection.findOneAndUpdate({ "_id" : ObjectID(req.id) }, { $push : {"chats": { _id : new ObjectID(req.params.newFriendId), "chatsMessages": [] }} })
            chatCollection.findOneAndUpdate({ "_id" : ObjectID(req.params.newFriendId) }, { $push : {"chats": { _id : new ObjectID(req.id), "chatsMessages": [] }} })
        
            res.send({"status":1})
        })

    })

})



// DENY FRIEND REQUEST
app.post("/denyFriendRequest/:newFriendId", isAuthendicated, (req, res) => {

    userCollection.findOneAndUpdate({"_id": ObjectID(req.id)}, { $pull:{ "friendRequests" : { "_id": req.params.newFriendId}}  }, { returnOriginal: false }, (err, documentReturned)=>{

        res.send('DENY FRIEND REQUEST')

    })

})





// ##################################################################################################
                                        // CHAT -------- //
// ##################################################################################################


//////////////////// CREATE CHAT CONVERSATION  WITH  FRIEND, should be created at friend accept
// app.post("/chatConversation", isAuthendicated, (req, res) => {
 
//     let friendID = '5ec2b05f2e1e1f8501a6a586' // SHOULD BE DYNAMIC

//     chatCollection.findOneAndUpdate({ "_id" : ObjectID(req.id) }, { $push : {"chats": { _id : new ObjectID(friendID), "chatsMessages": [] }} })
//     chatCollection.findOneAndUpdate({ "_id" : ObjectID(friendID) }, { $push : {"chats": { _id : new ObjectID(req.id), "chatsMessages": [] }} })

// })



//////////////////// GET ALL MY CHATS
app.get("/chats", isAuthendicated, (req, res) => {

    chatCollection.find({_id : ObjectID(req.id)}).toArray((err, response)=>{

        res.send(response)
    })

})


//////////////////// ADD CHAT MESSAGE TO CONVERSATION
app.post("/addChatMessage/:friendID", isAuthendicated, (req, res) => {
    let friendID = req.params.friendID

    const form = formidable({multiples: true})

    form.parse(req, (err, fields, files) =>{

        let messageFromMe = {_id: new ObjectID(), "message": fields.chatMessage, "epoch": Date.now(), "isMeTheSender": true }
        let messageToFriend = {_id: new ObjectID(), "message": fields.chatMessage, "epoch": Date.now(), "isMeTheSender": false}
    
        chatCollection.findOneAndUpdate({ "_id" : ObjectID(req.id), "chats._id": ObjectID(friendID) }, { $push : {"chats.$.chatsMessages": messageFromMe }})
        chatCollection.findOneAndUpdate({ "_id" : ObjectID(friendID), "chats._id": ObjectID(req.id) }, { $push : {"chats.$.chatsMessages": messageToFriend }})
    

        // RETURN CHAT OBJECT
        chatCollection.find({_id : ObjectID(req.id)}).toArray((err, response)=>{

            res.send(response)
        })

    })

})




// ##################################################################################################
                                        // MIDDLEWARE -------- //
// ##################################################################################################



function isAuthendicated(req, res, next){

    //GET THE TOKEN FROM THE  REQUEST
    let theJWT = req.header('Authentication')

    // VERIFY TOKEN 
    jwt.verify(theJWT, 'the jwt secret key', function(err, decoded){

            if(err || decoded == undefined ){
                console.log('Error in JWT, authendication middleware');
                res.status(500).json({"error":"Couldn't verify"});
                return; 
            }

        req.id = decoded.id
        req.firstName = decoded.firstName
        req.lastName = decoded.lastName
        req.profileImage = decoded.profileImage
        next()

    })
   
}




// ##################################################################################################

// LISTEN TO PORT 80 (LOCALHOST)
app.listen("80", err =>{

    if(err){console.log('Server cannot listen...'); return; }
    console.log('Server is listening ...')

})

// CHECK IF ERROR,SO NOT CRASHING
process.on("uncaughtException", (err, data) => {

    // If i have an error
    if(err){console.log("Critical error, yet system keeps running")}
    return

})