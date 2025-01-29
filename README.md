# Cobra game 

*2025 degree project*

## Game link

https://cobra-game.vercel.app/

## The project description
For my degree project I wanted to create a nice and fun way for younger kids to be introduced to games and give a nostalgia trip to the older audience. And to do that I made the classic snake game with a little spin and called it Cobra with some extra gameplay features as well as a leaderboard to add some sort of competitiveness to it.


## Authors
- [@Pingis2](https://github.com/Pingis2)

## Project built with

*frontend*

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![cypress](https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e)
![Inkscape](https://img.shields.io/badge/Inkscape-e0e0e0?style=for-the-badge&logo=inkscape&logoColor=080A13)

*backend*

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

## Start project

*frontend*
```
npm i 
npm run dev
```

*backend*
```
npm i
npx nodemon start
```

(backend is not required to be running to test the app)

## Dependencies

*frontend*
```
axios
dotenv
i18next
i18next-browser-languagedetector
i18next-http-backend
jsonwebtoken
react
react-dom
react-i18next
react-router-dom
```

*backend*
```
axios
bcrypt
bcryptjs
cookie-parser
cors
debug
dotenv
express
jsonwebtoken
mongodb
morgan
nodemon
```

## Lessons learned
Before I started the project, I knew that the snake game logic would be the most difficult part of the whole project, since i've never done any sort of game like this before. So I was kind of winging it all, which by the end made the game work but needs improvements to make the game bug free. So I should've researched a bit more on how a proper snake game and game overall is created to make it as best as possible.
This was also my first time working with a backend on vercel, which I did prepare before the project period started, so I didn't have to deal with deployment issues while I was making the website.

## Current known bugs
- Mulitple inputs within the same frame: If a user does 2 different inputs at the same time or too fast, the snake dies, because the game counts it as 2 actions within the same frame. The reason why is happens is because the snake runs on the same tick rate as the game itself, to fix that I would need to seperate them so they have their own tick rate and I can control the speed seperatly.
- Score and time lost on first game: After a user plays the game for the first time of the session, the score and time will dissapear from the context after a few seconds, I'm not totally sure fow how long or why it happens, but I'm pretty sure it's only the first game that does that, every game after will save and display the score and time correctly.