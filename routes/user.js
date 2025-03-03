const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {User, Course} = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../index");
// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    const existinguser = await findOne({username})
    if(!existinguser){
        User.create({username:username,password:password})
        res.status(200).json({msg: "created a user successfully"})
    }else{
        res.status(400).json({msg: "an error occured while creating an user"});
    }
});

router.post('/signin', async(req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    const findUser = await User.findOne({username, password});
    if(findUser){
        const token = jwt.sign({username ,JWT_SECRET});
        res.status(200).json({token});
    }else{
        res.status(411).json({msg: "incorrect email or password"})
    }
});

router.get('/courses', async(req, res) => {
    // Implement listing all courses logic
    const allCourses = await Course.find({});
    res.status(200).json({Courses : allCourses})
});

router.post('/courses/:courseId', userMiddleware, async(req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.headers.username;

    await User.updateOne({
        username:username
    },{
        "$push":{
            purchasedCourses: courseId
        }
    })
    res.json({msg: "Purchase complete"})
    

});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    const username = req.body.username;
    const user = await User.findOne({username});

    const courses =  await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }

    });
    res.json({courses: courses});

});

module.exports = router