# Restaurant Review Platform

IFN636 Assessment 1: a web platform where diners can search for restaurants
and leave ratings/reviews, and restaurant owners can manage their listing and
respond to feedback.


## Local setup

### Server
```bash
cd server
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev            # or: npm start
```

### Client
```bash
cd client
npm install
cp .env.example .env.local  
npm start