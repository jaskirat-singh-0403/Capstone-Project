import { validationResult } from "express-validator"
import { url } from "inspector"
import Student from "../models/Student"
import User from "../models/Student"
import { NodeMailer } from "../utils/nodeMailer"
import jwt = require("jsonwebtoken")
import * as Bcrypt from "bcrypt"
import { response } from "express"
const JWTENCRYPTKEY="ASDASFDADSDAS"
const path=require("path")
export class StudentController{
    static login(req,resp,next){
        const error=validationResult(req)
        const email=req.body.email
        const password=req.body.password
        if(!error.isEmpty()){
            const newError=new Error(error.array()[0].msg)
            next(newError)
            return;
        }
        const user= new User({
            email:email,
            password:password
        })
        user.save().then((user)=>{
            resp.send(user)
        }).catch(err=>{
            next(err)
        })
        /*const error= new Error("User doesn't exist");
        next(error);*/
    }
    static signUp(req,resp,next){
        const error=validationResult(req)
        const email=req.body.email
        const password=req.body.password
        const sname=req.body.sname
        const rollno=req.body.rollno
        const cname=req.body.cname
        const ccity= req.body.ccity
        const branch=req.body.branch
        const phno= req.body.phno
        if(!error.isEmpty()){
            const newError=new Error(error.array()[0].msg)
            next(newError)
            return;
        }
        const token=jwt.sign({email,sname,password,rollno,cname,ccity,branch,phno},JWTENCRYPTKEY,{expiresIn:"20m"})
        NodeMailer.sendEmail({to:[email],subject:"Authenticate your account to complete Sign Up",html:`<p>Click below link to verify your account:<br><center><a href=http://localhost:5000/api/user/verify?token=${token}>Verify</a></center><br>The above link is valid only for 20 minutes</p>`})
        resp.sendFile("D:/Capstone/StudentPanel/prompt3.html")
        /*const error= new Error("User doesn't exist");
        next(error);*/
    }
    static forgot(req,resp,next){
        const token=req.query.token
        jwt.verify(token,JWTENCRYPTKEY,function(err,decoded){
            if(err){
                next(new Error("Incorrect or Expired Token"))
            }
            Student.findOne({email:decoded.email,rollno:decoded.rollno}).then((user)=>{
                if(user){
                    resp.sendFile(`/api/user/getreset?${token}`)
                }
            })
        })        
    }
    static reset(req,resp,next){
        const token=req.body.tok
        jwt.verify(token,JWTENCRYPTKEY,function(err,decoded){
            if(err){
                next(new Error("Incorrect or Expired Token"))
            }
        const rollno=decoded.rollno
        const email=decoded.email
        const password=req.body.password
           Student.findOne({email:email,rollno:rollno},(err,user)=>{
               if(!user){
                   resp.send("Failure")
               }
               Bcrypt.hash(password,10,(err,hash)=>{
                if(err){
                    next(new Error("Hashing Failed"))
                }
                user.password=hash
                user.save() 
            })
                resp.sendFile(`D:/Capstone/StudentPanel/forgotprompt2.html`)

           })
        })
    }
    static verify(req,resp,next){
        const token=req.query.token
        jwt.verify(token,JWTENCRYPTKEY,function(err,decoded){
            if(err){
                next(new Error("Incorrect or Expired Token"))
            }
            Bcrypt.hash(decoded.password,10,(err,hash)=>{
                if(err){
                    next(new Error("Hashing Failed"))
                }
                const stu= new Student({
                    email:decoded.email,
                    password:hash,
                    sname:decoded.sname,
                    cname:decoded.cname,
                    ccity:decoded.ccity,
                    branch:decoded.branch,
                    phno:decoded.phno,
                    rollno:decoded.rollno,
                    trainLetter:"",
                    Fee:""
                })
                stu.save().then((stu)=>{
                    
                    resp.sendFile("D:/Capstone/StudentPanel/StudentLogin.html")
                }).catch(err=>{
                    next(err)
                })

            })
            
        })
    }
    static Check(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect("/api/user/studentlogin")
    }
    static notCheck(req,res,next){
        if(!req.isAuthenticated()){
            return next()       
        }
        res.redirect("/api/user/home2")
    }
    static home(req,res,next){
        res.sendFile("D:/Capstone/MainPage/FirstPage.html")
    }
    static studentpanel(req,res,next){
        res.sendFile("D:/Capstone/StudentPanel/StudentLogin.html")
    }
    static facultypanel(req,res,next){
        res.sendFile("D:/Capstone/MainPage/FirstPage.html")
    }
    static adminpanel(req,res,next){
        res.sendFile("D:/Capstone/MainPage/FirstPage.html")
    }
    static sturegister(req,res,next){
        res.sendFile("D:/Capstone/StudentPanel/Register.html")
    }
    static chpwd(req,res,next){
        res.render("D:/Capstone/StudentPanel/phase2-password.html",{passmatch:0})
    }
    static getreset(req,resp,next){
        const token=req.query.token
        resp.render(`D:/Capstone/StudentPanel/reset.html`,{tok:token})
    }
    static stforget(req,resp,next){
        resp.sendFile("D:/Capstone/StudentPanel/Forgot.html")
    }
    static stuforget(req,res,next){
        const rollno=req.body.rollno;
        Student.findOne({rollno:rollno}).then(user=>{
            if(user){
                const email=user.email;
                const token=jwt.sign({email,rollno},JWTENCRYPTKEY,{expiresIn:"20m"})
                NodeMailer.sendEmail({to:[String(email)],subject:"Reset Password",html:`<p>Click below link to reset your password:<br><center><a href=http://localhost:5000/api/user/getreset?token=${token}>Reset</a></center><br>The above link is valid only for 20 minutes</p>`})
                res.sendFile("D:/Capstone/StudentPanel/forgotprompt1.html")
            }else{
                throw new Error("Something went Wrong")
            }
        })
    }
    static default(req,res,next){  
        res.sendFile("D:/Capstone/StudentPanel/Student2.html")

    }
    static async home2(req,res,next){
        if(req.user.verified!=true){
        var fileCheck
        if(req.user.trainLetter=="" && req.user.Fee=="" )
        {
             fileCheck={trainLetter:false,Fee:false}
        }
        else if(req.user.trainLetter!="" && req.user.Fee=="" )
        {
             fileCheck={trainLetter:true,Fee:false}
        }
        else if(req.user.trainLetter=="" && req.user.Fee!="" )
        {
             fileCheck={trainLetter:false,Fee:true}
        }
        else if(req.user.trainLetter!="" && req.user.Fee!="" )
        {
             fileCheck={trainLetter:true,Fee:true}
        }
        res.render("D:/Capstone/StudentPanel/Page1.html",fileCheck)
    }
    else{
        
            Student.findOne({rollno:req.user.rollno}).then((user)=>{
                console.log(user)
                const email= user.Mentor_email;

              
     
              res.render("D:/Capstone/StudentPanel/phase2.html",{email:email}) 
            })            
           

    }
    }
    static upload1(req,resp,next){
        if (!req.files) {
            return resp.status(400).send("No files were uploaded.");
          }
          const allowedExtension = ['.pdf'];
          
        
          const file = req.files.trainLetter;
          const path1 = __dirname + "/files/trainLetter/" +req.user.rollno+"/"+ file.name;
          const extensionName = path.extname(file.name); //
          if(!allowedExtension.includes(extensionName)){
              return resp.status(422).send("Invalid File Extension");
          }
          file.mv(path1, (err) => {
            if (err) {
              return resp.status(500).send(err);
            }
            Student.findOne({rollno:req.user.rollno}).then(user=>{
                user.trainLetter=path1
                user.save().then(function(){
                    resp.redirect("/api/user/home2")
                })
            })
            
          });
    }
    static upload2(req,resp,next){
        if (!req.files) {
            return resp.status(400).send("No files were uploaded.");
          }
          const allowedExtension = ['.pdf'];
          
        
          const file = req.files.fee;
          const path1 = __dirname + "/files/Fee/" +req.user.rollno+"/"+ file.name;
          const extensionName = path.extname(file.name); //

          if(!allowedExtension.includes(extensionName)){
              return resp.status(422).send("Invalid File Extension");
          }
          file.mv(path1, (err) => {
            if (err) {
              return resp.status(500).send(err);
            }
            Student.findOne({rollno:req.user.rollno}).then(user=>{
                user.Fee=path1
                user.save().then(function (){
                    resp.redirect("/api/user/home2")
                })
                
            })
          });
    }
    static info(req,resp,next){
        const arrange=req.body.arrange;
        const mentor=req.body.mentor;
        const memail=req.body.memail;
        const stipend=req.body.stipend;
        const mphno=req.body.mphno;
        const sno=req.body.sno;
        const city=req.body.city1;
        const country=req.body.country;
        const ccountry=req.body.ccountry;
        const compaddr=req.body.compaddr.concat(" ",req.body.landmark);
        Student.findOne({rollno:req.user.rollno}).then(user=>{
            user.Arranged_by=arrange;
            user.Mentor_name=mentor;
            user.Mentor_email=memail;
            user.Stipend=stipend;
            user.Mentor_Contact=mphno;
            user.ccity=city;
            user.Address=compaddr;
            if(user.phno!=sno){
                user.phno=sno;
            }
            if(country=="India"){
                user.Country=country;
            }
            else{
                user.Country=ccountry;
            }
            user.save().then(()=>{
                resp.render("D:/Capstone/StudentPanel/phase2.html",user)
            });
        })
    }
    static async passupdate(req,resp,next){
        const oldpass=req.body.oldpassword;
        const newpass=req.body.password;
        const cpass=req.body.password2;
        if(await Bcrypt.compare(oldpass,req.user.password)){
            Student.findOne({rollno:req.user.rollno}).then((user)=>{
                Bcrypt.hash(newpass,10,(err,hash)=>{
                    if(err){
                        next(new Error("Hashing Failed"))
                    }
                    user.password=hash;
                    user.save().then(()=>{
                        resp.render("D:/Capstone/StudentPanel/phase2-password.html",{passmatch:1})
                    })
                })
            })
        }
        else{
            resp.render("D:/Capstone/StudentPanel/phase2-password.html",{passmatch:2})
        }
    }
    static uploads1(req,res,next){
        
    }
    
    
}