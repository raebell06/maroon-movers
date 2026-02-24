import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

/* ===============
 SIGNUP BACKEND

 =================*/

 router.post("/register", async (req, res) => {
    const {firstname, lastname, password } = req.body;

    //validate fields

    if (!firstname || !lastname, password ) {
        return res.status(400).json({ error: "Please fill in all fileds."});
    }

    //AAMU email
    const email = '${firstname.tolowerCase()}.${lastname.toLowerCase()}@bulldogs.aamu.edu';

    try {
        //check if user has created an account before
        const [existingUser] = await db.query("SELECT * FROM users WHERE email =?", [email]);
        if (existingUser.length > 0){
            return res.status(400).json({ error: "User already exists."});

        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //insert new user
        await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", ['${firstname} ${lastname}',
            email,
            hashedPassword,
]);
        res.json({
            message: 'Account created successfully for ${email}',
            email,
        });

    } catch (err){
    console.error(err);
    res.status(500).json({error: "Server error" });

 }
});


/*===============================
LOGIN BACKEND
================================*/



router.post("/login", async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
    return res.status(400).json({error: "Please fill in both fields."});
    
    //vallidate AAMu email
    if (!/^[a-z]+\.[a-z]+@bulldogs\.aamu\.edu$/i.test(email)){
        return res.status(400).json({ error: "invalid email format. use firstname.lastname@bulldogs.aamu.edu"});

    }

    try{
        //find user by email
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0){
            return res.status(404).json({ error: "User not found."});
        }

        const user = rows[0];

        //compare passwords

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(401).json({ error: "Invalid credentials. "});

        }

        //generate JWT
        const token = jwt.sign({id: user.id, email: user.email }, process.env.JWT_SECRET, {expiresIn: "1d"});

        res.json({
            message: "Login successful",
            user: {id: user.id, email: user.email, name: user.name },
            token, 
        });
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error"});
    }

});

export default router;