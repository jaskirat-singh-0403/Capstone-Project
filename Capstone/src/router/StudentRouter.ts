import { Router } from "express";
import passport = require("passport");
import { StudentController } from "../controllers/StudentControllers";
import { StudentValidators } from "../validators/StudentValidators";

class StudentRouter{
    public Router:Router;

    constructor(){
        this.Router=Router()
        this.getRoutes();
        this.patchRoutes();
        this.postRoutes();
        this.deleteRoutes();
    }
    getRoutes(){
        this.Router.get("/verify",StudentController.verify)
        this.Router.get("/home",StudentController.home)
        this.Router.get("/login",StudentController.default)
        this.Router.get("/studentLogin",StudentController.studentpanel)
        this.Router.get("/sturegister",StudentController.sturegister)
        this.Router.get("/stuforget",StudentController.stforget)
        this.Router.get("/home2",StudentController.Check,StudentController.home2)
        this.Router.get("/chpwd",StudentController.Check,StudentController.chpwd)
        this.Router.get("/getreset",StudentController.getreset) 
        
    }
    patchRoutes(){
    }
    postRoutes(){
        this.Router.post("/login",StudentController.notCheck,passport.authenticate("local",{
            successRedirect:"/api/user/home2",
            failureRedirect:"/api/user/login",
            failureFlash:true
        }));
        this.Router.post("/signup",StudentValidators.signUp(),StudentController.signUp);
        this.Router.post("/stuforget",StudentController.stuforget)
        this.Router.post("/reset",StudentController.reset)
        this.Router.post("/upload1",StudentController.upload1)
        this.Router.post("/upload2",StudentController.upload2)
        this.Router.post("/info",StudentController.Check,StudentController.info)
        this.Router.post("/info",StudentController.Check,StudentController.info)
        this.Router.post("/passupdate",StudentController.Check,StudentController.passupdate)


    }
    deleteRoutes(){
        this.Router.get('/logout', (req, res) => {
            req.logOut()
            res.redirect('/api/user/studentLogin')
          })
    }
}

export default new StudentRouter().Router;