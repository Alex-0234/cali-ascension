# Calisthenics-Ascension

A web-based, RPG-like tracker that combines ranks, leveling up, daily quests, and overall game-like features while focusing on actual, in-real-life progress in Calisthenics. 

The primary goal of this tracker is to ensure that the in-game stats accurately reflect real-world physical progress, provided it receives truthful input from the user.

## Live Demo

[Test the App Here](https://cali-ascension.vercel.app) (Temporary URL for testing purposes)

- Username: test
- Password: test

  **Note**: I am using a free instance type on Render for the backend. It might take a minute or so to inicialize.
  
## Core Mechanics

Unlike traditional RPGs, progression here is strictly tied to real-world calisthenics performance. 

* **Rating:** Rating (Elo) will show user consistency while Level will show actual exercise difficulty. Base rating is 100 and can drop to 0. 
* **Stats:** Stats are currently calculated based on the hardest skill achieved and the number of reps the user can perform. There is a cap of 12 reps, which signals it is time to move on to the next variation.
* **Skill Trees:** Skill trees visually map the progression of exercises and skills (e.g., Australian Pull-ups unlock Jackknife Pull-ups and Isometric Hold Pull-ups).
* **Progression:** Logging reps in advanced exercises cascades down the tree, automatically improving your proficiency score in the prerequisite, easier skills.
* **Levels:** Levels are calculated based on total reps and exercise difficulty (balancing is currently in progress).

## To-Do List
- [ ] Finish the cleanup / redesign.

## Technologies used

**Frontend**
- React (vite)
- Zustand

**Backend**
- Node.js & Express
- Bcrypt
- MongoDB
- Mongoose


## Project Background 

This is a personal project and serves as my introduction to React and React Flow. The development process is heavily "vibe-coded," as learning through building and iterating in this hands-on way saves a significant amount of time.
