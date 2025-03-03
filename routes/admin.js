const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../index')
const {Admin, Course} = require('../db')
// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    const existinguser = await Admin.findOne({username})
    if(!existinguser){
        Admin.create({
            username: username,
            password: password
        })
        res.status(200).json({msg:"Admin created successfully"})
    }else{
        res.status(500).json({msg : "error occured"})
    }
});

router.post('/signin', async(req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    const existinguser = await Admin.find({username,password});
    if(existinguser){
        const token = jwt.sign({username , JWT_SECRET})
        res.status(200).json({token})
    }else{
        res.status(411).json({msg: "incorrect email or password"})
    }
});

router.post('/courses', adminMiddleware, async(req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const price = req.body.price;
    const imageLink = req.body.imageLink;
    const description = req.body.description;
    const newCourse = await Course.create({
        title:title,
        price: price,
        imageLink: imageLink,
        description: description
    })
    if(newCourse){
        res.status(200).json({msg: "new course created "})
    }else{
        res.status(400).json({msg:"unable to create a new course"})
    }
});

router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
    const allCourses = Course.find({});
    if(allCourses){
        res.status(200).json({courses: allCourses});
    }
});

module.exports = router;