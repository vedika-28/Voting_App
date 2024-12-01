const express = require('express');
const router = express.Router();
const Candidate = require('./../models/candidate');
const {jwtAuthMiddleware,generateToken} = require('./../jwt');
const User = require('./../models/user');

const checkAdminRole = async (userID) => {
    try{
        const user = await User.findById(userID);
        if(user.role === 'admin'){
            return true;
        }
    }catch(err){
        return false;
    }
}


//Post route to add a candidate
router.post('/',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!await checkAdminRole(req.user.id)){
            return res.status(403).json({message: 'user does not have admin role'});
        }
        const data = req.body
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();
        console.log('data saved');
        res.status(200).json({response: response});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.put('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
try{
    if(!checkAdminRole(req.user.id)){
        return res.status(403).json({message: 'user has not admin role'});
    }
    const candidateID = req.params.candidateID;
    const updateCandidateData = req.body;

    const response = await Person.findByAndUpdate(candidateID,updateCandidateData,{
        new: true,
        runValidators: true,
    })

    if(!response){
        return res.status(404).json({error: `Candidate not found`});
    }
    console.log('candidate data updated');
    res.status(200).json(response);
    
}catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
}
})


router.delete('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
try{
    if(!checkAdminRole(req.user.id)){
        return res.status(403).json({message: 'user has not admin role'});
    }
    const candidateID = req.params.candidateID;

    if(!response){
        return res.status(404).json({error: `Candidate not found`});
    }
    console.log('candidate data updated');
    res.status(200).json(response);
    
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

//let's start voting
router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res)=>{
    // no admin can vote
    // user can only vote once
    
    candidateID = req.params.candidateID;
    userId = req.user.id;

    try{
        // Find the Candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'user not found' });
        }
        if(user.role == 'admin'){
            return res.status(403).json({ message: 'admin is not allowed'});
        }
        if(user.isVoted){
            return res.status(400).json({ message: 'You have already voted' });
        }

        // Update the Candidate document to record the vote
        candidate.votes.push({user: userId})
        candidate.voteCount++;
        await candidate.save();

        // update the user document
        user.isVoted = true
        await user.save();

        return res.status(200).json({ message: 'Vote recorded successfully' });
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});

//vote count 
router.get('/vote/count',async(req,res)=>{
    try{
        const candidate = await Candidate.find().sort({voteCount: 'desc'});
        const voteRecord = candidate.map((data)=>{
            return{
                party: data.party,
                count: data.voteCount
            }
        })
        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get('/',async(req,res)=>{
    try{
        const candidates = await Candidate.find({}, 'name party -_id');
        res.status(200).json(candidates);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
