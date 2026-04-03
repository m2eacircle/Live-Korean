# Live Korean — K-Drama Korean Learning App

A static PWA for learning Korean through YouTube Shorts from popular K-dramas.

## Structure

```
live-korean/
├── index.html                    ← Main page (Terms of Use + Drama selector)
├── css/style.css                 ← All styles
├── js/app.js                     ← Core JS (language, bookmarks, modals, i18n)
└── dramas/
    ├── guardian/
    │   ├── guardian-data.js      ← 30 expressions + video map
    │   ├── index.html            ← Episode selector
    │   ├── ep1.html … ep16.html  ← Expression cards per episode
    ├── glory/
    │   ├── glory-data.js
    │   ├── index.html
    │   └── ep1.html … ep16.html
    └── all-of-us-are-dead/
        ├── aouad-data.js
        ├── index.html
        └── ep1.html … ep12.html
```

## Adding YouTube Shorts

### Step 1 — Upload your Shorts to YouTube
Upload each Short and note its **video ID** (the part after `youtube.com/shorts/` or `?v=`).

### Step 2 — Edit the drama data file
Open `dramas/guardian/guardian-data.js` and find the `videos: {}` object at the bottom.

Add entries in this format:
```js
videos: {
  'ep1_1':  'VIDEO_ID_HERE',   // Episode 1, Expression #1 (살려주세요)
  'ep1_2':  'VIDEO_ID_HERE',   // Episode 1, Expression #2 (괜찮아요)
  'ep1_3':  'VIDEO_ID_HERE',   // Episode 1, Expression #3 (감사합니다)
  // ... up to ep1_30
  'ep2_1':  'VIDEO_ID_HERE',   // Episode 2, Expression #1
  // etc.
}
```

The key format is always: `'ep{episode}_{expression_id}'`

### Step 3 — Repeat for other dramas
Do the same in `glory-data.js` and `aouad-data.js`.

## The 30 Expressions (per drama, same set)

| # | Korean | English |
|---|--------|---------|
| 1 | 살려주세요 | Help me |
| 2 | 괜찮아요 | It's okay / I'm fine |
| 3 | 감사합니다 | Thank you |
| 4 | 미안해요 | I'm sorry |
| 5 | 어디 가세요? | Where are you going? |
| 6 | 이름이 뭐예요? | What's your name? |
| 7 | 처음이에요 | It's my first time |
| 8 | 몰라요 | I don't know |
| 9 | 맞아요 | That's right |
| 10 | 아니에요 | No / That's not it |
| 11 | 왜 그래요? | What's wrong? |
| 12 | 무슨 일이에요? | What happened? |
| 13 | 진짜요? | Really? |
| 14 | 여기 어디예요? | Where is this? |
| 15 | 기다려요 | Wait |
| 16 | 같이 가요 | Let's go together |
| 17 | 빨리 와요 | Come quickly |
| 18 | 조심하세요 | Be careful |
| 19 | 어떻게 해요? | What should I do? |
| 20 | 괜히 왔어요 | I came for nothing |
| 21 | 죽을 뻔했어요 | I almost died |
| 22 | 믿을 수 없어요 | I can't believe it |
| 23 | 이상해요 | It's strange |
| 24 | 느낌이 안 좋아요 | I have a bad feeling |
| 25 | 다 괜찮을 거예요 | Everything will be okay |
| 26 | 신경 쓰지 마세요 | Don't worry about it |
| 27 | 그런 거 아니에요 | It's not like that |
| 28 | 운명이에요 | It's fate |
| 29 | 기억이 안 나요 | I can't remember |
| 30 | 다시 말해 주세요 | Please say it again |

## Features

- ✅ Terms of Use overlay (EN/KO) — must agree before access
- ✅ EN/KO bilingual interface
- ✅ 3 K-dramas: Guardian (16 ep), The Glory (16 ep), All of Us Are Dead (12 ep)
- ✅ 30 expressions per episode
- ✅ YouTube Shorts embed modal (portrait/Shorts format)
- ✅ Bookmark system (per show, episode, expression)
- ✅ "Coming Soon" state for episodes without videos yet
- ✅ Responsive design for mobile & desktop
- ✅ K-pop/K-drama design theme: hot pink, violet, dark background

## Deployment

Drop the entire folder on Vercel or any static host. No build step needed.
