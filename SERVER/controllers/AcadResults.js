import express from 'express'
import {GoogleGenerativeAI} from '@google/generative-ai'
import mongoose from 'mongoose'
import { User } from '../Models/UserModel.js';
import { Trend } from '../Models/Trends.js';


const genAI = new GoogleGenerativeAI('api key baad mei daal dunga chinta na karooo');

async function fetchSkillTrendsFromGemini(skills) {
    try {
    
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
   
      const prompt = `
        Provide current academic and industry trends related to the following skills: ${skills.join(', ')}.
        Return the response ONLY as a valid JSON array with each item having these properties:
        - skill: The specific skill this trend relates to
        - title: A concise title of the trend
        - description: A brief description of what the trend is about
        - sources: An array of objects, each with 'name' and 'url' for reference sources
        
        Format example:
        [
          {
            "skill": "Machine Learning",
            "title": "Federated Learning",
            "description": "A technique that trains an algorithm across multiple devices holding local data samples without exchanging them.",
            "sources": [
              { "name": "Nature", "url": "https://www.nature.com/articles/s42256-021-00397-x" },
              { "name": "Google AI Blog", "url": "https://ai.googleblog.com/2017/04/federated-learning-collaborative.html" }
            ]
          }
        ]
      `;
      
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      
      // Parse the response text as JSON
      try {
       
        const textContent = response.text();
        const jsonMatch = textContent.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
         
          return JSON.parse(textContent);
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
       
        return skills.map(skill => ({
          skill,
          title: "Parsing Error",
          description: "Unable to retrieve trends due to an error in processing the AI response.",
          sources: []
        }));
      }
    } catch (error) {
      console.error('Error with Gemini API:', error);
      
     
      if (error.message && error.message.includes('not found')) {
        
        try {
          console.log("Trying fallback model...");
          const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
          
          const prompt = `
            Provide current academic and industry trends related to the following skills: ${skills.join(', ')}.
            Return the response ONLY as a valid JSON array with each item having these properties:
            - skill: The specific skill this trend relates to
            - title: A concise title of the trend
            - description: A brief description of what the trend is about
            - sources: An array of objects, each with 'name' and 'url' for reference sources
          `;
          
          const result = await fallbackModel.generateContent(prompt);
          const response = result.response;
          const textContent = response.text();
          const jsonMatch = textContent.match(/\[[\s\S]*\]/);
          
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          } else {
            return JSON.parse(textContent);
          }
        } catch (fallbackError) {
          console.error('Fallback model also failed:', fallbackError);
        }
      }
      
      
      return skills.map(skill => ({
        skill,
        title: "API Error",
        description: "Unable to retrieve trends due to an error with the AI service.",
        sources: []
      }));
    }
  }











export const storeSkills =async (req,res)=>{
    try {
        const {  skills } = req.body;
        const userId=await req.userId;
        
        
        if (!userId || !skills || !Array.isArray(skills) || skills.length === 0) {
          return res.status(400).json({ error: 'Invalid request. Please provide userId and skills array.' });
        }
        
        
        const userExists = await User.findById(userId);
        if (!userExists) {
          return res.status(404).json({ error: 'User not found.' });
        }
        
        
        const newTrend = new Trend({
          user: userId,
          skills: skills
        });
        
        await newTrend.save();
        
        res.status(201).json({ 
          message: 'Skills stored successfully',
          trend: newTrend
        });
      } catch (error) {
        console.error('Error storing skills:', error);
        res.status(500).json({ error: 'Server error while storing skills.' });
      }

}


export const trendById = async(req,res)=>{
    try {
        const { trendId } = req.params;
        
        
        const trend = await Trend.findById(trendId);
        if (!trend) {
          return res.status(404).json({ error: 'Trend not found.' });
        }
        
        
        const trendsData = await fetchSkillTrendsFromGemini(trend.skills);
        
        res.status(200).json({
          skills: trend.skills,
          trends: trendsData
        });
      } catch (error) {
        console.error('Error fetching trends:', error);
        res.status(500).json({ error: 'Server error while fetching trends.' });
      }
}

export const getTrends = async(req,res)=>{
    try {
        const skills = req.query.skills?.split(',') || [];
        
        if (skills.length === 0) {
          return res.status(400).json({ error: 'No skills provided. Use ?skills=skill1,skill2' });
        }
        
        
        const trendsData = await fetchSkillTrendsFromGemini(skills);
        
        res.status(200).json({
          skills: skills,
          trends: trendsData
        });
      } catch (error) {
        console.error('Error fetching trends:', error);
        res.status(500).json({ error: 'Server error while fetching trends.' });
      }
}


export const getModels = async()=>{
    try {
        
        const models = await genAI.listModels();
        res.status(200).json(models);
      } catch (error) {
        console.error('Error listing models:', error);
        res.status(500).json({ error: 'Error listing available models' });
      }
}
