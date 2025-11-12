type Options = {
  initialDelay?: number;
  interval?: number;
  colorize?: boolean;
};

export function runFishEasterEgg({
  initialDelay = 1000,
  interval = 400,
  colorize = true,
}: Options = {}) {
  const lines = [
    "          <°))))><     <°))))><        <°))))><     <°))))><",
    "     <°))))><       🐳       <°))))><        🐋",
    "  <°))))><       <°))))><       <°))))><",
    "                    🐡  🐟  🐠  🐡  🦈",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "           🐠   WELCOME TO FISH MARKET   🐠",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "",
    "🐳 해적팀이 만든 물고기마켓입니다!",
    "🎣 우리를 낚아주세요! 🌊",
    "💻 팀원 GitHub",
    "-------------------- FrontEnd --------------------",
    "🦈 이상민 → https://github.com/qwezxc3810",
    "🐟 김예슬1 → https://github.com/keemessle",
    "🐠 김예슬2 → https://github.com/yeaseula",
    "",
    "-------------------- BackEnd --------------------",
    "🐋 천수겸 → https://github.com/nockbeet",
    "",
    "📫 문의: 이메일? 전화번호?",
    "#물고기마켓 #FishMarket #Frontend #Backend #Bootcamp #EasterEgg",
    "",
    "🪼 재밌게 꼼꼼하게 봐주세요~ 🪼",
  ];

  const blueTones = [
    "#1E90FF",
    "#00BFFF",
    "#5DADE2",
    "#87CEFA",
    "#4682B4",
    "#82CAFA",
    "#6EC6FF",
  ];

  setTimeout(() => {
    lines.forEach((line, i) => {
      setTimeout(() => {
        if (colorize) {
          const color = blueTones[Math.floor(Math.random() * blueTones.length)];
          console.log("%c" + line, `color:${color}; font-weight:bold;`);
        } else {
          console.log(line);
        }
      }, i * interval);
    });
  }, initialDelay);
}
