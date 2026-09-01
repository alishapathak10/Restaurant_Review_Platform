# Restaurant Review Platform

IFN636 Assessment 1: a web platform where diners can search for restaurants
and leave ratings/reviews, and restaurant owners can manage their listing and
respond to feedback.

## Architecture

- **Client**: React single-page app (`/client`)
- **API Server**: Node.js + Express (`/server`)
- **Database**: MongoDB
- **Auth**: JWT issued on login/register, `bcryptjs` for password hashing,
  role-based (`diner` / `owner`) and resource ownership checks on
  restaurant/review-modifying routes 

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
```

## Known limitations

- No table booking/reservation feature.
- Search is a simple case-insensitive substring match, not fuzzy/full-text.
- The owner dashboard assumes one restaurant per owner for simplicity

## Deployment
