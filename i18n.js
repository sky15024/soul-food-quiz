window.__lang = (function() {
  try { return localStorage.getItem('quiz-lang') || 'zh-TW'; } catch(e) { return 'zh-TW'; }
})();

var _resultMeta = {
  hotpot: { image: 'images/result_hotpot.jpg', match1: 'tofu_pudding', match2: 'skewers', scores: { sweet: 20, spicy: 100, warm: 80, soph: 60, flex: 60 } },
  skewers: { image: 'images/result_skewers.jpg', match1: 'hotpot', match2: 'fried_chicken', scores: { sweet: 40, spicy: 60, warm: 80, soph: 40, flex: 100 } },
  fried_chicken: { image: 'images/result_fried_chicken.jpg', match1: 'skewers', match2: 'boba_tea', scores: { sweet: 40, spicy: 80, warm: 80, soph: 40, flex: 80 } },
  boba_tea: { image: 'images/result_boba_tea.jpg', match1: 'fried_chicken', match2: 'soup_dumpling', scores: { sweet: 100, spicy: 20, warm: 40, soph: 60, flex: 100 } },
  soup_dumpling: { image: 'images/result_soup_dumpling.jpg', match1: 'boba_tea', match2: 'beef_noodles', scores: { sweet: 40, spicy: 40, warm: 80, soph: 100, flex: 60 } },
  beef_noodles: { image: 'images/result_beef_noodles.jpg', match1: 'soup_dumpling', match2: 'braised_pork_rice', scores: { sweet: 40, spicy: 20, warm: 100, soph: 60, flex: 80 } },
  braised_pork_rice: { image: 'images/result_braised_pork_rice.jpg', match1: 'beef_noodles', match2: 'creme_brulee', scores: { sweet: 60, spicy: 40, warm: 80, soph: 80, flex: 80 } },
  creme_brulee: { image: 'images/result_creme_brulee.jpg', match1: 'braised_pork_rice', match2: 'coffee', scores: { sweet: 80, spicy: 20, warm: 60, soph: 100, flex: 40 } },
  coffee: { image: 'images/result_coffee.jpg', match1: 'creme_brulee', match2: 'tofu_pudding', scores: { sweet: 40, spicy: 20, warm: 60, soph: 100, flex: 40 } },
  tofu_pudding: { image: 'images/result_tofu_pudding.jpg', match1: 'coffee', match2: 'hotpot', scores: { sweet: 100, spicy: 20, warm: 80, soph: 60, flex: 60 } },
  fallback: { image: 'images/og-image.jpg', match1: 'boba_tea', match2: 'fried_chicken', scores: { sweet: 50, spicy: 50, warm: 50, soph: 50, flex: 50 } }
};

window.__i18n = {
  ui: {
    'zh-TW': {
      eyebrow:           '✦ 靈魂美食診斷系統 ✦',
      title:             '你的靈魂是哪種<br><span class="title-highlight">「美食」</span>？',
      subtitle:          '10 道直覺題目，測出你隱藏的性格特質與靈魂伴侶',
      btn_start:         '開始尋找我的靈魂美食',
      view_count_suffix: ' 人已測出自己的靈魂美食',
      quiz_masthead:     '🍲 靈魂美食診斷',
      q_count:           function(n, total) { return '第 ' + n + ' 題，共 ' + total + ' 題'; },
      btn_prev:          '◀ 上一題',
      result_label:      '你的靈魂美食是',
      match_label:       '你的完美對頻夥伴 🤝',
      share_prompt:      '📸 截圖分享，尋找你的靈魂美食伴侶！',
      btn_retry:         '🔄 重新品嚐一次',
      copy_toast:        '✓ 已複製連結！趕快分享給朋友吧！',
      share_text: function(res) {
        return '我的靈魂美食是「' + res.title + '」！\n' + res.subtitle + '\n\n你也來測測看你的靈魂是哪種美食吧：';
      },
    },
    'en': {
      eyebrow:           '✦ Soul Food Diagnostic System ✦',
      title:             'Which <span class="title-highlight">Gourmet Food</span><br>is Your Soul?',
      subtitle:          '10 intuition questions to reveal your personality and soulmate',
      btn_start:         'Find My Soul Food',
      view_count_suffix: ' people have found their soul food',
      quiz_masthead:     '🍲 Soul Food Diagnosis',
      q_count:           function(n, total) { return 'Q' + n + ' / ' + total; },
      btn_prev:          '◀ Back',
      result_label:      'Your Soul Food is',
      match_label:       'Your Perfect Matches 🤝',
      share_prompt:      '📸 Share and find your soul food partner!',
      btn_retry:         '🔄 Try Again',
      copy_toast:        '✓ Link copied! Share it with friends!',
      share_text: function(res) {
        return 'My soul food is "' + res.title + '"!\n' + res.subtitle + '\n\nFind out which food represents your soul here:';
      },
    },
  },
  questions: {
    'zh-TW': typeof questions !== 'undefined' ? questions : [],
    'en': [
      {
        text: 'At a party, do you usually hype up the crowd or eat quietly?',
        hint: 'Choose what fits your true state at gatherings',
        options: [
          { label: 'Definitely the hype master! Where I am, there is laughter.', scores: { hotpot: 3, fried_chicken: 3 } },
          { label: 'I drift between small groups and chat casually.', scores: { boba_tea: 3, skewers: 3 } },
          { label: 'A gentle listener, silently passing tissues and pouring water.', scores: { tofu_pudding: 3, beef_noodles: 2 } },
          { label: 'A quiet food-destroying machine, observing from the corner.', scores: { creme_brulee: 3, coffee: 3, braised_pork_rice: 3 } }
        ]
      },
      {
        text: 'When facing setbacks, what food do you crave first to heal yourself?',
        hint: 'What instantly restores your soul\'s HP?',
        options: [
          { label: 'Extremely spicy food to sweat it all out!', scores: { hotpot: 3 } },
          { label: 'Sweet, soft desserts to instantly heal my heart!', scores: { tofu_pudding: 3, creme_brulee: 3 } },
          { label: 'Greasy, high-calorie fried foods—forget the calories!', scores: { fried_chicken: 3, skewers: 3 } },
          { label: 'A warm, light bowl of soup or hot tea to soothe my soul.', scores: { beef_noodles: 3, coffee: 3, boba_tea: 1, soup_dumpling: 2 } }
        ]
      },
      {
        text: 'If you had to describe your first impression on others as a "temperature", it would be?',
        hint: 'How do others perceive your vibe?',
        options: [
          { label: 'Boiling 100°C: Passionate and warming everyone like the sun.', scores: { hotpot: 3, fried_chicken: 3 } },
          { label: 'Warm 37°C: Friendly, easygoing, and comfortable.', scores: { tofu_pudding: 3, beef_noodles: 2, braised_pork_rice: 2 } },
          { label: 'Cool or crisp on the outside: A bit mysterious, slow to warm up.', scores: { creme_brulee: 3, coffee: 3 } },
          { label: 'Adaptable room temp: Flexible and blends in anywhere.', scores: { boba_tea: 3, skewers: 3, soup_dumpling: 2 } }
        ]
      },
      {
        text: 'When a friend suddenly calls crying over a breakup, your first reaction is?',
        hint: 'How do you handle a friend\'s vulnerability?',
        options: [
          { label: '"Who bullied you?! Let\'s go eat and curse them out right now!"', scores: { hotpot: 3, fried_chicken: 3 } },
          { label: '"Don\'t cry, I\'m here. Let it all out, I\'ll always support you."', scores: { tofu_pudding: 3, beef_noodles: 3 } },
          { label: '"What happened? (Gently analyzes the situation rationally)"', scores: { coffee: 3, braised_pork_rice: 2 } },
          { label: '"I\'m treating you to late-night snacks! Let\'s eat first, talk later."', scores: { boba_tea: 3, skewers: 3, soup_dumpling: 2, creme_brulee: 2 } }
        ]
      },
      {
        text: 'When traveling, what is your itinerary planning style?',
        hint: 'Imagine your perfect vacation',
        options: [
          { label: 'Precision Master: Spreadsheets with exact times and famous spots.', scores: { coffee: 3, braised_pork_rice: 3 } },
          { label: 'Spontaneous Adventurer: Go with the flow, surprises are the best.', scores: { fried_chicken: 3, boba_tea: 3, skewers: 3 } },
          { label: 'Deep Experiencer: Stay at one or two quality places all day.', scores: { creme_brulee: 3, tofu_pudding: 3, beef_noodles: 2 } },
          { label: 'Local Foodie: Skip tourist spots, find hidden local gems.', scores: { soup_dumpling: 3, hotpot: 2, braised_pork_rice: 2 } }
        ]
      },
      {
        text: 'In a group project, what situation do you dislike the most?',
        hint: 'What is your pet peeve?',
        options: [
          { label: 'Dead silence where no one speaks and I have to break the ice.', scores: { hotpot: 3, fried_chicken: 3 } },
          { label: 'Sloppy work, lack of depth and detail to make things perfect.', scores: { braised_pork_rice: 3, coffee: 3 } },
          { label: 'Beating around the bush instead of speaking directly.', scores: { soup_dumpling: 3, creme_brulee: 3, beef_noodles: 2 } },
          { label: 'Ignored opinions or a vibe that is too tense and cold.', scores: { tofu_pudding: 3, boba_tea: 3, skewers: 3 } }
        ]
      },
      {
        text: 'When your room or desk gets messy, what is your attitude?',
        hint: 'Your true reaction to messiness?',
        options: [
          { label: 'Clean freak: I can\'t stand dirt and clean it up immediately.', scores: { coffee: 3, braised_pork_rice: 3, beef_noodles: 2 } },
          { label: 'Organized chaos: Looks messy, but I know exactly where things are.', scores: { soup_dumpling: 3, creme_brulee: 3 } },
          { label: 'Weekend purge: Ignore it during the week, clean it all on weekends.', scores: { fried_chicken: 3, tofu_pudding: 2 } },
          { label: 'Free spirit: Life is casual, a messy desk is a kind of beauty.', scores: { boba_tea: 3, hotpot: 3, skewers: 3 } }
        ]
      },
      {
        text: 'Walking down the street, a cute stray cat rubs against your leg. You?',
        hint: 'A moment of unexpected gentleness',
        options: [
          { label: 'Squeal with joy! Pet it enthusiastically and feed it treats.', scores: { fried_chicken: 3, hotpot: 3 } },
          { label: 'Smile warmly, gently stroke it, and feel deeply healed.', scores: { tofu_pudding: 3, beef_noodles: 3, braised_pork_rice: 2 } },
          { label: 'Observe from a distance, take a picture, quietly appreciating it.', scores: { coffee: 3, creme_brulee: 3 } },
          { label: 'Feel a connection, play with it, wondering if it\'s the local boss.', scores: { soup_dumpling: 3, boba_tea: 3, skewers: 3 } }
        ]
      },
      {
        text: 'When buying new clothes, which style do you usually choose?',
        hint: 'Your fashion reflects your inner self',
        options: [
          { label: 'Eye-catching and stylish, highly recognizable on the street.', scores: { hotpot: 3, fried_chicken: 3 } },
          { label: 'Simple, comfortable, and versatile—never goes out of style.', scores: { beef_noodles: 3, tofu_pudding: 3, braised_pork_rice: 3 } },
          { label: 'Unique, low-key niche brands with exquisite hidden details.', scores: { creme_brulee: 3, coffee: 3, soup_dumpling: 2 } },
          { label: 'Lively and varied, matching accessories to my mood.', scores: { boba_tea: 3, skewers: 3 } }
        ]
      },
      {
        text: 'If your soul had a magical talent, what would you wish for?',
        hint: 'Your deepest desire',
        options: [
          { label: '"Fire Magic" to ignite passion and courage, lighting up everyone.', scores: { hotpot: 3, fried_chicken: 3 } },
          { label: '"Gentle Holy Light" to heal all emotional wounds and bring peace.', scores: { tofu_pudding: 3, beef_noodles: 3, braised_pork_rice: 2 } },
          { label: '"Eye of Wisdom" to see the essence of things and foresee crises.', scores: { coffee: 3, creme_brulee: 3, soup_dumpling: 2 } },
          { label: '"Phantom Magic" to shapeshift and blend into any environment.', scores: { boba_tea: 3, skewers: 3 } }
        ]
      }
    ]
  },
  resultText: {
    'zh-TW': {
      hotpot: {
        title: '地獄麻辣鍋',
        subtitle: '外表熱情、直率、敢愛敢恨，脾氣上來也很驚人！',
        desc: '你是自帶氣場的發光體，有你在的地方絕對不會冷場。愛恨分明，對朋友無比義氣，但踩到你的底線絕對會被辣得哇哇叫！',
        match1_desc: '火爆與溫柔的絕妙互補，互相包容',
        match2_desc: '一個愛講一個愛聽，最棒的宵夜局'
      },
      skewers: {
        title: '深夜串燒',
        subtitle: '隨性自在，沒有距離感，是大家最放鬆的深夜傾聽者。',
        desc: '你總能給人一種安心放鬆的魔力。朋友都喜歡在深夜找你談心，因為你不帶偏見、隨性灑脫，是最棒的靈魂樹洞。',
        match1_desc: '能完美接住對方的熱情與脾氣',
        match2_desc: '延續快樂的頻率，嗨到半夜不無聊'
      },
      fried_chicken: {
        title: '香脆炸雞排',
        subtitle: '熱情大方，帶給身邊人無限歡樂，偶爾有點衝動小邪惡。',
        desc: '你是行走的快樂製造機！擁有讓人無法抗拒的魅力與活力。雖然有時候有點衝動，但大家都愛死你這種單純直率的個性。',
        match1_desc: '無負擔的快樂，懂彼此的隨性',
        match2_desc: '國民最強組合！一秒趕走所有憂鬱'
      },
      boba_tea: {
        title: '冰鎮珍珠奶茶',
        subtitle: '隨和多變，適應力強，能完美融入各種社交圈。',
        desc: '你像水一樣能適應任何容器，跟誰都能聊上兩句。總能用甜甜的微笑化解尷尬，是朋友圈裡不可或缺的潤滑劑。',
        match1_desc: '充滿默契的快樂泉源，無話不談',
        match2_desc: '能輕鬆破冰，引導對方展現豐富內心'
      },
      soup_dumpling: {
        title: '爆汁小籠包',
        subtitle: '外表低調精緻，內心戲超豐富，隱藏著驚人的爆發力。',
        desc: '不熟的時候覺得你客氣有禮貌，熟了之後才發現你根本是個寶藏！內心戲超多、幽默感十足，總能給人意外的驚喜。',
        match1_desc: '對方能懂自己的冷幽默與小巧思',
        match2_desc: '彼此信賴，能分享最深層的秘密'
      },
      beef_noodles: {
        title: '清燉牛肉麵',
        subtitle: '穩重、耐看、給人滿滿安全感，朋友眼中的神隊友。',
        desc: '你不愛出風頭，卻總在關鍵時刻穩住大局。待人真誠溫醇，是那種「認識越久，越覺得不能沒有你」的靠譜存在。',
        match1_desc: '溫醇踏實與內斂驚喜的完美組合',
        match2_desc: '懂彼此對「慢熬」與踏實的堅持'
      },
      braised_pork_rice: {
        title: '古早味秘製滷肉飯',
        subtitle: '充滿底蘊與職人精神，做事踏實，將平凡的事物做到極致完美。',
        desc: '你看似平凡低調，其實內心充滿堅持。對於熱愛的事物有著不妥協的職人精神，總能把簡單的生活過得充滿質感與深度。',
        match1_desc: '國民美食的好兄弟，互相理解與支持',
        match2_desc: '反差萌組合！共賞對「層次感」的講究'
      },
      creme_brulee: {
        title: '焦糖烤布蕾',
        subtitle: '外表帶有脆糖般的防衛感，熟了之後是個不折不扣的柔軟甜心。',
        desc: '你有著極高的品味與自我要求，一開始會豎起脆糖般的防禦心。但只要認定了對方，你就會展現出無比柔軟、甜蜜又細膩的一面。',
        match1_desc: '懂彼此堅硬平凡外表下的真材實料',
        match2_desc: '知性契合，靈魂共鳴的頂級下午茶'
      },
      coffee: {
        title: '特調精品咖啡',
        subtitle: '獨立有主見，熱愛思考，追求生活質感與個人空間。',
        desc: '你習慣與世界保持一點觀察的距離。思維清晰理性，品味出眾。雖然偶爾顯得孤高，但給出的建議總是無比精闢中肯。',
        match1_desc: '心有靈犀，最懂彼此沉靜的浪漫',
        match2_desc: '理性與感性的交融，苦甜平衡的知己'
      },
      tofu_pudding: {
        title: '黑糖鮮奶豆花',
        subtitle: '療癒溫柔，心思細膩，是大家最信賴的心靈避風港。',
        desc: '你擁有極高的同理心，總能敏銳察覺他人的情緒需求。和你相處就像吃下一口滑嫩豆花，所有的煩躁與壓力都能瞬間被治癒。',
        match1_desc: '能給予對方最溫柔的情緒價值',
        match2_desc: '能降下對方的火氣，帶來內心的平靜'
      },
      fallback: {
        title: '神秘隱藏美食',
        subtitle: '你擁有無法被輕易定義的獨特靈魂。',
        desc: '你的靈魂充滿謎團與驚喜，無法被單一分類。',
        match1_desc: '完美的互補與包容',
        match2_desc: '最棒的相處頻率'
      }
    },
    'en': {
      hotpot: {
        title: 'Hell Spicy Hotpot',
        subtitle: 'Passionate, direct, and straightforward — with a shocking temper!',
        desc: 'You are the life of the party! You love fiercely and defend your friends, but cross your bottom line and you\'ll show your fiery side.',
        match1_desc: 'Fire and ice: perfect mutual tolerance.',
        match2_desc: 'One talks, one listens: best late-night duo.'
      },
      skewers: {
        title: 'Midnight Skewers',
        subtitle: 'Casual, easygoing, and everyone\'s favorite late-night listener.',
        desc: 'You have a relaxing magic. Friends love pouring their hearts out to you late at night because you are unprejudiced and chill.',
        match1_desc: 'Can perfectly handle their fiery passion.',
        match2_desc: 'Extends the joyful frequency late into the night.'
      },
      fried_chicken: {
        title: 'Crispy Fried Chicken',
        subtitle: 'Energetic and generous, bringing endless joy to everyone around.',
        desc: 'You are a walking joy machine! You have an irresistible charm and vitality. Though impulsive at times, everyone loves your straightforward nature.',
        match1_desc: 'Guilt-free joy and mutual understanding.',
        match2_desc: 'Ultimate combo! Banishes all blues instantly.'
      },
      boba_tea: {
        title: 'Iced Boba Milk Tea',
        subtitle: 'Adaptable and sociable, blending perfectly into any circle.',
        desc: 'You adapt to any container like water. You easily resolve awkwardness with a sweet smile and are the vital social glue among friends.',
        match1_desc: 'A fountain of shared joy and deep talks.',
        match2_desc: 'Easily breaks the ice to reveal their rich inner world.'
      },
      soup_dumpling: {
        title: 'Juicy Soup Dumpling',
        subtitle: 'Low-key outside, rich inside — hiding surprising explosive power.',
        desc: 'Polite at first, but a total treasure once known! You have a rich inner world, great humor, and always surprise people.',
        match1_desc: 'Understands your dry humor and clever details.',
        match2_desc: 'Deep trust to share the most profound secrets.'
      },
      beef_noodles: {
        title: 'Braised Beef Noodles',
        subtitle: 'Steady, reliable, and gives a full sense of security.',
        desc: 'You don\'t show off, but you stabilize the big picture. Sincere and warm, you are the reliable friend people realize they can\'t live without.',
        match1_desc: 'Perfect blend of steady warmth and hidden surprises.',
        match2_desc: 'Understands your persistence and slow-cooked dedication.'
      },
      braised_pork_rice: {
        title: 'Secret Braised Pork Rice',
        subtitle: 'Full of heritage and artisan spirit, perfecting the ordinary.',
        desc: 'Seemingly ordinary but full of depth. You have an uncompromising artisan spirit for what you love, turning simple life into something profound.',
        match1_desc: 'Good brothers in comfort food, mutual support.',
        match2_desc: 'Contrasting duo! Shared appreciation for exquisite layers.'
      },
      creme_brulee: {
        title: 'Crème Brûlée',
        subtitle: 'Guarded like a crisp sugar shell, but incredibly soft inside.',
        desc: 'You have high standards and a defensive exterior at first. But once you trust someone, you reveal your incredibly soft, sweet, and delicate side.',
        match1_desc: 'Understands the true substance beneath your shell.',
        match2_desc: 'Intellectual synergy, a top-tier soulmate pairing.'
      },
      coffee: {
        title: 'Craft Coffee',
        subtitle: 'Independent thinker, pursuing quality and personal space.',
        desc: 'You keep an observational distance from the world. Clear, rational, and tasteful. Though sometimes aloof, your advice is always incredibly insightful.',
        match1_desc: 'Soulmates who understand the romance of silence.',
        match2_desc: 'Blend of reason and emotion, a bittersweet confidant.'
      },
      tofu_pudding: {
        title: 'Brown Sugar Tofu Pudding',
        subtitle: 'Healing, gentle, and the most trusted emotional safe haven.',
        desc: 'You have extreme empathy and acutely sense others\' needs. Being with you is like eating soft pudding—all stress and irritability are instantly healed.',
        match1_desc: 'Provides you with the gentlest emotional value.',
        match2_desc: 'Cools their fire and brings inner peace.'
      },
      fallback: {
        title: 'Mystery Gourmet',
        subtitle: 'You have a unique soul that cannot be easily defined.',
        desc: 'Your soul is full of mysteries and surprises, impossible to categorize.',
        match1_desc: 'Perfect mutual tolerance.',
        match2_desc: 'Best compatibility frequency.'
      }
    }
  }
};

window.setLanguage = function(lang) {
  if (!window.__i18n.ui[lang]) return;
  window.__lang = lang;
  try { localStorage.setItem('quiz-lang', lang); } catch(e) {}

  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  var ui = window.__i18n.ui[lang];

  ['title', 'subtitle'].forEach(function(key) {
    var el = document.querySelector('[data-i18n="' + key + '"]');
    if (el) el.innerHTML = ui[key];
  });

  ['eyebrow','quiz_masthead','btn_prev','result_label','share_prompt','btn_retry',
   'btn_start','view_count_suffix', 'match_label'].forEach(function(key) {
    document.querySelectorAll('[data-i18n="' + key + '"]').forEach(function(el) {
      el.textContent = ui[key];
    });
  });

  var quizActive   = document.getElementById('screen-quiz')?.classList.contains('active');
  var resultActive = document.getElementById('screen-result')?.classList.contains('active');

  if (quizActive && typeof renderQuestion === 'function') {
    renderQuestion(typeof currentQ !== 'undefined' ? currentQ : 0);
  }
  if (resultActive && window.__pendingResultKey && typeof renderResult === 'function') {
    renderResult(window.__getResult(window.__pendingResultKey));
  }
};

window.__getResult = function(key) {
  var meta = _resultMeta[key] || _resultMeta['fallback'];
  var text = (window.__i18n.resultText[window.__lang] || window.__i18n.resultText['zh-TW'])[key]
          || window.__i18n.resultText['zh-TW']['fallback'];
  return Object.assign({}, meta, text, { __key: key });
};
