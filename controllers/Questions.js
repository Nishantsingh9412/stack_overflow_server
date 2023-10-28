import mongoose, { mongo }  from "mongoose";

import Questions from "../models/Questions.js";

export const AskQuestion = async (req,res) => {
    const postQuestionData = req.body;
    const postQuestion = new Questions(postQuestionData);
    try{
        await postQuestion.save();
        res.status(200).json("Posted a Question successfully");
    }catch(error){
        console.log(error);
        res.status(409).json("Couldn't post a new question ");
    }

}



export const getAllQuestions =  async (req,res) => {
    try{
        const questionList = await Questions.find();
        res.status(200).json(questionList);
    }catch(error){
        res.status(404).json({message:error.message}); 
    }
}

export const deleteQuestion = async(req,res) => {
    // req.params     ------>    ID URL From  
    const {id:_id} = req.params;    
    // Checking for Id coming from URL is valid or not 
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("question unavailable...");
      }
    try {
        // Find question's Id from Db and according to that send status
        await Questions.findByIdAndRemove( _id );
        res.status(200).json({message : "successfully deleted ..."});
    } catch (error) {
        res.status(404).json({message : error.message});
    }
}

export const voteQuestion = async (req,res) => {
    const {id : _id} = req.params;
    const {value , userId} = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("question unavailable...");
    }

    try {
        const question = await Questions.findById(_id);
        const Upindex = question.upVote.findIndex((id) => id === String(userId));
        const downIndex = question.downVote.findIndex((id) => id === String(userId));
        // Value from frontend we just destructured here 
        if(value === 'upVote'){
            // If you have already downVoted you have to remove your name from the downVote array
            if(downIndex !== -1){
                question.downVote = question.downVote.filter((id) => id !== String(userId))
            }
            // If you are a new Upvoter 
            if(Upindex === -1){  
                question.upVote.push(userId);
            }
            // Already upVoted and wants to be neutral removing name from upVote Array
            else{
                question.upVote = question.upVote.filter((id) => id !== String(userId));
            }
        }else if(value === 'downVote'){
            if(Upindex !== -1){
                question.upVote = question.upVote.filter((id) => id !== String(userId));
            }
            if(downIndex === -1){
                question.downVote.push(userId);
            }else{
                question.downVote = question.downVote.filter((id) => id !== String(userId));
            }
        }

        await Questions.findByIdAndUpdate(_id , question)
        res.status(200).json({message : "Voted Successfully"});
    } catch (error) {
        res.status(404).json({message: "id not found "});
    }
}