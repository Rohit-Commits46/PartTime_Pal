const express=require('express');
const route=express.Router()
const {connectML}=require('../controllers/ml.js');
const {googleLoginJobSeeker,signinJobSeeker,userLogin}=require('../controllers/freelancerController.js');

route.post('/',connectML);
route.post('/auth/login',googleLoginJobSeeker);
route.post('/auth/signin',signinJobSeeker);
route.post('/auth/login/user',userLogin);


// router.post('/', connectML);

// export default route;

module.exports=route;