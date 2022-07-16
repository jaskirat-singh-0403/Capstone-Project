import { model, Mongoose,Document } from "mongoose"

const mongoose=require("mongoose")

const StudentSchema=new mongoose.Schema({
    rollno:{type: String, required:true},
    branch:{type: String, required:true},
    sname:{type: String, required:true},
    created_at: {type:Date, required:true,default: new Date()},
    updated_at: {type:Date, required:true,default: new Date()},
    phno:{type: String, required:true},
    email:{type: String, required:true},
    cname:{type: String, required:true},
    ccity:{type: String, required:true},
    password:{type: String, required:true},
    verified:{type:Boolean,required:true,default:false},
    verification_time:{type:Date,required:true,default:Date.now()+60000},
    trainLetter:{type: String },
    Fee:{type: String},
    Arranged_by:{type:String},
    Mentor_name:{type:String},
    Mentor_email:{type:String},
    Stipend:{type:String},
    Mentor_Contact:{type:String},
    Cphno:{type:String},
    Country:{type:String},
    Address:{type:String}


})
export interface StudentDoc extends Document
{
    rollno:String,
    branch:String,
    sname:String,
    created_at: Date,
    updated_at: Date,
    phno:String,
    email: String,
    cname: String,
    ccity: String,
    password: string,
    verified:Boolean,
    verification_time:Date,
    trainLetter:String,
    Fee:String,
    Arranged_by:String,
    Mentor_name:String,
    Mentor_email:String,
    Stipend:String,
    Mentor_Contact:String,
    Cphno:String,
    Country:String,
    Address:String
}

export default model<StudentDoc>("Student",StudentSchema)