import Student from "../models/Student"
import * as Bcrypt from "bcrypt"
import { nextTick } from "process"
const LocalStrategy=require("passport-local").Strategy

function initialize(passport){
    const authenticateUser= async (rollno,password,done)=>{
        const student= await Student.findOne({rollno:rollno})
              try{
                if( await Bcrypt.compare(password,student.password)){
                    return done(null,student)
                }
                else{
                    return done(null,false,{message:"Password Incorrect"})
                }
            }
            catch(e){
                return done(e)
            
        }
    }
    passport.use(new LocalStrategy({usernameField:"rollno"},authenticateUser))
    passport.serializeUser((student,done)=>done(null,student.rollno))
    passport.deserializeUser((id,done)=>{ Student.findOne({rollno:id},(err,user)=>{
        done(err,user);
    })})
}
module.exports=initialize