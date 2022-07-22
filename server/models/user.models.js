const mongoose = require("mongoose");
const bcyrpt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
    },
    email:{
        type: String,
        required: [true, "Email is required"],
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    dews:
        [{type: Schema.Types.ObjectId, ref: "Dews"}]
},{timestamps:true});

UserSchema.virtual("confirmPassword")
    .get(()=>this._confirmPassword)
    .set((value)=>this._confirmPassword = value);

    UserSchema.pre("validate", function(next){
        if(this.password !== this.confirmPassword){
            this.invalidate("confirmPassword", "Passwords must match")
            console.log("Passwords don't match")
        }
        next()
    })
    UserSchema.pre("save", function(next){
        console.log("in pre save");
            bcrypt.hash(this.password, 10)
                .then((hashedPassword)=>{
                    this.password = hashedPassword;
                    next();
                })
    })
module.exports = mongoose.model("User", UserSchema);
 