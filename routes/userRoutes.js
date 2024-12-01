const express = require('express');
const router = express.Router();
const User = require('./../models/user.js');
const {jwtAuthMiddleware,generateToken} = require('./../jwt');

router.post('/signup',async(req,res)=>{
    try{
        const data = req.body
        // Check if there is already an admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }
        const newUser = new User(data);

        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        res.status(200).json({response: response,token: token});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.post('/login',async(req,res)=>{
    try{
        const {aadharCardNumber,password} = req.body;
        const user = await User.findOne({aadharCardNumber: aadharCardNumber});
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        const payload = {
            id: user.id
        }
        const token = generateToken(payload);
        res.json({token})
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.put('/profile/password',async(req,res)=>{
try{
    const userId = req.user;
    const{currentPassword, newPassword} = req.body;
    const user = await User.findById(userId);

    if( !(await user.comparePassword(password))){
        return res.status(401).json({error: 'Invalid username or password'});    
    }

    user.password = newPassword;
    await user.save();    

    console.log('password updated');
    res.status(200).json({message: 'Password updated'});

}catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
}
})

module.exports = router;
