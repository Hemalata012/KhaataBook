const express = require('express');
const router = express.Router() ;
const { createHisaabController ,hisaabPageController ,readHisaabController  , readVerifiedHisaabController
   ,deleteHisaabController ,editHisaabController ,editHisaabPostController } = require('../controllers/hisaab-controller');



  const {
    isLoggedIn , redirectIfLoggedIn
} =  require("../middlewares/auth-middlewares");
 

router.get("/create" , isLoggedIn , hisaabPageController);
 router.post("/create" ,  isLoggedIn , createHisaabController) ;
 router.get("/view/:id" ,isLoggedIn, readHisaabController);
 router.get("/delete/:id" , isLoggedIn , deleteHisaabController )
 router.get("/edit/:id" , isLoggedIn , editHisaabController)
 router.post("/edit/:id" , isLoggedIn , editHisaabPostController)
 router.post("/verify/:id" , isLoggedIn ,  readVerifiedHisaabController);

 
module.exports = router ;    