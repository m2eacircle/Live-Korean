/* ============================================================
   Live Korean — All of Us Are Dead (지금 우리 학교는)
   ============================================================ */

var AOUAD_DATA = {
  id: 'all-of-us-are-dead',
  titleEn: 'All of Us Are Dead',
  titleKr: '지금 우리 학교는',
  emoji: '🧟',
  totalEpisodes: 12,
  shortsPerEpisode: 30,
  genreEn: 'Zombie Thriller',
  genreKr: '좀비 스릴러',

  expressions: [
    { id:  1, korean: '살려주세요',        english: 'Help me',                    romanization: 'Saryeojuseyo' },
    { id:  2, korean: '괜찮아요',           english: "It's okay / I'm fine",       romanization: 'Gwaenchanhayo' },
    { id:  3, korean: '감사합니다',         english: 'Thank you',                  romanization: 'Gamsahamnida' },
    { id:  4, korean: '미안해요',           english: "I'm sorry",                  romanization: 'Mianhaeyo' },
    { id:  5, korean: '어디 가세요?',       english: 'Where are you going?',       romanization: 'Eodi gaseyo?' },
    { id:  6, korean: '이름이 뭐예요?',     english: "What's your name?",          romanization: 'Ireumi mwoyeyo?' },
    { id:  7, korean: '처음이에요',         english: "It's my first time",         romanization: 'Cheoeum-ieyo' },
    { id:  8, korean: '몰라요',             english: "I don't know",               romanization: 'Mollayo' },
    { id:  9, korean: '맞아요',             english: "That's right",               romanization: 'Majayo' },
    { id: 10, korean: '아니에요',           english: "No / That's not it",         romanization: 'Anieyo' },
    { id: 11, korean: '왜 그래요?',         english: "What's wrong?",              romanization: 'Wae geuraeyo?' },
    { id: 12, korean: '무슨 일이에요?',     english: 'What happened?',             romanization: 'Museun il-ieyo?' },
    { id: 13, korean: '진짜요?',            english: 'Really?',                    romanization: 'Jinjjayo?' },
    { id: 14, korean: '여기 어디예요?',     english: 'Where is this?',             romanization: 'Yeogi eodiyeyo?' },
    { id: 15, korean: '기다려요',           english: 'Wait',                       romanization: 'Gidaryeoyo' },
    { id: 16, korean: '같이 가요',          english: "Let's go together",          romanization: 'Gachi gayo' },
    { id: 17, korean: '빨리 와요',          english: 'Come quickly',               romanization: 'Ppalli wayo' },
    { id: 18, korean: '조심하세요',         english: 'Be careful',                 romanization: 'Josimhaseyo' },
    { id: 19, korean: '어떻게 해요?',       english: 'What should I do?',          romanization: 'Eotteoke haeyo?' },
    { id: 20, korean: '괜히 왔어요',        english: "I came for nothing",         romanization: 'Gwaenhi wasseoyo' },
    { id: 21, korean: '죽을 뻔했어요',      english: 'I almost died',              romanization: 'Jugeul ppeonhaesseoyo' },
    { id: 22, korean: '믿을 수 없어요',     english: "I can't believe it",         romanization: 'Mideul su eopseoyo' },
    { id: 23, korean: '이상해요',           english: "It's strange",               romanization: 'Isanghaeyo' },
    { id: 24, korean: '느낌이 안 좋아요',   english: 'I have a bad feeling',       romanization: 'Neukkimi an johayo' },
    { id: 25, korean: '다 괜찮을 거예요',   english: 'Everything will be okay',    romanization: 'Da gwaenchaneul geoyeyo' },
    { id: 26, korean: '신경 쓰지 마세요',   english: "Don't worry about it",       romanization: 'Singyeong sseuji maseyo' },
    { id: 27, korean: '그런 거 아니에요',   english: "It's not like that",         romanization: 'Geureon geo anieyo' },
    { id: 28, korean: '운명이에요',         english: "It's fate",                  romanization: 'Unmyeong-ieyo' },
    { id: 29, korean: '기억이 안 나요',     english: "I can't remember",           romanization: 'Gieogi an nayo' },
    { id: 30, korean: '다시 말해 주세요',   english: 'Please say it again',        romanization: 'Dasi malhae juseyo' },
  ],
  videos: {}
};

function getAouadVideo(episode, exprId) {
  var key = 'ep' + episode + '_' + exprId;
  return AOUAD_DATA.videos[key] || null;
}
