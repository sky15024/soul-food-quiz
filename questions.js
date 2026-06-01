const questions = [
  {
    text: '在聚會中，你通常是負責炒熱氣氛還是默默吃東西的人？',
    hint: '直覺選擇最符合你在聚會中的真實狀態',
    options: [
      { label: '絕對是熱場擔當！有我的地方就有笑聲', scores: { hotpot: 3, fried_chicken: 3 } },
      { label: '游移在各個小圈子間，隨性自在聊幾句', scores: { boba_tea: 3, skewers: 3 } },
      { label: '溫柔的聆聽者，默默遞紙巾倒水', scores: { tofu_pudding: 3, beef_noodles: 2 } },
      { label: '默默品味美食，在角落冷眼旁觀一切', scores: { creme_brulee: 3, coffee: 3, braised_pork_rice: 3 } }
    ]
  },
  {
    text: '當工作或生活中遇到挫折，你第一時間會想吃哪種食物來療癒自己？',
    hint: '哪種食物最能瞬間補滿你的靈魂血量？',
    options: [
      { label: '辣到流汗的極限美食，把壓力全部釋放出來！', scores: { hotpot: 3 } },
      { label: '甜滋滋、軟綿綿的甜點，瞬間補滿心靈血量！', scores: { tofu_pudding: 3, creme_brulee: 3 } },
      { label: '高油高鹽高熱量的邪惡炸物，管他什麼卡路里！', scores: { fried_chicken: 3, skewers: 3 } },
      { label: '一碗溫熱清爽的湯或熱茶，溫暖疲憊的心靈', scores: { beef_noodles: 3, coffee: 3, boba_tea: 1, soup_dumpling: 2 } }
    ]
  },
  {
    text: '如果要用一種「溫度」來形容你平常給別人的第一印象，那是？',
    hint: '別人眼中的你，通常是什麼溫度的？',
    options: [
      { label: '滾燙的 100°C：熱情奔放，像太陽一樣溫暖大家', scores: { hotpot: 3, fried_chicken: 3 } },
      { label: '溫暖的 37°C：親切好相處，沒有距離感的舒適感', scores: { tofu_pudding: 3, beef_noodles: 2, braised_pork_rice: 2 } },
      { label: '外表帶有防備的微涼或微脆：有點神祕、慢熱，帶有一絲孤傲', scores: { creme_brulee: 3, coffee: 3 } },
      { label: '隨性變化的常溫：適應力強，隨時能與任何人打成一片', scores: { boba_tea: 3, skewers: 3, soup_dumpling: 2 } }
    ]
  },
  {
    text: '當朋友突然打電話來向你哭訴失戀時，你的第一反應通常是？',
    hint: '面對朋友的脆弱，你會怎麼做？',
    options: [
      { label: '「可惡！是誰欺負你？我現在帶你去吃香喝辣，臭罵對方一頓！」', scores: { hotpot: 3, fried_chicken: 3 } },
      { label: '「先別哭，我陪著你。想哭就哭出來，不管怎樣我都在。」', scores: { tofu_pudding: 3, beef_noodles: 3 } },
      { label: '「發生什麼事了？（溫和地幫忙分析對方行為，理性找出盲點）」', scores: { coffee: 3, braised_pork_rice: 2 } },
      { label: '「這攤宵夜我請客，先吃點好吃的，等等慢慢說！」', scores: { boba_tea: 3, skewers: 3, soup_dumpling: 2, creme_brulee: 2 } }
    ]
  },
  {
    text: '旅行時，你的行程規劃風格最接近哪一種？',
    hint: '想像一下你的完美假期',
    options: [
      { label: '精準規劃大師：幾點幾分到哪裡、必吃排隊名店都用試算表排好', scores: { coffee: 3, braised_pork_rice: 3 } },
      { label: '隨性冒險家：只有大概方向，走到哪吃到哪，發現驚喜最有趣', scores: { fried_chicken: 3, boba_tea: 3, skewers: 3 } },
      { label: '深度體驗派：挑一兩個有質感的地方待一整天，享受慢節奏', scores: { creme_brulee: 3, tofu_pudding: 3, beef_noodles: 2 } },
      { label: '巷仔內老饕：不追求打卡名店，專門挖掘隱藏版地方小吃', scores: { soup_dumpling: 3, hotpot: 2, braised_pork_rice: 2 } }
    ]
  },
  {
    text: '在工作或小組合作中，你最不喜歡遇到哪種情況？',
    hint: '你的地雷是什麼？',
    options: [
      { label: '大家都不出聲、氣氛尷尬死沉，非得要我來開場', scores: { hotpot: 3, fried_chicken: 3 } },
      { label: '做事草率、缺乏底蘊與細節，無法將事物做到完美', scores: { braised_pork_rice: 3, coffee: 3 } },
      { label: '溝通時說話拐彎抹角，有話不直說，讓人猜得心好累', scores: { soup_dumpling: 3, creme_brulee: 3, beef_noodles: 2 } },
      { label: '意見被忽視，或者整個氛圍過於嚴肅緊繃、缺乏溫度', scores: { tofu_pudding: 3, boba_tea: 3, skewers: 3 } }
    ]
  },
  {
    text: '當你的房間或桌面變得很亂時，你的處理態度是？',
    hint: '面對雜亂，你的真實反應？',
    options: [
      { label: '乾淨強迫症：一有髒亂就渾身難受，立刻收拾得一塵不染', scores: { coffee: 3, braised_pork_rice: 3, beef_noodles: 2 } },
      { label: '亂中有序派：雖然看起來雜亂，但我其實都知道東西在哪裡', scores: { soup_dumpling: 3, creme_brulee: 3 } },
      { label: '假日一次清理：平時睜一隻眼閉一隻眼，積累到週末再一口氣大掃除', scores: { fried_chicken: 3, tofu_pudding: 2 } },
      { label: '隨心所欲派：生活隨性就好，桌子是用來放東西的，亂也是一種美', scores: { boba_tea: 3, hotpot: 3, skewers: 3 } }
    ]
  },
  {
    text: '走在路上，如果突然有一隻超可愛的流浪貓貼著你的腳撒嬌，你會？',
    hint: '這是不經意間展露的溫柔',
    options: [
      { label: '驚喜尖叫！蹲下來跟牠熱情互動，甚至掏出隨身肉泥餵牠', scores: { fried_chicken: 3, hotpot: 3 } },
      { label: '溫柔微笑，輕輕撫摸牠，內心被徹底療癒，默默看著牠很久', scores: { tofu_pudding: 3, beef_noodles: 3, braised_pork_rice: 2 } },
      { label: '保持距離觀察，拍張照片留念，靜靜欣賞這份美好', scores: { coffee: 3, creme_brulee: 3 } },
      { label: '覺得很有緣分，試著逗弄牠，並好奇牠是不是這附近的「地頭貓」', scores: { soup_dumpling: 3, boba_tea: 3, skewers: 3 } }
    ]
  },
  {
    text: '當你買了一件新衣服，你通常會選擇哪種款式？',
    hint: '穿搭風格能反映內心',
    options: [
      { label: '亮眼有型、設計感強烈，走在路上很有辨識度', scores: { hotpot: 3, fried_chicken: 3 } },
      { label: '簡約舒適、質感百搭，穿很多年都不會退流行', scores: { beef_noodles: 3, tofu_pudding: 3, braised_pork_rice: 3 } },
      { label: '獨特低調、小眾品牌，不喜歡跟別人撞衫，藏有精緻細節', scores: { creme_brulee: 3, coffee: 3, soup_dumpling: 2 } },
      { label: '活潑多變、百搭好穿，隨心情與場合搭配不同配件', scores: { boba_tea: 3, skewers: 3 } }
    ]
  },
  {
    text: '如果你的靈魂擁有一種魔法天賦，你希望是哪一種？',
    hint: '這代表了你最深層的渴望',
    options: [
      { label: '瞬間點燃熱情與勇氣的「火焰魔法」，照亮身邊所有人', scores: { hotpot: 3, fried_chicken: 3 } },
      { label: '能夠治癒一切心靈創傷的「溫柔聖光」，帶來平靜與安慰', scores: { tofu_pudding: 3, beef_noodles: 3, braised_pork_rice: 2 } },
      { label: '能夠看透事物本質、預知危機的「智慧之眼」，冷靜而睿智', scores: { coffee: 3, creme_brulee: 3, soup_dumpling: 2 } },
      { label: '能隨心所欲變形、融入任何環境的「幻影魔法」，自由自在', scores: { boba_tea: 3, skewers: 3 } }
    ]
  }
];
