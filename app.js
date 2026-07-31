// Application State
// ==========================================
const state = {
  currentView: 'portal', // portal, map, dashboard, quiz, result
  currentService: null,  // 'boki_tutorial', 'boki_shiwake'
  currentLevelId: null,  // 'lvl_0', 'lvl_1', etc.
  streak: 5,
  xp: 240,
  level: 2,
  hearts: 5,
  currentQuestionIndex: 0,
  selectedAnswer: null,
  answered: false,
  isCorrect: false,
  score: 0,
  firstTimeWrongCount: 0,
  activeQuestions: [],
  soundEnabled: true,
  debugMode: false,
  
  // 魔導ロードマップの進捗状況 (LocalStorageで永続化)
  roadmapProgress: {
    lvl_0: { unlocked: true, completed: false },
    lvl_1: { unlocked: true, completed: false }
  }
};

// ==========================================
// 簿記3級 勘定科目データ一覧 (57種類)
// ==========================================
const bokiAccounts = [
  // 資産 (借方)
  { name: '現金', category: '資産', side: 0 },
  { name: '普通預金', category: '資産', side: 0 },
  { name: '定期預金', category: '資産', side: 0 },
  { name: '当座預金', category: '資産', side: 0 },
  { name: '受取手形', category: '資産', side: 0 },
  { name: '電子記録債権', category: '資産', side: 0 },
  { name: '商品', category: '資産', side: 0 },
  { name: '売掛金', category: '資産', side: 0 },
  { name: 'クレジット売掛金', category: '資産', side: 0 },
  { name: '貸付金', category: '資産', side: 0 },
  { name: '手形貸付金', category: '資産', side: 0 },
  { name: '未収入金', category: '資産', side: 0 },
  { name: '前払金', category: '資産', side: 0 },
  { name: '仮払金', category: '資産', side: 0 },
  { name: '立替金', category: '資産', side: 0 },
  { name: '従業員立替金', category: '資産', side: 0 },
  { name: '受取商品券', category: '資産', side: 0 },
  { name: '差入保証金', category: '資産', side: 0 },
  { name: '建物', category: '資産', side: 0 },
  { name: '貯蔵品', category: '資産', side: 0 },
  { name: '土地', category: '資産', side: 0 },
  { name: '備品', category: '資産', side: 0 },
  { name: '車両運搬具', category: '資産', side: 0 },
  { name: '仮払法人税等', category: '資産', side: 0 },
  { name: '仮払消費税', category: '資産', side: 0 },
  { name: '前払費用', category: '資産', side: 0 },
  { name: '未収収益', category: '資産', side: 0 },

  // 負債 (貸方)
  { name: '買掛金', category: '負債', side: 1 },
  { name: '当座借越', category: '負債', side: 1 },
  { name: '借入金', category: '負債', side: 1 },
  { name: '支払手形', category: '負債', side: 1 },
  { name: '電子記録債務', category: '負債', side: 1 },
  { name: '手形借入金', category: '負債', side: 1 },
  { name: '未払金', category: '負債', side: 1 },
  { name: '前受金', category: '負債', side: 1 },
  { name: '仮受金', category: '負債', side: 1 },
  { name: '預り金', category: '負債', side: 1 },
  { name: '従業員預り金', category: '負債', side: 1 },
  { name: '所得税預り金', category: '負債', side: 1 },
  { name: '社会保険料預り金', category: '負債', side: 1 },
  { name: '未払配当金', category: '負債', side: 1 },
  { name: '未払法人税等', category: '負債', side: 1 },
  { name: '仮受消費税', category: '負債', side: 1 },
  { name: '未払消費税', category: '負債', side: 1 },
  { name: '未払費用', category: '負債', side: 1 },
  { name: '前受収益', category: '負債', side: 1 },

  // 純資産 (貸方)
  { name: '資本金', category: '純資産', side: 1 },
  { name: '資本準備金', category: '純資産', side: 1 },
  { name: '繰越利益剰余金', category: '純資産', side: 1 },

  // 費用 (借方)
  { name: '仕入', category: '費用', side: 0 },
  { name: '発送費', category: '費用', side: 0 },
  { name: '通信費', category: '費用', side: 0 },
  { name: '修繕費', category: '費用', side: 0 },
  { name: '支払保険料', category: '費用', side: 0 },
  { name: '広告費', category: '費用', side: 0 },
  { name: '支払手数料', category: '費用', side: 0 },
  { name: '支払利息', category: '費用', side: 0 },
  { name: '旅費交通費', category: '費用', side: 0 },
  { name: '給料', category: '費用', side: 0 },
  { name: '消耗品費', category: '費用', side: 0 },
  { name: '租税公課', category: '費用', side: 0 },
  { name: '法定福利費', category: '費用', side: 0 },
  { name: '貸倒損失', category: '費用', side: 0 },
  { name: '貸倒引当金繰入', category: '費用', side: 0 },
  { name: '減価償却費', category: '費用', side: 0 },
  { name: '固定資産売却損', category: '費用', side: 0 },
  { name: '支払家賃', category: '費用', side: 0 },
  { name: '法人税等', category: '費用', side: 0 },

  // 収益 (貸方)
  { name: '商品売買益', category: '収益', side: 1 },
  { name: '売上', category: '収益', side: 1 },
  { name: '受取利息', category: '収益', side: 1 },
  { name: '貸倒引当金戻入', category: '収益', side: 1 },
  { name: '償却債権取立益', category: '収益', side: 1 },
  { name: '固定資産売却益', category: '収益', side: 1 },
  { name: '受取地代', category: '収益', side: 1 },

  // 評価勘定 (貸方)
  { name: '貸倒引当金', category: '評価勘定', side: 1 },
  { name: '減価償却累計額', category: '評価勘定', side: 1 }
];

// ==========================================
// SM-2 Spaced Repetition Engine
// ==========================================
const getSM2Key = (question) => {
  return question.type === 'tutorial' ? question.text : question.text.substring(0, 30);
};

const loadSM2Data = () => {
  try {
    const raw = localStorage.getItem('qlearn_sm2_boki');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to load SM-2 data', e);
    return {};
  }
};

const saveSM2Data = (data) => {
  try {
    localStorage.setItem('qlearn_sm2_boki', JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save SM-2 data', e);
  }
};

const updateSM2 = (question, isCorrect) => {
  const data = loadSM2Data();
  const key = getSM2Key(question);
  
  const record = data[key] || {
    repetitions: 0,
    easiness: 2.5,
    interval: 0,
    lastLearned: Date.now()
  };
  
  const q = isCorrect ? 5 : 1;
  
  if (q < 3) {
    record.repetitions = 0;
    record.interval = 1;
  } else {
    if (record.repetitions === 0) {
      record.interval = 1;
    } else if (record.repetitions === 1) {
      record.interval = 6;
    } else {
      record.interval = Math.round(record.interval * record.easiness);
    }
    record.repetitions += 1;
  }
  
  record.easiness = record.easiness + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (record.easiness < 1.3) {
    record.easiness = 1.3;
  }
  
  record.lastLearned = Date.now();
  data[key] = record;
  saveSM2Data(data);
};

const sortQuestionsBySM2 = (questions) => {
  const sm2Data = loadSM2Data();
  
  const scoredQuestions = questions.map(q => {
    const key = getSM2Key(q);
    const record = sm2Data[key];
    
    let score = 0;
    
    if (!record) {
      score = 50;
    } else {
      const nextReviewDate = record.lastLearned + (record.interval * 24 * 60 * 60 * 1000);
      const timeRemaining = nextReviewDate - Date.now();
      
      if (timeRemaining <= 0) {
        const daysOverdue = Math.abs(timeRemaining) / (24 * 60 * 60 * 1000);
        score = 100 + daysOverdue;
      } else {
        score = 10 - (timeRemaining / (24 * 60 * 60 * 1000));
      }
      
      if (record.interval === 1 && record.repetitions === 0) {
        score += 200;
      }
      
      score += (3.0 - record.easiness) * 10;
    }
    
    return { question: q, score };
  });
  
  return scoredQuestions
    .sort((a, b) => b.score - a.score)
    .map(sq => sq.question);
};

// 同じカテゴリ（資産・負債・費用など）が3回以上連続しないように並び替える
// ただし、問題の順序は基本的に保持する
const shuffleByCategory = (questions) => {
  const maxConsecutive = 2;
  const buckets = {};
  
  // カテゴリごとに問題を分類
  questions.forEach(q => {
    const category = q.explanation?.concept?.split(' ➔ ')[1] || 'その他';
    if (!buckets[category]) buckets[category] = [];
    buckets[category].push(q);
  });
  
  const result = [];
  const lastCategoryCount = {};
  
  // 各カテゴリを順番に1問ずつ取り出して配置
  // 同じカテゴリが連続しないようにする
  while (Object.values(buckets).some(b => b.length > 0)) {
    // 前回の配置カテゴリを追跡
    let placed = false;
    
    // すべてのカテゴリをランダムな順序で試す
    const categoryNames = Object.keys(buckets).filter(c => buckets[c].length > 0);
    const shuffledCategories = categoryNames.sort(() => Math.random() - 0.5);
    
    for (const category of shuffledCategories) {
      const currentCount = lastCategoryCount[category] || 0;
      if (currentCount < maxConsecutive && buckets[category].length > 0) {
        // このカテゴリの問題を1問取り出す
        const q = buckets[category].shift();
        result.push(q);
        // 全カテゴリの連続カウントをリセットして、このカテゴリだけカウント
        Object.keys(lastCategoryCount).forEach(k => { lastCategoryCount[k] = 0; });
        lastCategoryCount[category] = 1;
        placed = true;
        break;
      }
    }
    
    // 配置できなかった場合（全部制限超過）、先頭のカテゴリから取る
    if (!placed) {
      const categoryNames2 = Object.keys(buckets).filter(c => buckets[c].length > 0);
      if (categoryNames2.length > 0) {
        const category = categoryNames2[0];
        const q = buckets[category].shift();
        result.push(q);
        Object.keys(lastCategoryCount).forEach(k => { lastCategoryCount[k] = 0; });
        lastCategoryCount[category] = 1;
      }
    }
  }
  return result;
};

// 2択問題の正解位置(左右)が不規則になるように、選択肢と正解インデックスを入れ替える
// ただし、借方/貸方の定位置問題（チュートリアル）は絶対に左右を入れ替えない
const interleaveAnswers = (questions) => {
  let lastCorrect = null;
  let sameStreak = 0;
  
  return questions.map(q => {
    if (!q.choices || q.choices.length < 2) {
      lastCorrect = null;
      sameStreak = 0;
      return q;
    }
    
    // 借方/貸方の定位置問題は左右を入れ替えない（借方=左側、貸方=右側は絶対）
    if (q.choices.includes('借方 (左側)') && q.choices.includes('貸方 (右側)')) {
      return q;
    }
    
    // 2択問題の場合（既存のロジック）
    if (q.choices.length === 2) {
      const correct = q.correct;
      const desiredCorrect = Math.random() < 0.5 ? 0 : 1;
      
      let targetCorrect = correct;
      if (sameStreak >= 2 && lastCorrect === correct) {
        targetCorrect = correct === 0 ? 1 : 0;
        sameStreak = 0;
      } else if (lastCorrect === null || correct !== lastCorrect || Math.random() < 0.5) {
        if (desiredCorrect !== correct) {
          targetCorrect = desiredCorrect;
        }
      }
      
      if (targetCorrect !== correct) {
        if (sameStreak > 0 && lastCorrect === targetCorrect) {
          sameStreak++;
        } else {
          sameStreak = 1;
        }
        return {
          ...q,
          choices: [q.choices[1], q.choices[0]],
          correct: targetCorrect
        };
      }
      
      if (lastCorrect === correct) {
        sameStreak++;
      } else {
        sameStreak = 1;
      }
      lastCorrect = correct;
      return q;
    }
    
    // 3択以上の場合：正解位置をランダムにシャッフル
    // 正解の選択肢を特定
    const correctChoice = q.choices[q.correct];
    const correctIdx = q.correct;
    
    // 正解をランダムな位置に配置
    const newCorrect = Math.floor(Math.random() * q.choices.length);
    
    // 正解以外の選択肢をシャッフル
    const otherChoices = q.choices.filter((_, i) => i !== correctIdx);
    for (let i = otherChoices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherChoices[i], otherChoices[j]] = [otherChoices[j], otherChoices[i]];
    }
    
    // 新しい選択肢配列を構築
    const newChoices = [];
    let otherIdx = 0;
    for (let i = 0; i < q.choices.length; i++) {
      if (i === newCorrect) {
        newChoices.push(correctChoice);
      } else {
        newChoices.push(otherChoices[otherIdx++]);
      }
    }
    
    return {
      ...q,
      choices: newChoices,
      correct: newCorrect
    };
  });
};

// ==========================================
// Quiz Data Configuration
// ==========================================
const generateTutorialQuestions = () => {
  // 問題生成後に正解位置を不規則化し、同じカテゴリが連続しないように分散する
  const questions = shuffleByCategory(interleaveAnswers(bokiAccounts.map(acc => {
    const isBS = ['資産', '負債', '純資産', '評価勘定'].includes(acc.category);
    
    let bsText = '';
    if (isBS) {
      bsText = `
        <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800">
          <div class="w-1/2 text-center border-r border-gray-200 dark:border-gray-800 py-1 ${acc.side === 0 ? 'bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-400'}">
            資産の増加
          </div>
          <div class="w-1/2 text-center py-1 flex flex-col items-center justify-center gap-0.5">
            <span class="${acc.category === '負債' ? 'bg-indigo-500/10 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold px-1 rounded' : 'text-gray-400'}">負債の増加</span>
            <span class="${acc.category === '純資産' ? 'bg-indigo-500/10 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold px-1 rounded' : 'text-gray-400'}">純資産の増加</span>
            <span class="${acc.category === '評価勘定' ? 'bg-red-500/10 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold px-1 rounded' : 'text-gray-400'}">評価の増加 (-)</span>
          </div>
        </div>
        <div class="text-[9px] text-gray-400 dark:text-gray-500 text-center pt-1">貸借対照表 (B/S) 定位置</div>
      `;
    } else {
      bsText = `
        <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800">
          <div class="w-1/2 text-center border-r border-gray-200 dark:border-gray-800 py-1 ${acc.side === 0 ? 'bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-400'}">
            費用の発生
          </div>
          <div class="w-1/2 text-center py-1 ${acc.side === 1 ? 'bg-indigo-500/10 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-400'}">
            収益の発生
          </div>
        </div>
        <div class="text-[9px] text-gray-400 dark:text-gray-500 text-center pt-1">損益計算書 (P/L) 定位置</div>
      `;
    }

    return {
      text: acc.name,
      type: 'tutorial',
      choices: ['借方 (左側)', '貸方 (右側)'],
      correct: acc.side,
      explanation: {
        concept: `${acc.name} ➔ ${acc.category}`,
        brilliantExplanation: `
          <div class="space-y-3 font-sans">
            <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
              <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">勘定科目の分類</span>
              <span>「${acc.name}」➔ ${acc.category}</span>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
              「${acc.name}」は <strong>${acc.category}</strong> に分類されます。
              このグループの「増加（または発生）」は、<strong>${acc.side === 0 ? '借方（左側）' : '貸方（右側）'}</strong> に記録するのがルールです。
            </p>
            <div class="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-gray-900/30">
              <div class="grid grid-cols-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-center font-bold py-1 text-xs text-gray-500 dark:text-gray-400">
                <div class="border-r border-gray-200 dark:border-gray-800">借方 (左)</div>
                <div>貸方 (右)</div>
              </div>
              ${bsText}
            </div>
          </div>
        `
      }
    };
  })));
  
  return sortQuestionsBySM2(questions);
};

// 魔導ロードマップ レベルデータ定義 (Lv0〜Lv39)
const roadmapLevels = [
  {
    id: 'lvl_0',
    level: 0,
    title: '簿記の全体像マップ',
    subtitle: '決算までの道のり、5つの勘定科目グループ、借方・貸方の大原則を解説します。',
    url: 'http://localhost:3001/guides/why-boki',
    tags: ['導入', '全体像', '借方', '貸方', '決算', 'ロードマップ'],
    questions: []
  },
  {
    id: 'lvl_1',
    level: 1,
    title: '現金と普通預金',
    subtitle: 'すべての取引の基本となる「資産」。簿記での「現金」の定義と、「普通預金」のルール。',
    url: 'http://localhost:3001/guides/cash-and-deposit',
    tags: ['資産', '現金', '普通預金'],
    questions: [
      {
        text: '得意先に対する売掛金1,000円について、送金小切手を受け取った。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 1,000 / （貸方）売 掛 金 1,000',
          '（借方）当座預金 1,000 / （貸方）売 掛 金 1,000',
          '（借方）小 切 手 1,000 / （貸方）売 掛 金 1,000',
          '（借方）受取手形 1,000 / （貸方）売 掛 金 1,000'
        ],
        correct: 0,
        explanation: {
          concept: '送金小切手 ➔ 通貨代用証券',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>送金小切手の受取り</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <strong>送金小切手</strong>や他人振出の小切手などの<strong>「通貨代用証券」</strong>を受け取った場合は、
                金銭的価値が高く直ちに現金化できるため、勘定科目<strong>「現金」</strong>（資産の増加）として処理します。
              </p>
              <div class="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-gray-900/30">
                <div class="grid grid-cols-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-center font-bold py-1 text-xs text-gray-500 dark:text-gray-400">
                  <div class="border-r border-gray-200 dark:border-gray-800">借方 (左)</div>
                  <div>貸方 (右)</div>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800">
                  <div class="w-1/2 text-center border-r border-gray-200 dark:border-gray-800 py-1 bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold">
                    現 金 1,000
                  </div>
                  <div class="w-1/2 text-center py-1 bg-indigo-500/10 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold">
                    売 掛 金 1,000
                  </div>
                </div>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                得意先に対する<strong>「掛け代金」の回収</strong>であるため、資産である<strong>「売掛金」</strong>の減少として貸方に処理します。
              </p>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>送金小切手を銀行口座に預け入れた<strong>時点</strong>で「当座預金」になりますが、受け取った<strong>時点</strong>の仕訳は「現金」です。</li>
                  <li>勘定科目に<strong>「小切手」</strong>は存在しません。他人振出の小切手や送金小切手はすべて「現金」で処理します。</li>
                  <li>小切手と手形は別物。<strong>「受取手形」</strong>は約束手形や為替手形を受け取った際に使います。</li>
                </ul>
              </div>
            </div>
          `
        }
      }
    ]
  },
  {
    id: 'lvl_2',
    level: 2,
    title: '小口現金の泉',
    subtitle: '細かい経費を管理する『小口現金（インプレスト・システム）』の流れをマスターします。',
    url: 'http://localhost:3001/guides/petty-cash',
    tags: ['資産', '小口現金', '旅費交通費'],
    questions: []
  },
  {
    id: 'lvl_3',
    level: 3,
    title: '売上の平原',
    subtitle: '仕入（費用の発生）と売上（収益の発生）の基本ルールと、発送費・諸掛りの処理。',
    url: 'http://localhost:3001/guides/sales-and-purchases',
    tags: ['費用', '収益', '仕入', '売上', '諸掛り'],
    questions: []
  },
  {
    id: 'lvl_4',
    level: 4,
    title: '掛取引の街道',
    subtitle: '後払い（掛け）の仕組み。権利である「売掛金」と、義務である「買掛金」の増減仕訳。',
    url: 'http://localhost:3001/guides/accounts-receivable-payable',
    tags: ['資産', '負債', '売掛金', '買掛金'],
    questions: []
  },
  {
    id: 'lvl_5',
    level: 5,
    title: '電子マネーの街',
    subtitle: 'クレジットカード売上と、差し引かれる『支払手数料』の仕訳テクニック。',
    url: 'http://localhost:3001/guides/credit-card-sales',
    tags: ['資産', '費用', 'クレジット売掛金', '支払手数料'],
    questions: []
  },
  {
    id: 'lvl_6',
    level: 6,
    title: '返品の港',
    subtitle: '不良品を返した・返された時の『返品（売上戻り・仕入戻し）』の逆仕訳ルール。',
    url: 'http://localhost:3001/guides/returns-and-shipping',
    tags: ['売上', '仕入', '返品'],
    questions: []
  },
  {
    id: 'lvl_7',
    level: 7,
    title: '値引の市場',
    subtitle: '品質不良などによる代金の減額『値引』の仕訳ルール。',
    url: 'http://localhost:3001/guides/sales-purchase-returns',
    tags: ['売上値引', '仕入値引', '値引'],
    questions: []
  },
  {
    id: 'lvl_8',
    level: 8,
    title: '貸借の橋',
    subtitle: 'お金の貸し借りと利息（支払利息・受取利息）の計算および手形を用いた取引。',
    url: 'http://localhost:3001/guides/loans-and-interest',
    tags: ['貸付金', '借入金', '手形借入金'],
    questions: []
  },
  {
    id: 'lvl_9',
    level: 9,
    title: '手形の関所',
    subtitle: '約束手形の振出（支払手形）と受取（受取手形）、および裏書譲渡の決済処理。',
    url: 'http://localhost:3001/guides/bills-receivable-payable',
    tags: ['受取手形', '支払手形', '裏書譲渡'],
    questions: []
  },
  {
    id: 'lvl_10',
    level: 10,
    title: '電子債権の塔',
    subtitle: 'ネット時代の決済『電子記録債権』『電子記録債務』の発生と消滅。',
    url: 'http://localhost:3001/guides/electronically-recorded-monetary-claims',
    tags: ['電子記録債権', '電子記録債務'],
    questions: []
  },
  {
    id: 'lvl_11',
    level: 11,
    title: '固定資産の工場',
    subtitle: '固定資産（建物・土地・備品）の取得と付随費用、後払い時の「未払金」の区別。',
    url: 'http://localhost:3001/guides/fixed-assets-purchase',
    tags: ['建物', '備品', '未払金', '付随費用'],
    questions: []
  },
  {
    id: 'lvl_12',
    level: 12,
    title: '株式会社の財務サイクル',
    subtitle: '出資から配当までの一連の財務サイクルと主要勘定科目の関係。',
    url: 'http://localhost:3001/guides/corporate-finance-cycle',
    tags: ['資本金', '繰越利益剰余金', '配当'],
    questions: []
  },
  {
    id: 'lvl_13',
    level: 13,
    title: '株式会社の夜明け',
    subtitle: '株式を発行して設立した際の『資本金』の計上ルール。',
    url: 'http://localhost:3001/guides/capital-stock',
    tags: ['資本金', '租税公課', '設立費用'],
    questions: []
  },
  {
    id: 'lvl_14',
    level: 14,
    title: '配当の宴',
    subtitle: '株主への利益配当と未払配当金の支払い。',
    url: 'http://localhost:3001/guides/dividends',
    tags: ['未払配当金', '繰越利益剰余金'],
    questions: []
  },
  {
    id: 'lvl_15',
    level: 15,
    title: '法人税の関所',
    subtitle: '中間申告時の『仮払法人税等』と、決算時の確定精算『未払法人税等』の相殺仕訳。',
    url: 'http://localhost:3001/guides/corporate-taxes',
    tags: ['法人税等', '仮払法人税等', '未払法人税等'],
    questions: []
  },
  {
    id: 'lvl_16',
    level: 16,
    title: '消費税の市場',
    subtitle: '仮払消費税、仮受消費税を相殺して未払消費税を計上する決算仕訳。',
    url: 'http://localhost:3001/guides/consumption-tax',
    tags: ['仮払消費税', '仮受消費税', '未払消費税'],
    questions: []
  },
  {
    id: 'lvl_17',
    level: 17,
    title: '社保の病院',
    subtitle: '従業員からの社会保険料天引きと、会社負担分（法定福利費）の納付。',
    url: 'http://localhost:3001/guides/social-insurance',
    tags: ['社会保険料預り金', '法定福利費'],
    questions: []
  },
  {
    id: 'lvl_18',
    level: 18,
    title: '給与の金庫',
    subtitle: '給料の総額から税金や保険料などを天引きし、手取額を支払う仕訳。',
    url: 'http://localhost:3001/guides/salary',
    tags: ['給料', '所得税預り金', '社会保険料預り金'],
    questions: []
  },
  {
    id: 'lvl_19',
    level: 19,
    title: '商品券の遊園地',
    subtitle: '他社発行の商品券で売上げた際の「受取商品券」の発生と換金処理。',
    url: 'http://localhost:3001/guides/gift-certificates',
    tags: ['受取商品券', '売上'],
    questions: []
  },
  {
    id: 'lvl_20',
    level: 20,
    title: '過不足の迷宮',
    subtitle: '現金実際額と帳簿額が一致しない場合の「現金過不足」の処理。',
    url: 'http://localhost:3001/guides/cash-over-short',
    tags: ['現金過不足', '雑損', '雑益'],
    questions: []
  },
  {
    id: 'lvl_21',
    level: 21,
    title: '訂正の魔法陣',
    subtitle: '過去の誤った仕訳を正しい状態に修正する訂正仕訳。',
    url: 'http://localhost:3001/guides/level-21',
    tags: ['訂正仕訳', '仕訳訂正'],
    questions: []
  },
  {
    id: 'lvl_22',
    level: 22,
    title: '固定資産の終焉',
    subtitle: '固定資産の廃棄や除却に伴う『固定資産除却損』の計上。',
    url: 'http://localhost:3001/guides/fixed-asset-disposal',
    tags: ['除却', '固定資産除却損', '備品'],
    questions: []
  },
  {
    id: 'lvl_23',
    level: 23,
    title: '減価償却の回廊',
    subtitle: '価値が毎年減る「減価償却」。間接法と累計額のルールを学びます。',
    url: 'http://localhost:3001/guides/depreciation',
    tags: ['減価償却費', '減価償却累計額'],
    questions: []
  },
  {
    id: 'lvl_24',
    level: 24,
    title: '貸倒引当金の壁',
    subtitle: '売掛金の焦げ付きに備える「貸倒引当金」と「貸倒損失」。',
    url: 'http://localhost:3001/guides/bad-debts',
    tags: ['貸倒引当金', '貸倒損失'],
    questions: []
  },
  {
    id: 'lvl_25',
    level: 25,
    title: '訂正の魔法陣（応用）',
    subtitle: '誤記を美しく修正する訂正仕訳の実践的なテクニック。',
    url: 'http://localhost:3001/guides/correcting-entries',
    tags: ['訂正仕訳', '売掛金', '現金'],
    questions: []
  },
  {
    id: 'lvl_26',
    level: 26,
    title: '経過勘定の4兄弟',
    subtitle: '決算整理で最も配点が高い経過勘定（未払・前払・未収・前受）の総論。',
    url: 'http://localhost:3001/guides/accrual-adjustments',
    tags: ['経過勘定', '決算整理'],
    questions: []
  },
  {
    id: 'lvl_27',
    level: 27,
    title: '消耗品の倉庫',
    subtitle: '消耗品購入時の費用処理と、決算期末の未使用分調整仕訳。',
    url: 'http://localhost:3001/guides/supplies',
    tags: ['消耗品', '消耗品費'],
    questions: []
  },
  {
    id: 'lvl_28',
    level: 28,
    title: '前払の時の部屋',
    subtitle: '当期支払った費用の中から、翌期の「未経過分」を資産として持ち越す処理。',
    url: 'http://localhost:3001/guides/prepaid-expenses',
    tags: ['前払費用', '支払保険料'],
    questions: []
  },
  {
    id: 'lvl_29',
    level: 29,
    title: '未払の時の部屋',
    subtitle: '当期にすでに発生している未払いの費用を決算で計上する処理。',
    url: 'http://localhost:3001/guides/accrued-expenses',
    tags: ['未払費用', '支払利息'],
    questions: []
  },
  {
    id: 'lvl_30',
    level: 30,
    title: '未収の時の部屋',
    subtitle: '当期中に発生しているが未回収の収益を決算で計上する処理。',
    url: 'http://localhost:3001/guides/accrued-revenues',
    tags: ['未収収益', '受取利息'],
    questions: []
  },
  {
    id: 'lvl_31',
    level: 31,
    title: '前受の時の部屋',
    subtitle: '当期に受け取った収益の中から、翌期分を負債として繰り延べる処理。',
    url: 'http://localhost:3001/guides/prepaid-revenues',
    tags: ['前受収益', '受取家賃'],
    questions: []
  },
  {
    id: 'lvl_32',
    level: 32,
    title: '貯蔵品の小部屋',
    subtitle: '未使用の切手や印紙などの決算時における「貯蔵品」への振替。',
    url: 'http://localhost:3001/guides/level-32',
    tags: ['貯蔵品', '通信費', '租税公課'],
    questions: []
  },
  {
    id: 'lvl_33',
    level: 33,
    title: '精算表の玉座',
    subtitle: '決算整理仕訳を集計し、B/SとP/Lを作成する「精算表」の作成手順。',
    url: 'http://localhost:3001/guides/work-sheet',
    tags: ['精算表', '当期純利益', '決算整理'],
    questions: []
  },
  {
    id: 'lvl_34',
    level: 34,
    title: '試算表の鏡',
    subtitle: '転記ミスや仕訳誤りを発見する合計試算表・残高試算表。',
    url: 'http://localhost:3001/guides/trial-balance',
    tags: ['試算表', '合計試算表', '残高試算表'],
    questions: []
  },
  {
    id: 'lvl_35',
    level: 35,
    title: '財務諸表の玉座',
    subtitle: '決算の最終報告書である『貸借対照表（B/S）』と『損益計算書（P/L）』。',
    url: 'http://localhost:3001/guides/financial-statements',
    tags: ['財務諸表', '貸借対照表', '損益計算書'],
    questions: []
  },
  {
    id: 'lvl_36',
    level: 36,
    title: '試算表の試練',
    subtitle: '決算整理を反映した『決算整理後残高試算表』を読み解く応用問題。',
    url: 'http://localhost:3001/guides/trial-balance',
    tags: ['試算表', '現金過不足', '決算整理', '雑益'],
    questions: []
  },
  {
    id: 'lvl_37',
    level: 37,
    title: '決算整理の書庫',
    subtitle: '減価償却・貸倒引当金・売上原価（し・くり・くり・し）の総まとめ。',
    url: 'http://localhost:3001/guides/year-end-adjustments-summary',
    tags: ['決算整理', '売上原価', '総まとめ'],
    questions: []
  },
  {
    id: 'lvl_38',
    level: 38,
    title: '再振替仕訳',
    subtitle: '経過勘定（前払費用など）を翌期首に逆仕訳で戻す「再振替仕訳」の意味。',
    url: 'http://localhost:3001/guides/reversing-entries',
    tags: ['再振替仕訳', '期首', '経過勘定'],
    questions: []
  },
  {
    id: 'lvl_39',
    level: 39,
    title: '帳簿の締切りと大団円',
    subtitle: '収益・費用を「損益」勘定に振り替え、帳簿を完全に締め切るプロセス。',
    url: 'http://localhost:3001/guides/closing-books',
    tags: ['決算振替仕訳', '損益勘定', '帳簿の締切り', '大団円'],
    questions: []
  }
];

// ==========================================
// LocalStorage Progress Sync
// ==========================================
const loadRoadmapProgress = () => {
  try {
    const raw = localStorage.getItem('qlearn_roadmap_boki');
    let loaded = {};
    if (raw) {
      loaded = JSON.parse(raw);
    }
    
    state.roadmapProgress = loaded;
    
    roadmapLevels.forEach(lvl => {
      if (!state.roadmapProgress[lvl.id]) {
        const shouldBeUnlocked = lvl.id === 'lvl_0' || lvl.id === 'lvl_1';
        state.roadmapProgress[lvl.id] = { 
          unlocked: shouldBeUnlocked, 
          completed: false 
        };
      } else {
        if (lvl.id === 'lvl_0' || lvl.id === 'lvl_1') {
          state.roadmapProgress[lvl.id].unlocked = true;
        }
      }
    });
    
    saveRoadmapProgress();
  } catch (e) {
    console.error('Failed to load roadmap progress', e);
  }
};

const saveRoadmapProgress = () => {
  try {
    localStorage.setItem('qlearn_roadmap_boki', JSON.stringify(state.roadmapProgress));
  } catch (e) {
    console.error('Failed to save roadmap progress', e);
  }
};

// ==========================================
// Services Metadata Configuration
// ==========================================
const servicesData = {
  boki_tutorial: {
    title: '勘定科目マスター',
    subtitle: 'SM-2 + しつこく復習ループで限界突破記憶 (無限ライフ)',
    themeColor: 'cyan',
    get questions() {
      return generateTutorialQuestions();
    }
  },
  boki_shiwake: {
    title: '簿記3級 仕訳クエスト',
    subtitle: '実践的な仕訳取引の4択攻略',
    themeColor: 'indigo',
    questions: []
  }
};

// ==========================================
// Views Transition Router
// ==========================================
const syncHeader = () => {
  const globalStreak = document.getElementById('global-streak');
  const globalHearts = document.getElementById('global-hearts');
  
  if (globalStreak) globalStreak.innerText = state.streak;
  
  if (globalHearts) {
    if (state.currentService === 'boki_tutorial' || state.debugMode) {
      globalHearts.innerHTML = '<span class="text-xs">∞</span>';
      document.getElementById('global-hearts-container')?.classList.add('animate-pulse');
    } else {
      globalHearts.innerText = state.hearts;
      document.getElementById('global-hearts-container')?.classList.remove('animate-pulse');
    }
  }
};

const showView = (viewName) => {
  state.currentView = viewName;
  
  document.querySelectorAll('.app-screen').forEach(screen => {
    screen.classList.add('hidden');
  });
  
  const targetScreen = document.getElementById(`${viewName}-screen`);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
  }
  
  const actionBar = document.getElementById('quiz-action-bar');
  if (actionBar) {
    if (viewName === 'quiz') {
      actionBar.classList.remove('hidden');
    } else {
      actionBar.classList.add('hidden');
    }
  }
  
  syncHeader();
  
  if (viewName === 'portal') renderPortal();
  if (viewName === 'map') renderMap();
  if (viewName === 'dashboard') renderDashboard();
  if (viewName === 'quiz') renderQuiz();
  if (viewName === 'result') renderResult();
};

// ==========================================
// UI Rendering Functions
// ==========================================

// Portal Screen
const renderPortal = () => {
  const portalGrid = document.getElementById('portal-grid');
  if (!portalGrid) return;
  
  portalGrid.innerHTML = `
    <!-- 1. 勘定科目マスター (チュートリアル) -->
    <div id="btn-portal-tutorial" class="glass-panel-interactive rounded-2xl p-6 cursor-pointer flex flex-col justify-between h-48 border-t-4 border-cyan-500">
      <div>
        <div class="flex justify-between items-start mb-4">
          <span class="text-xs font-semibold px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400">
            TUTORIAL
          </span>
          <i data-lucide="compass" class="text-gray-400 dark:text-gray-500 w-5 h-5"></i>
        </div>
        <h3 class="text-xl font-bold mb-1 text-gray-900 dark:text-white">勘定科目マスター</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">借方・貸方の定位置を限界突破記憶 (無限ライフ)</p>
      </div>
      <div class="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span class="font-bold flex items-center gap-1"><i data-lucide="layers" class="w-3.5 h-3.5"></i> ${bokiAccounts.length} 勘定科目</span>
        <button class="px-4 py-1.5 rounded-lg text-white font-semibold text-xs bg-cyan-600 hover:bg-cyan-500">スタート</button>
      </div>
    </div>

    <!-- 2. 魔導ロードマップ (仕訳クエスト) -->
    <div id="btn-portal-shiwake" class="glass-panel-interactive rounded-2xl p-6 cursor-pointer flex flex-col justify-between h-48 border-t-4 border-indigo-500">
      <div>
        <div class="flex justify-between items-start mb-4">
          <span class="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400">
            ROADMAP
          </span>
          <i data-lucide="map" class="text-gray-400 dark:text-gray-500 w-5 h-5"></i>
        </div>
        <h3 class="text-xl font-bold mb-1 text-gray-900 dark:text-white">仕訳クエスト 魔導ロードマップ</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">Lv0〜Lv39のクエストをすごろく形式で攻略</p>
      </div>
      <div class="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span class="font-bold flex items-center gap-1"><i data-lucide="award" class="w-3.5 h-3.5"></i> 全 ${roadmapLevels.length} ステージ</span>
        <button class="px-4 py-1.5 rounded-lg text-white font-semibold text-xs bg-indigo-600 hover:bg-indigo-500">開く</button>
      </div>
    </div>
  `;

  // Bind events
  document.getElementById('btn-portal-tutorial').addEventListener('click', () => {
    state.currentService = 'boki_tutorial';
    state.activeQuestions = generateTutorialQuestions();
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.hearts = 5;
    state.firstTimeWrongCount = 0;
    showView('quiz');
  });

  document.getElementById('btn-portal-shiwake').addEventListener('click', () => {
    state.currentService = 'boki_shiwake';
    showView('map');
  });

  safeCreateIcons();
};

// Map Screen (魔導ロードマップのすごろく描画)
const renderMap = () => {
  const mapContainer = document.getElementById('map-scroll-container');
  if (!mapContainer) return;
  mapContainer.innerHTML = '';
  
  loadRoadmapProgress();

  roadmapLevels.forEach((lvl, idx) => {
    const isUnlocked = state.roadmapProgress[lvl.id]?.unlocked || false;
    const isCompleted = state.roadmapProgress[lvl.id]?.completed || false;
    
    let alignClass = 'justify-center';
    if (idx % 4 === 1) {
      alignClass = 'justify-start pl-8 md:pl-16';
    } else if (idx % 4 === 3) {
      alignClass = 'justify-end pr-8 md:pr-16';
    }

    const node = document.createElement('div');
    node.className = `flex ${alignClass} w-full relative mb-12 z-10`;
    
    let pinBg = 'bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed';
    let pulseClass = '';
    
    if (isCompleted) {
      pinBg = 'bg-emerald-500 border-emerald-400 text-white cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200';
    } else if (isUnlocked) {
      pinBg = 'bg-indigo-600 border-indigo-400 text-white cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg neon-glow-indigo';
      pulseClass = 'animate-pulse-glow';
    }

    node.innerHTML = `
      <!-- Stage Pin -->
      <div class="flex flex-col items-center">
        <button id="pin-${lvl.id}" class="w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center font-bold text-lg select-none relative ${pinBg} ${pulseClass}">
          <span class="text-[10px] uppercase font-bold tracking-tight opacity-75">Lv</span>
          <span class="text-lg -mt-1 font-heading">${lvl.level}</span>
          ${isCompleted ? '<div class="absolute -top-1 -right-1 w-6 h-6 bg-emerald-600 rounded-full border border-white flex items-center justify-center text-xs">✓</div>' : ''}
          ${!isUnlocked ? '<div class="absolute -top-1 -right-1 w-6 h-6 bg-gray-700 rounded-full border border-gray-600 flex items-center justify-center text-xs"><i data-lucide="lock" class="w-3 h-3 text-gray-400"></i></div>' : ''}
        </button>
        <span class="mt-2 text-xs font-semibold text-center text-gray-800 dark:text-gray-300 max-w-[120px] truncate">${lvl.title}</span>
      </div>
    `;

    if (isUnlocked) {
      node.querySelector(`#pin-${lvl.id}`).addEventListener('click', () => {
        // レベルをクリックしたら問題を直接開始 (ダイアログ・確認画面をスキップ)
        state.currentLevelId = lvl.id;
        state.activeQuestions = shuffleByCategory(interleaveAnswers([...lvl.questions]));
        state.currentQuestionIndex = 0;
        state.score = 0;
        state.hearts = 5;
        state.firstTimeWrongCount = 0;
        showView('quiz');
      });
    }

    mapContainer.appendChild(node);
  });
  
  safeCreateIcons();
};

// レベル詳細ダイアログ表示
const showLevelDialog = (lvl) => {
  const dialog = document.getElementById('map-level-dialog');
  if (!dialog) return;
  
  document.getElementById('dialog-level-num').innerText = lvl.level;
  document.getElementById('dialog-title').innerText = lvl.title;
  document.getElementById('dialog-subtitle').innerText = lvl.subtitle;
  document.getElementById('dialog-url-link').href = lvl.url;
  
  const tagsContainer = document.getElementById('dialog-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = '';
    lvl.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-[10px] font-semibold';
      span.innerText = `#${tag}`;
      tagsContainer.appendChild(span);
    });
  }

  const startBtn = document.getElementById('dialog-start-btn');
  if (startBtn) {
    startBtn.onclick = () => {
      state.currentLevelId = lvl.id;
      state.activeQuestions = [...lvl.questions];
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.hearts = 5;
      state.firstTimeWrongCount = 0;
      
      dialog.classList.add('hidden');
      showView('dashboard');
    };
  }

  dialog.classList.remove('hidden');
};

// Dashboard Screen
const renderDashboard = () => {
  let title = '';
  let subtitle = '';
  let color = 'indigo';
  
  if (state.currentService === 'boki_tutorial') {
    title = servicesData.boki_tutorial.title;
    subtitle = servicesData.boki_tutorial.subtitle;
    color = servicesData.boki_tutorial.themeColor;
  } else {
    const lvl = roadmapLevels.find(l => l.id === state.currentLevelId);
    title = `Lv${lvl.level} : ${lvl.title}`;
    subtitle = lvl.subtitle;
  }
  
  const titleEl = document.getElementById('dash-course-title');
  const streakEl = document.getElementById('dash-streak-count');
  const xpEl = document.getElementById('dash-xp-count');
  const xpProgressEl = document.getElementById('dash-xp-progress');
  const startBtn = document.getElementById('dash-start-btn');
  const leagueList = document.getElementById('dash-league-list');
  
  if (titleEl) titleEl.innerText = title;
  if (streakEl) streakEl.innerText = state.streak;
  if (xpEl) xpEl.innerText = `${state.xp}/300 XP`;
  
  if (xpProgressEl) {
    const xpPercent = Math.min((state.xp / 300) * 100, 100);
    xpProgressEl.style.width = `${xpPercent}%`;
  }
  
  if (startBtn) {
    startBtn.style.backgroundColor = getThemeColorHex(color);
    startBtn.className = `w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 neon-glow-${color}`;
  }
  
  if (leagueList) {
    leagueList.innerHTML = `
      <div class="flex items-center justify-between p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
        <div class="flex items-center gap-3">
          <span class="font-bold text-indigo-500 dark:text-indigo-400 w-5 text-center">1</span>
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center font-bold text-xs text-black">👑</div>
          <span class="font-medium text-gray-900 dark:text-white text-sm">あなた (You)</span>
        </div>
        <span class="text-xs font-bold text-indigo-600 dark:text-indigo-300 font-mono">${state.xp} XP</span>
      </div>
    `;
  }
  
  safeCreateIcons();
};

// Quiz Screen
const renderQuiz = () => {
  const service = servicesData[state.currentService];
  const question = state.activeQuestions[state.currentQuestionIndex];
  
  if (!question) {
    return showView('result');
  }
  
  const color = state.currentService === 'boki_tutorial' ? 'cyan' : 'indigo';
  const themeHex = getThemeColorHex(color);
  
  const heartsCountEl = document.getElementById('quiz-hearts-count');
  if (heartsCountEl) {
    if (state.currentService === 'boki_tutorial' || state.debugMode) {
      heartsCountEl.innerHTML = '<span class="text-xs">∞</span>';
    } else {
      heartsCountEl.innerText = state.hearts;
    }
  }
  
  const progressBarEl = document.getElementById('quiz-progress-bar');
  if (progressBarEl) {
    const progressPercent = ((state.currentQuestionIndex) / state.activeQuestions.length) * 100;
    progressBarEl.style.width = `${progressPercent}%`;
    progressBarEl.style.backgroundColor = themeHex;
  }
  
  const questionTextEl = document.getElementById('quiz-question-text');
  if (questionTextEl) {
    if (question.type === 'tutorial') {
      questionTextEl.innerHTML = `
        <div class="text-center space-y-2">
          <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-heading">この勘定科目が増える方は？</div>
          <div class="text-4xl md:text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight py-6">${question.text}</div>
        </div>
      `;
    } else {
      questionTextEl.innerText = question.text;
    }
  }
  
  const choicesContainer = document.getElementById('quiz-choices-container');
  if (!choicesContainer) return;
  choicesContainer.innerHTML = '';
  
  state.selectedAnswer = null;
  state.answered = false;
  
  const actionBar = document.getElementById('quiz-action-bar');
  if (actionBar) {
    actionBar.className = "border-t border-gray-200 dark:border-gray-850 bg-gray-50 dark:bg-gray-950/80 p-4 transition-all duration-300";
    actionBar.innerHTML = `
      <div class="max-w-xl mx-auto flex items-center justify-between gap-4">
        <button id="quiz-skip-btn" class="px-6 py-3 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
          スキップ
        </button>
      </div>
    `;
  }
  
  const imageContainer = document.getElementById('quiz-image-container');
  if (imageContainer) imageContainer.classList.add('hidden');
  
  const isTwoChoice = question.type === 'tutorial' || question.choices.length === 2;
  if (isTwoChoice) {
    choicesContainer.className = "grid grid-cols-2 gap-4 pt-6";
  } else {
    choicesContainer.className = "space-y-3 pt-4";
  }
  
  question.choices.forEach((choice, idx) => {
    const button = document.createElement('button');
    
    if (isTwoChoice) {
      const isLeft = idx === 0;
      const borderTheme = isLeft ? 'border-emerald-500/20 hover:border-emerald-500' : 'border-indigo-500/20 hover:border-indigo-500';
      button.className = `choice-card h-40 text-center p-6 rounded-2xl bg-white dark:bg-gray-900 border ${borderTheme} transition flex flex-col justify-center items-center gap-3`;
      button.innerHTML = `
        <span class="text-xs text-gray-400 font-heading uppercase">${isLeft ? 'Debit / 借方' : 'Credit / 貸方'}</span>
        <span class="text-lg font-extrabold text-gray-800 dark:text-gray-100">${choice}</span>
      `;
    } else {
      button.className = 'choice-card w-full text-left p-4 rounded-xl glass-panel-interactive border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition flex items-center justify-between text-sm';
      button.innerHTML = `
        <span class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800/80 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 font-mono">${idx + 1}</span>
          <span class="text-gray-800 dark:text-gray-200 text-sm md:text-base">${choice}</span>
        </span>
      `;
    }
    
    button.addEventListener('click', () => {
      if (state.answered) return;
      
      playSound('select');
      
      document.querySelectorAll('.choice-card').forEach(card => {
        card.classList.remove('selected');
        card.style.borderColor = '';
      });
      
      button.classList.add('selected');
      button.style.borderColor = themeHex;
      state.selectedAnswer = idx;
      
      // すべての問題は、選択した瞬間に正誤判定（確認ボタンなし）
      checkAnswer();
      return;
      
      const checkBtn = document.getElementById('quiz-check-btn');
      if (checkBtn) {
        checkBtn.disabled = false;
        checkBtn.classList.remove('bg-gray-200', 'text-gray-400', 'dark:bg-gray-800', 'dark:text-gray-500', 'cursor-not-allowed');
        checkBtn.classList.add('text-white');
        checkBtn.style.backgroundColor = themeHex;
      }
    });
    
    choicesContainer.appendChild(button);
  });
  
  const checkBtn = document.getElementById('quiz-check-btn');
  if (checkBtn) checkBtn.addEventListener('click', checkAnswer);
  
  const skipBtn = document.getElementById('quiz-skip-btn');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      state.firstTimeWrongCount++;
      state.activeQuestions.push({ ...question });
      
      if (state.currentService !== 'boki_tutorial' && !state.debugMode) {
        state.hearts--;
        syncHeader();
      }
      
      if (state.hearts <= 0 && state.currentService !== 'boki_tutorial' && !state.debugMode) {
        showView('dashboard');
      } else {
        nextQuestion();
      }
    });
  }
};

// Check Answer Logic
const checkAnswer = () => {
  if (state.answered) return;
  state.answered = true;
  
  const question = state.activeQuestions[state.currentQuestionIndex];
  const isCorrect = state.selectedAnswer === question.correct;
  state.isCorrect = isCorrect;
  
  const choices = document.querySelectorAll('.choice-card');
  const checkedCard = choices[state.selectedAnswer];
  const correctCard = choices[question.correct];
  
  const actionBar = document.getElementById('quiz-action-bar');
  if (!actionBar) return;
  
  updateSM2(question, isCorrect);
  
  if (isCorrect) {
    state.score += 10;
    state.xp += 15;
    playSound('correct');
    triggerConfetti();
    
    if (checkedCard) {
      checkedCard.classList.add('correct');
      checkedCard.style.borderColor = '#22c55e';
    }
    
    actionBar.className = "border-t border-emerald-300 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/90 p-6 transition-all duration-300";
    actionBar.innerHTML = `
      <div class="max-w-xl mx-auto space-y-4">
        <div class="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
          <div class="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white dark:text-black">✓</div>
          素晴らしい！正解です。
        </div>
        
        <div class="bg-white dark:bg-black/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-500/20 text-gray-700 dark:text-gray-300 shadow-sm">
          <div class="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 font-heading">
            Brilliant式 構造解説
          </div>
          ${question.explanation.brilliantExplanation}
        </div>
        
        <div class="flex justify-end pt-2">
          <button id="quiz-next-btn" class="px-8 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/30">
            次へ進む
          </button>
        </div>
      </div>
    `;
  } else {
    state.firstTimeWrongCount++;
    state.activeQuestions.push({ ...question });
    
    if (state.currentService !== 'boki_tutorial' && !state.debugMode) {
      state.hearts--;
      syncHeader();
    }
    playSound('incorrect');
    
    if (checkedCard) {
      checkedCard.classList.add('incorrect', 'animate-shake');
      checkedCard.style.borderColor = '#ef4444';
    }
    if (correctCard) {
      correctCard.style.borderColor = '#22c55e';
    }
    
    actionBar.className = "border-t border-red-300 dark:border-red-800/50 bg-red-50 dark:bg-red-950/90 p-6 transition-all duration-300";
    actionBar.innerHTML = `
      <div class="max-w-xl mx-auto space-y-4">
        <div class="flex items-center gap-3 text-red-600 dark:text-red-400 font-bold text-lg">
          <div class="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white">!</div>
          残念、違います。（後ほど再出題されます）
        </div>
        
        <div class="text-sm text-red-700 dark:text-red-300/80 mb-2">
          正解: <strong class="text-emerald-600 dark:text-emerald-400">${question.choices[question.correct]}</strong>
        </div>
        
        <div class="bg-white dark:bg-black/40 p-4 rounded-xl border border-red-200 dark:border-red-500/20 text-gray-700 dark:text-gray-300 shadow-sm">
          <div class="font-bold text-xs uppercase tracking-wider text-red-600 dark:text-emerald-400 mb-2 font-heading">
            Brilliant式 構造解説
          </div>
          ${question.explanation.brilliantExplanation}
        </div>
        
        <div class="flex justify-between items-center pt-2">
          <span class="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
            <i data-lucide="heart" class="w-4 h-4 fill-red-500 text-red-500 animate-pulse"></i> 
            ライフ残量: ${state.currentService === 'boki_tutorial' || state.debugMode ? '∞' : state.hearts}
          </span>
          <button id="quiz-next-btn" class="px-8 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 transition shadow-lg shadow-red-900/30">
            閉じて次へ
          </button>
        </div>
      </div>
    `;
    safeCreateIcons();
  }
  
  const nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (state.hearts <= 0 && state.currentService !== 'boki_tutorial') {
        showView('dashboard');
      } else {
        nextQuestion();
      }
    });
  }
};

const nextQuestion = () => {
  state.currentQuestionIndex++;
  if (state.currentQuestionIndex >= state.activeQuestions.length) {
    showView('result');
  } else {
    renderQuiz();
  }
};

// Result Screen
const renderResult = () => {
  playSound('level-up');
  
  let courseTitle = '';
  if (state.currentService === 'boki_tutorial') {
    courseTitle = servicesData.boki_tutorial.title;
  } else {
    const lvl = roadmapLevels.find(l => l.id === state.currentLevelId);
    courseTitle = `Lv${lvl.level} : ${lvl.title}`;
    
    state.roadmapProgress[lvl.id].completed = true;
    
    const nextLvlIndex = roadmapLevels.findIndex(l => l.id === lvl.id) + 1;
    if (nextLvlIndex < roadmapLevels.length) {
      const nextLvl = roadmapLevels[nextLvlIndex];
      if (state.roadmapProgress[nextLvl.id]) {
        state.roadmapProgress[nextLvl.id].unlocked = true;
      }
    }
    saveRoadmapProgress();
  }

  const nameEl = document.getElementById('res-service-name');
  const scoreEl = document.getElementById('res-score');
  const xpEl = document.getElementById('res-xp-count');
  
  if (nameEl) nameEl.innerText = courseTitle;
  if (scoreEl) scoreEl.innerText = `+${state.score} pt`;
  if (xpEl) xpEl.innerText = `獲得XP: +${state.score * 1.5} XP`;
  
  state.xp += state.score * 1.5;
  if (state.xp >= 300) {
    state.level++;
    state.xp = state.xp - 300;
    state.streak++;
    
    const levelUpModal = document.getElementById('level-up-toast');
    if (levelUpModal) {
      levelUpModal.classList.remove('hidden');
      setTimeout(() => {
        levelUpModal.classList.add('hidden');
      }, 4000);
    }
  }
  
  const reviewBtnContainer = document.getElementById('res-review-container');
  if (reviewBtnContainer) {
    if (state.firstTimeWrongCount > 0) {
      reviewBtnContainer.innerHTML = `
        <div class="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-center">
          <p class="text-xs text-orange-600 dark:text-orange-300">
            このセッションで <strong>${state.firstTimeWrongCount} 回</strong> 間間違えましたが、しつこく復習してすべて克服しました！
          </p>
        </div>
      `;
    } else {
      reviewBtnContainer.innerHTML = `
        <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
          <p class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">パーフェクト！一発ですべて正解しました。素晴らしい記憶力です！</p>
        </div>
      `;
    }
  }

  const homeBtn = document.getElementById('res-home-btn');
  if (homeBtn) {
    homeBtn.onclick = () => {
      if (state.currentService === 'boki_shiwake') {
        showView('map');
      } else {
        showView('portal');
      }
    };
  }
};

// ==========================================
// Utility Helpers & Visual Effects
// ==========================================
function getThemeColorHex(theme) {
  switch (theme) {
    case 'indigo': return '#6366f1';
    case 'cyan': return '#06b6d4';
    default: return '#6366f1';
  }
}

function safeCreateIcons() {
  try {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  } catch (e) {
    console.warn('Lucide icons failed to render', e);
  }
}

function triggerConfetti() {
  const container = document.body;
  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#eab308', '#a855f7'];
  
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.transform = `scale(${Math.random() * 0.8 + 0.4})`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
    
    container.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 2500);
  }
}

// ==========================================
// Sound Settings Controller
// ==========================================
const initSound = () => {
  const isEnabled = localStorage.getItem('sound_enabled') !== 'false';
  state.soundEnabled = isEnabled;
  updateSoundIcon(isEnabled);
};

const toggleSound = () => {
  state.soundEnabled = !state.soundEnabled;
  localStorage.setItem('sound_enabled', state.soundEnabled);
  updateSoundIcon(state.soundEnabled);
};

const updateSoundIcon = (isEnabled) => {
  const icon = document.getElementById('sound-toggle-icon');
  if (icon) {
    if (isEnabled) {
      icon.innerHTML = `<i data-lucide="volume-2" class="text-indigo-500 dark:text-indigo-400 w-5 h-5"></i>`;
    } else {
      icon.innerHTML = `<i data-lucide="volume-x" class="text-gray-400 dark:text-gray-650 w-5 h-5"></i>`;
    }
    safeCreateIcons();
  }
};

// ==========================================
// Theme (Light/Dark Mode) Controller
// ==========================================
const initTheme = () => {
  const isDark = localStorage.getItem('theme') !== 'light';
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeIcon(isDark);
};

const toggleTheme = () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
};

const updateThemeIcon = (isDark) => {
  const icon = document.getElementById('theme-toggle-icon');
  if (icon) {
    if (isDark) {
      icon.innerHTML = `<i data-lucide="sun" class="text-yellow-400 w-5 h-5"></i>`;
    } else {
      icon.innerHTML = `<i data-lucide="moon" class="text-slate-600 w-5 h-5"></i>`;
    }
    safeCreateIcons();
  }
};

const playSound = (type) => {
  if (!state.soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'select') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'correct') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'incorrect') {
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.setValueAtTime(196, ctx.currentTime + 0.15); // G3
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'level-up') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) {
    console.warn('Audio Context failed', e);
  }
};

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  try {
    initTheme();
    initSound();
    
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', toggleSound);
    }

    const headerLogo = document.getElementById('header-logo');
    if (headerLogo) {
      let clickCount = 0;
      let clickTimer = null;
      headerLogo.addEventListener('click', () => {
        clickCount++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clickCount = 0; }, 1500);

        if (clickCount >= 5) {
          // 5回連続クリックで全レベルをアンロック
          roadmapLevels.forEach(lvl => {
            state.roadmapProgress[lvl.id] = { unlocked: true, completed: false };
          });
          saveRoadmapProgress();
          clickCount = 0;
          
          // トースト表示でお知らせ
          const toast = document.getElementById('level-up-toast');
          if (toast) {
            toast.querySelector('h4').innerText = 'DEBUG UNLOCK';
            toast.querySelector('p').innerText = 'すべてのレベルがアンロックされました！';
            toast.classList.remove('hidden');
            setTimeout(() => { toast.classList.add('hidden'); }, 3000);
          }
          
          // マップ再描画
          if (state.currentView === 'map') {
            renderMap();
          }
        } else {
          showView('portal');
        }
      });
    }

    const startBtn = document.getElementById('dash-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        showView('quiz');
      });
    }
    
    const backBtn = document.getElementById('dash-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (state.currentService === 'boki_shiwake') {
          showView('map');
        } else {
          showView('portal');
        }
      });
    }

    const mapBackBtn = document.getElementById('map-back-btn');
    if (mapBackBtn) {
      mapBackBtn.addEventListener('click', () => {
        showView('portal');
      });
    }

    const dialogCloseBtn = document.getElementById('dialog-close-btn');
    if (dialogCloseBtn) {
      dialogCloseBtn.addEventListener('click', () => {
        const dialog = document.getElementById('map-level-dialog');
        if (dialog) dialog.classList.add('hidden');
      });
    }
    
    showView('portal');
  } catch (err) {
    const debugDiv = document.createElement('div');
    debugDiv.className = 'fixed top-0 left-0 right-0 bg-red-600 text-white p-4 font-mono text-xs z-50 overflow-auto max-h-[50vh] shadow-2xl';
    debugDiv.innerHTML = `
      <div class="font-bold text-sm mb-1">⚠️ Runtime Error Detected:</div>
      <pre class="whitespace-pre-wrap">${err.stack || err.message || err}</pre>
    `;
    document.body.appendChild(debugDiv);
    console.error('Qlearn Init Error:', err);
  }
});
