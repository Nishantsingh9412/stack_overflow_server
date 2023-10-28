import mongoose from "mongoose";
import Questions from "../models/Questions.js";

export const postAnswer = async (req, res) => {
    const { id: _id } = req.params;
    const { noOfAnswers, answerBody, userAnswered , userId } = req.body;
    // const userId = req.userId;
    // console.log(req.body);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("question unavailable...");
    }
  
    updateNoOfQuestions(_id, noOfAnswers);
    try {
      const updatedQuestion = await Questions.findByIdAndUpdate(_id, {
        $addToSet: { answer: [{ answerBody, userAnswered, userId }] },
      });
      res.status(200).json(updatedQuestion);
    } catch (error) {
      res.status(400).json("error in updating");
    }
  };
  
  const updateNoOfQuestions = async (_id, noOfAnswers) => {
    try {
      await Questions.findByIdAndUpdate(_id, {
        $set: { noOfAnswers: noOfAnswers },
      });
    } catch (error) {
      console.log(error);
    }
  };

export const deleteAnswer = async (req,res) => {
    const  {id : _id} = req.params;         // renaming id to _id  and  req.params typically contains route parameters extracted from the URL
    const {answerId , noOfAnswers} = req.body; 

      // Checking for question 
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("question unavailable...");
    }
    
      // Checking for Answer 
    
    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(404).send('Answer Available ... ');
    } 

    updateNoOfQuestions(_id , noOfAnswers)

    try {
        await Questions.updateOne(
          {_id} , 
          // Pulls Element from an array that's Id is matched 
          {$pull : {'answer' : {_id : answerId}}}
        )
        res.status(200).json({message:"Successfully Deleted ...."})
    } catch (error) {
        res.status(405).json(error);
    }
    
  }