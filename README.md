# Word Anchor

Anchor every new word to your long-term memory.

## About

Word Anchor is a vocabulary flashcard app where you save words you encounter, review them as animated swipeable cards, and track your progress by marking words as mastered or favourite.

## Problem it solves

When learning a language or expanding vocabulary, words learned passively are quickly forgotten. Word Anchor gives you a personal, distraction-free space to capture words the moment you meet them and revisit them regularly — so they actually stick.

## Getting started

```bash
# 1. Clone the repo
git clone https://github.com/your-username/word-anchor.git
cd word-anchor

# 2. Install dependencies
npm install

# 3. Add environment variables
cp .env.example .env   # then fill in DATABASE_URL, DIRECT_DATABASE_URL, SESSION_SECRET

# 4. Push the schema to your database
npx prisma db push

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).


