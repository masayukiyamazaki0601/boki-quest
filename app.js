  // ==========================================
// 定数定義
// ==========================================
const APP_CONSTANTS = {
  MAX_XP_PER_LEVEL: 300,
  INITIAL_HEARTS: 5,
  SCORE_PER_CORRECT: 10,
  XP_PER_CORRECT: 15,
  XP_RATE: 1.5,
  MAX_CONSECUTIVE_CATEGORY: 2
};

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
  const maxConsecutive = APP_CONSTANTS.MAX_CONSECUTIVE_CATEGORY;
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
      // ===== 現金預金 問題1〜20 (ユーザー追加分) =====
      {
        text: '得意先より売掛金800円の回収として、300円は同店振り出しの小切手で受け取り、残額は当店の普通預金口座へ振り込まれた。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 300 / （貸方）売 掛 金 800<br>（借方）普通預金 500',
          '（借方）当座預金 300 / （貸方）売 掛 金 800<br>（借方）普通預金 500',
          '（借方）小 切 手 300 / （貸方）売 掛 金 800<br>（借方）普通預金 500',
          '（借方）普通預金 800 / （貸方）売 掛 金 800'
        ],
        correct: 0,
        explanation: {
          concept: '売掛金の回収 ➔ 現金＋普通預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>売掛金の回収（小切手＋振込）</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方（資産の増加）</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>同店振り出しの<strong>小切手300円</strong> → 他人振出小切手は<strong>「現金」</strong>として処理</li>
                  <li>振込額<strong>500円</strong>（800−300） → <strong>「普通預金」</strong>の増加</li>
                </ul>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方（資産の減少）</div>
                <p class="text-xs">
                  売掛金800円の回収であるため、資産の減少として<strong>「売掛金 800円」</strong>を貸方に記入します。
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>他店振り出しの小切手は「現金」として処理します。「当座預金」は当店振出の小切手を回収した場合です。</li>
                  <li>「小切手」という勘定科目は存在しません。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '仕入先より商品900円を仕入れ、代金のうち400円は普通預金口座から振り込んで支払った。その際、当店負担の振込手数料100円もあわせて同口座から引き落とされた。なお、残額は掛けとした。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）仕 入 500 / （貸方）普通預金 500',
          '（借方）仕 入 900 / （貸方）普通預金 500<br>（借方）支払手数料 100 / （貸方）買 掛 金 500',
          '（借方）仕 入 900 / （貸方）普通預金 400<br>（借方）雑 費 100 / （貸方）買 掛 金 600',
          '（借方）仕 入 900 / （貸方）普通預金 400<br>（貸方）買 掛 金 500'
        ],
        correct: 1,
        explanation: {
          concept: '仕入と振込手数料 ➔ 複合仕訳',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>仕入代金の一部振込と振込手数料の処理</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方</div>
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>仕 入 900円</strong>（費用の発生・仕入全額）</li>
                  <li><strong>支払手数料 100円</strong>（費用の発生・当店負担の振込手数料）</li>
                </ul>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方</div>
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>普通預金 500円</strong>（400円振込＋100円手数料の合計）</li>
                  <li><strong>買 掛 金 500円</strong>（残額の掛け分）</li>
                </ul>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>振込手数料は<strong>「支払手数料」</strong>（費用）で処理します。「雑費」は不適切です。</li>
                  <li>貸方の合計は900円（400＋100＋500）になるよう、借方が900円（仕入900）と対応しているか確認しましょう。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '当期の決算において、現金の帳簿残高は800円であったが、実際有額は700円であった。差額100円のうち60円は通信費の記入漏れであることが判明したが、残額については原因が判明しなかった。正しい決算整理仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）通 信 費 60 / （貸方）現 金 100<br>（借方）雑 損 40',
          '（借方）通 信 費 60 / （貸方）現金過不足 100<br>（借方）雑 損 40',
          '（借方）現 金 100 / （貸方）通 信 費 60<br>（貸方）雑 益 40',
          '（借方）雑 損 100 / （貸方）現 金 100'
        ],
        correct: 0,
        explanation: {
          concept: '現金過不足の決算整理 ➔ 通信費・雑損',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>決算日の現金過不足が原因判明</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                帳簿残高800円に対して実際有額700円のため<strong>100円（800−700）の現金不足</strong>です。
                実額に合わせて<strong>現金を100円減額</strong>します（貸方：現金）。
              </p>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方（費用の発生）</div>
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>通 信 費 60円</strong>（記入漏れと判明した費用）</li>
                  <li><strong>雑 損 40円</strong>（原因不明の残額）</li>
                </ul>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>期中ではなく<strong>決算時点</strong>で原因判明のため、「現金過不足」勘定を経由せず直接費用（通信費・雑損）と現金の減額で処理します。</li>
                  <li>現金が不足しているため貸方は「現金」です。現金を増やす処理（借方：現金）になるのは実際有額が多い場合です。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '期中に現金過不足として処理していた借方残高500円について決算日において調査したところ、売掛金の回収額300円の記帳漏れであることが判明した。残額については原因が不明のため、正しい決算整理仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 500 / （貸方）売 掛 金 300<br>（貸方）雑 益 200',
          '（借方）売 掛 金 300 / （貸方）現金過不足 500<br>（借方）雑 損 200',
          '（借方）現金過不足 500 / （貸方）売 掛 金 300<br>（貸方）雑 益 200',
          '（借方）売 掛 金 500 / （貸方）現金過不足 500'
        ],
        correct: 1,
        explanation: {
          concept: '現金過不足の原因判明 ➔ 売掛金・雑損',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>借方残高の現金過不足の決算整理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                借方残高500円は<strong>現金が帳簿より不足している状態</strong>です。決算時に原因を調査した結果、
                売掛金の回収記帳漏れ300円が判明しました。
              </p>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方</div>
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>売 掛 金 300円</strong>（回収の記帳漏れを修正。売掛金を減らし忘れていたため借方で減少させる）</li>
                  <li><strong>雑 損 200円</strong>（原因不明の残額）</li>
                </ul>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方</div>
                <p class="text-xs">
                  <strong>現金過不足 500円</strong>を貸方に記入し、仮勘定の借方残高を相殺してゼロにします。
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>回収漏れだった売掛金は<strong>すでに入金（現金の増加）済みの状態</strong>。現金を再度増やすと二重計上になります。</li>
                  <li>借方残高（不足）は「雑損」、貸方残高（過剰）は「雑益」に振り替えます。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '所有する株式の配当金領収証200円を指定の金融機関に持参して現金で受け取り、ただちに全額を当店の普通預金口座へ預け入れた。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 200 / （貸方）受取配当金 200',
          '（借方）普通預金 200 / （貸方）現 金 200',
          '（借方）普通預金 200 / （貸方）受取配当金 200',
          '（借方）普通預金 200 / （貸方）有価証券利息 200'
        ],
        correct: 2,
        explanation: {
          concept: '配当金領収証 ➔ 普通預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>配当金領収証を即日預け入れた場合</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 考え方</div>
                <p class="text-xs">
                  配当金領収証を受け取った時点では<strong>「現金 / 受取配当金」</strong>と処理しますが、
                  <strong>「ただちに普通預金口座へ預け入れた」</strong>場合は、途中の「現金」を経由せず
                  <strong>「普通預金 / 受取配当金」</strong>と直接処理します。
                </p>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方（収益の発生）</div>
                <p class="text-xs">
                  株式の配当金は収益として<strong>「受取配当金」</strong>の貸方に記入します。
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>株式配当金は<strong>「受取配当金」</strong>。「有価証券利息」は公社債（国債・社債）の利子に使います。</li>
                  <li>「現金 200 / 受取配当金 200」で処理した後に預け入れる手続きは、本問の「ただちに預け入れた」条件では省略できます。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '売掛金800円の回収として、得意先負担の振込手数料100円が差し引かれた後の金額が当店の普通預金口座へ振り込まれた。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）普通預金 700 / （貸方）売 掛 金 800<br>（借方）支払手数料 100',
          '（借方）普通預金 800 / （貸方）売 掛 金 800',
          '（借方）普通預金 700 / （貸方）売 掛 金 700',
          '（借方）普通預金 800 / （貸方）売 掛 金 700<br>（貸方）受取手数料 100'
        ],
        correct: 1,
        explanation: {
          concept: '売掛金の回収 ➔ 手数料は得意先負担',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>振込手数料が得意先負担の場合</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ ポイント</div>
                <p class="text-xs">
                  振込手数料が<strong>「得意先（相手）負担」</strong>である場合、当店側では手数料の費用処理は行いません。
                  差し引かれた手数料は得意先が負担したものであり、当店の帳簿上では
                  売掛金800円が<strong>全額普通預金に入金された</strong>ものとして処理します。
                </p>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 仕訳</div>
                <p class="text-xs">
                  <strong>（借方）普通預金 800 / （貸方）売 掛 金 800</strong>
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>手数料負担が「当店」の場合</strong>は「支払手数料」を計上しますが、<strong>「得意先負担」の場合は手数料を当店で処理しません</strong>。</li>
                  <li>700円で入金されていても、当店の売掛金債権は800円全額が回収された扱いです。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '従業員が店舗の消耗品500円を購入し、代金を店舗の手元現金から支払った際、誤って普通預金口座からの引き落としとして帳簿に記帳していたことが判明した。本日行う修正仕訳として正しいものを選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）消 耗 品 費 500 / （貸方）現 金 500',
          '（借方）現 金 500 / （貸方）普通預金 500',
          '（借方）普通預金 500 / （貸方）現 金 500',
          '（借方）普通預金 500 / （貸方）消 耗 品 費 500'
        ],
        correct: 2,
        explanation: {
          concept: '訂正仕訳 ➔ 現金と普通預金の修正',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>誤った仕訳の訂正</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                正しい仕訳は <strong>（借）消耗品費 500 / （貸）現金 500</strong>。<br>
                誤って計上した仕訳は <strong>（借）消耗品費 500 / （貸）普通預金 500</strong>。
              </p>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 修正の考え方</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>借方の<strong>「消耗品費 500」は正しい</strong>ため修正不要</li>
                  <li>誤って減額していた<strong>「普通預金」を借方に戻す</strong>（＋500）</li>
                  <li>実際に減少していた<strong>「現金」を貸方に計上</strong>（−500）</li>
                </ul>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>「（借）消耗品費 / （貸）現金」は<strong>最初から正しく行うべき仕訳</strong>です。修正仕訳の借方は「普通預金」になります。</li>
                  <li>正しい処理での貸方（現金）と誤りの貸方（普通預金）を入れ替えるイメージです。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '買掛金600円を支払うため、普通預金口座から振り込んだ。なお、当店負担の振込手数料100円もあわせて同口座から引き落とされている。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）買 掛 金 600 / （貸方）普通預金 700<br>（借方）支払手数料 100',
          '（借方）買 掛 金 700 / （貸方）普通預金 700',
          '（借方）買 掛 金 500 / （貸方）普通預金 600<br>（借方）支払手数料 100',
          '（借方）買 掛 金 600 / （貸方）普通預金 600'
        ],
        correct: 0,
        explanation: {
          concept: '買掛金の支払い ➔ 普通預金＋支払手数料',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>買掛金の支払いと振込手数料</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方</div>
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>買 掛 金 600円</strong>（負債の減少）</li>
                  <li><strong>支払手数料 100円</strong>（費用の発生・当店負担分）</li>
                </ul>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方</div>
                <p class="text-xs">
                  買掛金の振込額600円と振込手数料100円の<strong>合計700円</strong>が普通預金口座から引き落とされたため、
                  資産の減少として<strong>「普通預金 700円」</strong>を貸方に記入します。
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>振込手数料を「買掛金」に加算（700）したり逆に減額（500）したりしないようにしましょう。</li>
                  <li>振込手数料は「支払手数料」で処理することが重要です。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '決算にあたり、現金過不足勘定（貸方残高500円）の原因を調べたところ、受取手数料300円の記入漏れが判明した。残額については原因不明のため、正しい決算整理仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）受取手数料 300 / （貸方）現金過不足 500<br>（借方）雑 損 200',
          '（借方）現金過不足 500 / （貸方）受取手数料 300<br>（貸方）雑 益 200',
          '（借方）現 金 500 / （貸方）受取手数料 300<br>（貸方）雑 益 200',
          '（借方）現金過不足 500 / （貸方）雑 益 500'
        ],
        correct: 1,
        explanation: {
          concept: '現金過不足の原因判明 ➔ 受取手数料・雑益',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>貸方残高の現金過不足の決算整理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                貸方残高500円は<strong>現金が実際より過剰（プラス）</strong>の状態です。
                原因のうち受取手数料300円の記入漏れが判明しました。
              </p>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方</div>
                <p class="text-xs">
                  仮勘定の貸方残高を打ち消すため<strong>「現金過不足 500円」</strong>を借方に記入します。
                </p>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方</div>
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>受取手数料 300円</strong>（収益の発生・記入漏れの修正）</li>
                  <li><strong>雑 益 200円</strong>（原因不明の残額・収益）</li>
                </ul>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>貸方残高（過剰）の場合は<strong>「雑益」</strong>、借方残高（不足）の場合は<strong>「雑損」</strong>に振り替えます。</li>
                  <li>現金の増減は期中の過不足発生時に<strong>すでに反映済み</strong>。決算時に再度「現金」を動かす必要はありません。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '期中に売上代金として受け取っていた公社債の期限到来利札100円（受取時に「現金」として処理済み）を金融機関で換金し、そのまま普通預金口座へ全額預け入れた。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）普通預金 100 / （貸方）有価証券利息 100',
          '（借方）普通預金 100 / （貸方）現 金 100',
          '（借方）現 金 100 / （貸方）有価証券利息 100',
          '（借方）普通預金 100 / （貸方）売 上 100'
        ],
        correct: 1,
        explanation: {
          concept: '公社債利札の換金 ➔ 普通預金への預け入れ',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>利札の換金（受け取り済みの現金を預け入れ）</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 考え方</div>
                <p class="text-xs">
                  公社債の期限到来利札は<strong>受取時に「現金 / 有価証券利息」と処理済み</strong>です。
                  本問では単に手元にある現金100円を<strong>普通預金口座へ預け入れる</strong>だけなので、
                  収益の計上は行いません。
                </p>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 仕訳</div>
                <p class="text-xs">
                  <strong>（借方）普通預金 100 / （貸方）現 金 100</strong>
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>「受取時に現金として処理済み」という条件を見落とすと、「有価証券利息」を計上する誤りをしがちです。</li>
                  <li>利札を受け取った時点と換金時点を区別しましょう。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '店舗の家賃800円が当店の普通預金口座から自動引き落としされた。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）支払家賃 800 / （貸方）当座預金 800',
          '（借方）受取家賃 800 / （貸方）普通預金 800',
          '（借方）支払家賃 800 / （貸方）普通預金 800',
          '（借方）支払家賃 800 / （貸方）現 金 800'
        ],
        correct: 2,
        explanation: {
          concept: '家賃の支払い ➔ 支払家賃・普通預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>家賃の自動引き落とし</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方（費用の発生）</div>
                <p class="text-xs">
                  店舗の家賃は費用の発生として<strong>「支払家賃」800円</strong>を借方に記入します。
                </p>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方（資産の減少）</div>
                <p class="text-xs">
                  <strong>普通預金口座</strong>から引き落とされたため、資産の減少として<strong>「普通預金 800円」</strong>を貸方に記入します。
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>「普通預金」から引き落とされたので貸方は「普通預金」です。「当座預金」や「現金」ではありません。</li>
                  <li>「受取家賃」は家賃を<strong>受け取った</strong>場合（収益）に使います。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '当期の決算において、現金の帳簿残高は500円であったが、実際有額は800円であった。原因はすべて不明であるため、正しい決算整理仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 300 / （貸方）雑 益 300',
          '（借方）雑 損 300 / （貸方）現 金 300',
          '（借方）現金過不足 300 / （貸方）雑 益 300',
          '（借方）現 金 300 / （貸方）現金過不足 300'
        ],
        correct: 0,
        explanation: {
          concept: '現金過不足の決算整理 ➔ 雑益',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>決算日の現金過不足（実際の方が多い）</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                帳簿残高500円に対して実際有額800円のため<strong>300円（800−500）の現金過剰</strong>です。
                帳簿残高を実際有額に合わせるため、<strong>現金を300円増加</strong>させます（借方：現金）。
              </p>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方（収益の発生）</div>
                <p class="text-xs">
                  決算期末で原因不明の過剰額は<strong>「雑益」300円</strong>（収益）に振り替えます。
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>決算時点で原因不明の場合は<strong>「現金過不足」ではなく直接「雑益」へ振り替え</strong>ます。</li>
                  <li>「雑損」になるのは<strong>現金が不足</strong>している場合です（実際の方が少ない）。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '商品900円を売り上げ、代金のうち300円は当店振り出しの小切手で受け取り、残額は普通預金口座へ振り込まれた。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 300 / （貸方）売 上 900<br>（借方）普通預金 600',
          '（借方）当座預金 300 / （貸方）売 上 900<br>（借方）普通預金 600',
          '（借方）小 切 手 300 / （貸方）売 上 900<br>（借方）普通預金 600',
          '（借方）普通預金 900 / （貸方）売 上 900'
        ],
        correct: 1,
        explanation: {
          concept: '自己振出小切手の回収 ➔ 当座預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>当店（自己）振出の小切手を回収した場合</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方</div>
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>当座預金 300円</strong>（自己振出小切手の回収＝当座預金の復元）</li>
                  <li><strong>普通預金 600円</strong>（振込分）</li>
                </ul>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方</div>
                <p class="text-xs">
                  商品900円を販売したため、収益の発生として<strong>「売上 900円」</strong>を貸方に記入します。
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>「当店（自己）振り出しの小切手」</strong>を回収した場合は当座預金で処理します。他店振出（現金）との違いに注意。</li>
                  <li>「小切手」という勘定科目は存在しません。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '出張中の従業員へ手渡していた旅費の仮払金300円のうち、実際の旅費交通費は200円であった。残額100円は現金で返還を受け、ただちに普通預金口座へ預け入れた。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）旅費交通費 200 / （貸方）仮 払 金 300<br>（借方）現 金 100',
          '（借方）旅費交通費 200 / （貸方）仮 払 金 300<br>（借方）普通預金 100',
          '（借方）旅費交通費 300 / （貸方）仮 払 金 300',
          '（借方）仮 払 金 300 / （貸方）旅費交通費 200<br>（貸方）普通預金 100'
        ],
        correct: 1,
        explanation: {
          concept: '仮払金の清算 ➔ 普通預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>仮払金の清算と余剰金の預け入れ</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方</div>
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>旅費交通費 200円</strong>（費用の発生・実際にかかった旅費）</li>
                  <li><strong>普通預金 100円</strong>（返還金を直接普通預金口座へ入金）</li>
                </ul>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方</div>
                <p class="text-xs">
                  仮払金300円を<strong>全額消去</strong>します（資産・仮払金の減少）。
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed>
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>返還された100円を「現金」で一度受けてから預け入れるのではなく、<strong>「普通預金」に直接計上</strong>するのが本問のポイントです。</li>
                  <li>仮払金は預けた時点では費用ではなく<strong>資産（仮払金）</strong>として処理されていることにも注意。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '備品800円を購入し、代金は後払いとした。また、納品時の発送費用100円は現金で支払った。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）備 品 800 / （貸方）買 掛 金 800<br>（借方）支払運賃 100 / （貸方）現 金 100',
          '（借方）備 品 900 / （貸方）買 掛 金 800<br>（貸方）現 金 100',
          '（借方）備 品 900 / （貸方）未 払 金 800<br>（貸方）現 金 100',
          '（借方）備 品 800 / （貸方）未 払 金 800<br>（借方）支払運賃 100 / （貸方）現 金 100'
        ],
        correct: 2,
        explanation: {
          concept: '固定資産の取得 ➔ 付随費用は取得原価に含める',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>固定資産の付随費用の処理</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方（取得原価）</div>
                <p class="text-xs">
                  固定資産の購入にかかった<strong>付随費用（発送費用100円）は取得原価に含め</strong>ます。
                  したがって備品は <strong>800円＋100円＝900円</strong> となります。
                </p>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方</div>
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>未 払 金 800円</strong>（商品以外の後払い代金は「未払金」）</li>
                  <li><strong>現 金 100円</strong>（現金で支払った付随費用）</li>
                </ul>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>付随費用を<strong>「支払運賃」などの独立した費用</strong>で処理するのは誤り。取得原価に含めます。</li>
                  <li>商品以外の購入の後払いは<strong>「未払金」</strong>。「買掛金」は商品仕入に使います。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '期中に生じた現金過不足（借方残高100円）について、決算日までに原因が判明しなかった。正しい決算整理仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）雑 損 100 / （貸方）現 金 100',
          '（借方）雑 損 100 / （貸方）現金過不足 100',
          '（借方）現金過不足 100 / （貸方）雑 益 100',
          '（借方）現 金 100 / （貸方）現金過不足 100'
        ],
        correct: 1,
        explanation: {
          concept: '現金過不足の決算整理 ➔ 雑損',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>借方残高の現金過不足を決算整理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                期中に計上していた<strong>「現金過不足」（借方残高100円＝現金不足）</strong>の原因が決算日までに判明しなかったため、
                <strong>「雑損」（費用）</strong>へ振り替えます。
              </p>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 仕訳</div>
                <p class="text-xs">
                  借方の<strong>「雑損 100円」</strong>（費用の発生）と、現金過不足勘定を相殺消去するための<strong>貸方「現金過不足 100円」</strong>。
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed>
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>現金の減少は期中の過不足発生時にすでに反映済みです。決算整理では「現金過不足」勘定を消去します。</li>
                  <li>借方残高（不足）→「雑損」、貸方残高（過剰）→「雑益」と決まっています。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '商品500円を仕入れ、代金は普通預金口座から振り込んで支払った。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）仕 入 500 / （貸方）当座預金 500',
          '（借方）仕 入 500 / （貸方）普通預金 500',
          '（借方）仕 入 500 / （貸方）現 金 500',
          '（借方）仕 入 500 / （貸方）買 掛 金 500'
        ],
        correct: 1,
        explanation: {
          concept: '仕入の支払い ➔ 普通預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>商品仕入の代金を普通預金から支払い</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方（費用の発生）</div>
                <p class="text-xs">
                  商品を仕入れたため<strong>「仕入」500円</strong>を借方に記入します。
                </p>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed>
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方（資産の減少）</div>
                <p class="text-xs">
                  普通預金口座から振り込んだため、資産の減少として<strong>「普通預金 500円」</strong>を貸方に記入します。
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed>
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>「普通預金」から支払ったので貸方は「普通預金」です。「当座預金」「現金」は不適切です。</li>
                  <li>「買掛金」は掛けで仕入れた場合に使います。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '水道光熱費200円および通信費100円が当店の普通預金口座から自動引き落としされた。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）水道光熱費 200 / （貸方）普通預金 300<br>（借方）通 信 費 100',
          '（借方）水道光熱費 200 / （貸方）当座預金 300<br>（借方）通 信 費 100',
          '（借方）水道光熱費 200 / （貸方）現 金 300<br>（借方）通 信 費 100',
          '（借方）雑 費 300 / （貸方）普通預金 300'
        ],
        correct: 0,
        explanation: {
          concept: '複数費用の引き落とし ➔ 普通預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>複数費用が同一口座から引き落とし</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed>
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方（費用の発生）</div>
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>水道光熱費 200円</strong></li>
                  <li><strong>通 信 費 100円</strong></li>
                </ul>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed>
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方（資産の減少）</div>
                <p class="text-xs">
                  各費用の<strong>合計300円</strong>が普通預金口座から引き落とされたため、
                  資産の減少として<strong>「普通預金 300円」</strong>を貸方にまとめます。
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed>
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>複数の費用をまとめて<strong>「雑費」</strong>にするのは誤り。各費用勘定に分けて計上します。</li>
                  <li>「普通預金」から引き落とされたので「当座預金」や「現金」は不適切です。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '本日、取引先より売掛金400円が普通預金口座に振り込まれたが、担当者が誤って「現金」の増加として処理していた。本日行う修正仕訳として正しいものを選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）普通預金 400 / （貸方）売 掛 金 400',
          '（借方）現 金 400 / （貸方）普通預金 400',
          '（借方）普通預金 400 / （貸方）現 金 400',
          '（借方）売 掛 金 400 / （貸方）現 金 400'
        ],
        correct: 2,
        explanation: {
          concept: '訂正仕訳 ➔ 現金を普通預金に修正',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>誤って現金と処理した売掛金回収の訂正</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                誤った仕訳は <strong>（借）現金 400 / （貸）売掛金 400</strong>。<br>
                正しい仕訳は <strong>（借）普通預金 400 / （貸）売掛金 400</strong>。
              </p>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed>
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 修正仕訳</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>間違えて計上した<strong>「現金」を貸方に戻す</strong>（−400）</li>
                  <li>正しく増加すべき<strong>「普通預金」を借方に計上</strong>（＋400）</li>
                  <li>貸方の「売掛金」は正しいため修正不要</li>
                </ul>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed>
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>「現金 400 / 普通預金 400」は逆。借方に増やすべきは「普通預金」、減らすべきは「現金」です。</li>
                  <li>「売掛金」を動かすと二重に回収仕訳されてしまうため、貸方の売掛金には触れません。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '決算にあたり、現金過不足勘定（借方残高500円）のうち、300円は支払手数料の記帳漏れであることが判明し、残額は原因不明であった。正しい決算整理仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）支払手数料 300 / （貸方）現金過不足 500<br>（借方）雑 損 200',
          '（借方）現金過不足 500 / （貸方）支払手数料 300<br>（貸方）雑 益 200',
          '（借方）支払手数料 300 / （貸方）現 金 500<br>（借方）雑 損 200',
          '（借方）支払手数料 300 / （貸方）現金過不足 300'
        ],
        correct: 0,
        explanation: {
          concept: '現金過不足の決算整理 ➔ 支払手数料・雑損',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>借方残高の過不足（原因一部判明）</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed>
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方</div>
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>支払手数料 300円</strong>（記帳漏れと判明した費用）</li>
                  <li><strong>雑 損 200円</strong>（原因不明の残額・費用）</li>
                </ul>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed>
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方</div>
                <p class="text-xs">
                  現金過不足勘定の借方残高500円を<strong>相殺消去</strong>するため貸方に<strong>「現金過不足 500円」</strong>を記入します。
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed>
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>借方残高（不足）の場合は<strong>「雑損」</strong>です。「雑益」は貸方残高（過剰）の場合に使います。</li>
                  <li>現金の減少は期中に反映済み。決算時は「現金過不足」を消去します。</li>
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
    questions: [
{
        text: '小口係より用度係へ、小口資金の前渡額として小切手500円を振り出して交付した。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）小口現金 500 / （貸方）現 金 500',
          '（借方）小口現金 500 / （貸方）当座預金 500',
          '（借方）小口現金 500 / （貸方）普通預金 500',
          '（借方）当座預金 500 / （貸方）小口現金 500'
        ],
        correct: 1,
        explanation: {
          concept: '小口資金の前渡 ➔ 当座預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>小口資金の前渡（小切手）</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方（資産の増加）</div>
                <p class="text-xs">
                  小口資金を前渡するため、資産の増加として<strong>「小口現金 500円」</strong>を借方に記入します。
                </p>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方（資産の減少）</div>
                <p class="text-xs">
                  小切手を振り出して交付したため、資産の減少として<strong>「当座預金 500円」</strong>を貸方に記入します。
                </p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 誤りやすいポイント</div>
                <ul class="list-disc list-inside space-y-1">
                  <li>小切手を振り出した場合、貸方は「当座預金」の減少です。「現金」や「普通預金」ではありません。</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      {
        text: '用度係より、タクシー代300円および文房具代200円の支払報告を受けた（補給なし）。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）旅費交通費 300 / （貸方）小口現金 500<br>（借方）消耗品費 200',
          '（借方）旅費交通費 300 / （貸方）現 金 500<br>（借方）消耗品費 200',
          '（借方）旅費交通費 300 / （貸方）当座預金 500<br>（借方）消耗品費 200',
          '（借方）小口現金 500 / （貸方）現 金 500'
        ],
        correct: 0,
        explanation: {
          concept: '小口現金の支払報告 ➔ 費用の認識',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>支払報告時（補給なし）</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方（費用の発生）</div>
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>旅費交通費 300円</strong>（タクシー代）</li>
                  <li><strong>消耗品費 200円</strong>（文房具代）</li>
                </ul>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方（資産の減少）</div>
                <p class="text-xs">
                  補給なしのため、小口現金の<strong>合計500円</strong>の減少として<strong>「小口現金」</strong>を貸方に記入します。
                </p>
              </div>
            </div>
          `
        }
      },
      {
        text: '用度係より電話代400円と切手代200円の支払報告を受け、ただちに同額の小切手を振り出して本日補給した。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）通 信 費 600 / （貸方）当座預金 600',
          '（借方）通 信 費 600 / （貸方）小口現金 600',
          '（借方）小口現金 600 / （貸方）当座預金 600',
          '（借方）通 信 費 600 / （貸方）現 金 600'
        ],
        correct: 0,
        explanation: {
          concept: '支払報告と同時補給 ➔ 直接処理',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>報告と同時に即時補給する場合</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                報告と補給が同時の場合は、小口現金を介さず<strong>直接「費用（借方）/ 当座預金（貸方）」</strong>で処理します。
              </p>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方（費用の発生）</div>
                <p class="text-xs">電話代・切手代は<strong>「通信費」600円</strong>として借方に計上します。</p>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方（資産の減少）</div>
                <p class="text-xs">小切手を振り出したため<strong>「当座預金 600円」</strong>を貸方に計上します。</p>
              </div>
            </div>
          `
        }
      },
      {
        text: '用度係より電気代800円の支払報告を受けた。なお、補給は後日行うこととした。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '仕訳なし',
          '（借方）水道光熱費 800 / （貸方）当座預金 800',
          '（借方）水道光熱費 800 / （貸方）小口現金 800',
          '（借方）水道光熱費 800 / （貸方）未 払 金 800'
        ],
        correct: 2,
        explanation: {
          concept: '支払報告のみ ➔ 小口現金の減少',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>報告のみで補給しない場合</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方（費用の発生）</div>
                <p class="text-xs">電気代は<strong>「水道光熱費」800円</strong>として借方に計上します。</p>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方（資産の減少）</div>
                <p class="text-xs">補給は後日のため、小口現金の減少として<strong>「小口現金 800円」</strong>を貸方に計上します。</p>
              </div>
            </div>
          `
        }
      },
      {
        text: '週末に用度係から旅費交通費700円の支払報告を受けたため、直ちに現金で補給を行った。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）旅費交通費 700 / （貸方）当座預金 700',
          '（借方）旅費交通費 700 / （貸方）現 金 700',
          '（借方）小口現金 700 / （貸方）現 金 700',
          '（借方）旅費交通費 700 / （貸方）小口現金 700'
        ],
        correct: 1,
        explanation: {
          concept: '報告と同時に現金で補給 ➔ 直接処理',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>報告と同時に現金で補給する場合</span>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 借方（費用の発生）</div>
                <p class="text-xs">旅費交通費の<strong>「費用」700円</strong>を借方に計上します。</p>
              </div>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 貸方（資産の減少）</div>
                <p class="text-xs"><strong>現金で補給</strong>したため、<strong>「現金 700円」</strong>を貸方に計上します。</p>
              </div>
            </div>
          `
        }
      },
      {
        text: '小口資金の前渡枠を増額するため、用度係へ小切手300円を追加交付した。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）小口現金 300 / （貸方）当座預金 300',
          '（借方）当座預金 300 / （貸方）小口現金 300',
          '（借方）小口現金 300 / （貸方）現 金 300',
          '仕訳なし'
        ],
        correct: 0,
        explanation: {
          concept: '前渡枠の増額 ➔ 追加交付',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>小口資金の追加交付</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                前渡枠の増額や追加設定の際も、初回交付時と同様に<strong>借方「小口現金」、貸方「当座預金」</strong>で処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '決算にあたり、用度係の手元にある小口現金の未報告分（雑費200円）があることが判明した。適切な決算整理仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '仕訳なし',
          '（借方）雑 費 200 / （貸方）当座預金 200',
          '（借方）雑 費 200 / （貸方）小口現金 200',
          '（借方）小口現金 200 / （貸方）雑 費 200'
        ],
        correct: 2,
        explanation: {
          concept: '決算時の未報告分 ➔ 費用計上',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>決算時の未報告分の処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                決算時には未報告の支払分も<strong>当期の費用として計上</strong>し、小口現金を減額処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '用度係より、お茶代100円（接待交際費）およびノート代200円（消耗品費）の支払報告を受けた（補給なし）。適切な仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）接待交際費 100 / （貸方）小口現金 300<br>（借方）消耗品費 200',
          '（借方）雑 費 300 / （貸方）小口現金 300',
          '（借方）接待交際費 100 / （貸方）当座預金 300<br>（借方）消耗品費 200',
          '（借方）小口現金 300 / （貸方）現 金 300'
        ],
        correct: 0,
        explanation: {
          concept: '費用の分類 ➔ 接待交際費・消耗品費',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>用途に応じた費用の分類</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                用途に応じて<strong>「接待交際費」と「消耗品費」</strong>に分けて計上し、合計額を小口現金の減少とします。
              </p>
            </div>
          `
        }
      },
      {
        text: '前週に支払報告を受けていた400円（報告時に費用処理済み）について、本日、同額の小切手を振り出して用度係に補給した。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）各費用勘定 400 / （貸方）当座預金 400',
          '（借方）小口現金 400 / （貸方）当座預金 400',
          '（借方）小口現金 400 / （貸方）現 金 400',
          '仕訳なし'
        ],
        correct: 1,
        explanation: {
          concept: '後日の補給 ➔ 小口現金の回復',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>報告後に補給する場合</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                報告時に費用処理が完了している場合、後日の補給時には<strong>「小口現金（借）/ 当座預金（貸）」</strong>と仕訳します。
              </p>
            </div>
          `
        }
      },
      {
        text: '小口現金の実査を行ったところ、帳簿残高900円に対し実際有額は800円であった（原因不明）。適切な処理を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）現金過不足 100 / （貸方）小口現金 100',
          '（借方）雑 損 100 / （貸方）小口現金 100',
          '（借方）小口現金 100 / （貸方）現金過不足 100',
          '（借方）現金過不足 100 / （貸方）現 金 100'
        ],
        correct: 0,
        explanation: {
          concept: '小口現金の実査 ➔ 現金過不足',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>小口現金も「現金過不足」を用いる</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                小口現金であっても、期中の手元実額とのズレは<strong>「現金過不足」勘定</strong>を用いて実際有額へ合わせます。
              </p>
            </div>
          `
        }
      },
      {
        text: '用度係より郵送代300円の支払報告を受けたため、普通預金口座から即時引き落としにより補給を行った。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）通 信 費 300 / （貸方）普通預金 300',
          '（借方）通 信 費 300 / （貸方）小口現金 300',
          '（借方）小口現金 300 / （貸方）普通預金 300',
          '（借方）通 信 費 300 / （貸方）現 金 300'
        ],
        correct: 0,
        explanation: {
          concept: '同時補給 ➔ 出金元に応じた処理',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>普通預金から同時補給する場合</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                支払報告と同時補給の場合、出金元（本問では普通預金）を貸方に計上し、費用を借方に計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '小口資金の減額に伴い、用度係から手元資金のうち200円の返還を現金で受け取った。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 200 / （貸方）小口現金 200',
          '（借方）小口現金 200 / （貸方）現 金 200',
          '（借方）当座預金 200 / （貸方）小口現金 200',
          '仕訳なし'
        ],
        correct: 0,
        explanation: {
          concept: '小口資金の返還 ➔ 受取',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>小口資金の返還を受けた場合</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                小口資金の返還を受けた場合、手元現金（資産）の増加を借方に、小口現金（資産）の減少を貸方に計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '用度係より、文具代100円の支払報告とともに残額の現金400円が返還され、小口現金制度を廃止した。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）消耗品費 100 / （貸方）小口現金 500<br>（借方）現 金 400',
          '（借方）消耗品費 100 / （貸方）当座預金 500<br>（借方）現 金 400',
          '（借方）小口現金 500 / （貸方）現 金 500',
          '（借方）雑 費 500 / （貸方）小口現金 500'
        ],
        correct: 0,
        explanation: {
          concept: '小口現金制度の廃止 ➔ 精算',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>制度廃止時の精算処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                制度廃止時には、未処理の費用（借方）と返還された現金（借方）を計上し、小口現金勘定（全額）を消去します。
              </p>
            </div>
          `
        }
      },
      {
        text: '小口現金の実査を行った際、帳簿残高400円に対し実際有額が500円であった（原因不明）。適切な期中処理を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）小口現金 100 / （貸方）現金過不足 100',
          '（借方）現金過不足 100 / （貸方）小口現金 100',
          '（借方）小口現金 100 / （貸方）雑 益 100',
          '（借方）現 金 100 / （貸方）小口現金 100'
        ],
        correct: 0,
        explanation: {
          concept: '小口現金の実査 ➔ 過剰の場合',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>実際有額が多い場合</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                実際有額が多い場合は、帳簿上の小口現金を増加（借方）させ、相手勘定を<strong>「現金過不足」（貸方）</strong>とします。
              </p>
            </div>
          `
        }
      },
      {
        text: '用度係より電車代200円の支払報告を受け、小切手を振り出して補給した。ただし、報告時に誤って「旅費交通費200円 / 小口現金200円」と記帳していた。本日行う補給の正当な仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）小口現金 200 / （貸方）当座預金 200',
          '（借方）旅費交通費 200 / （貸方）当座預金 200',
          '（借方）当座預金 200 / （貸方）小口現金 200',
          '仕訳なし'
        ],
        correct: 0,
        explanation: {
          concept: '報告後の補給 ➔ 小口現金の回復',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>報告後の補給仕訳</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                既に報告時点で小口現金を減額処理しているため、補給時には<strong>「小口現金」を増加（借方）</strong>させる仕訳を行います。
              </p>
            </div>
          `
        }
      },
      {
        text: '決算にあたり、小口現金過不足（借方残高100円）の原因が判明しなかったため整理を行う。正しい決算整理仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）雑 損 100 / （貸方）現金過不足 100',
          '（借方）現金過不足 100 / （貸方）雑 益 100',
          '（借方）雑 損 100 / （貸方）小口現金 100',
          '（借方）雑 益 100 / （貸方）現金過不足 100'
        ],
        correct: 0,
        explanation: {
          concept: '決算整理 ➔ 雑損',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>借方残高の現金過不足の決算整理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                借方残高の現金過不足を打ち消すため貸方に記入し、相手勘定を<strong>「雑損」（費用）</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '用度係より、備品修理代400円の支払報告を受けた（補給なし）。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）修 繕 費 400 / （貸方）小口現金 400',
          '（借方）備 品 400 / （貸方）小口現金 400',
          '（借方）修 繕 費 400 / （貸方）当座預金 400',
          '（借方）雑 費 400 / （貸方）小口現金 400'
        ],
        correct: 0,
        explanation: {
          concept: '修理代の処理 ➔ 修繕費',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>備品の修理代の処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                建物の維持や修繕のための支払いは<strong>「修繕費」（費用）</strong>の発生として借方に計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '用度係より、取引先への祝電代200円の支払報告を受けた（補給なし）。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）接待交際費 200 / （貸方）小口現金 200',
          '（借方）通 信 費 200 / （貸方）小口現金 200',
          '（借方）雑 費 200 / （貸方）小口現金 200',
          '（借方）接待交際費 200 / （貸方）当座預金 200'
        ],
        correct: 0,
        explanation: {
          concept: '祝電代の処理 ➔ 接待交際費',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>取引先への祝電代の処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                取引先に対する慶弔関連や贈答の費用は<strong>「接待交際費」（費用）</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '期首において、小口資金前渡額600円を当座預金口座から引き出して用度係に手渡した。正しい仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）小口現金 600 / （貸方）当座預金 600',
          '（借方）小口現金 600 / （貸方）現 金 600',
          '（借方）当座預金 600 / （貸方）小口現金 600',
          '（借方）現 金 600 / （貸方）当座預金 600'
        ],
        correct: 0,
        explanation: {
          concept: '小口資金の新規前渡 ➔ 設定',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>新規前渡（設定）の仕訳</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                小口資金の新規前渡（設定）の仕訳であり、借方に<strong>「小口現金」</strong>、貸方に<strong>「当座預金」</strong>を計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '決算日において、用度係から未報告であった消耗品費300円の支払報告を受けるとともに、同時に同額を小切手を振り出して補給した。正しい決算整理仕訳を選択しなさい。',
        type: 'shiwake',
        choices: [
          '（借方）消 耗 品 費 300 / （貸方）当座預金 300',
          '（借方）消 耗 品 費 300 / （貸方）小口現金 300',
          '（借方）小口現金 300 / （貸方）当座預金 300',
          '（借方）消 耗 品 費 300 / （貸方）現 金 300'
        ],
        correct: 0,
        explanation: {
          concept: '決算日同時補給 ➔ 直接処理',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>決算日でも同時補給は直接処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                決算日であっても、報告と補給を同時に行う場合は<strong>「各費用（借方）/ 当座預金（貸方）」</strong>で直接処理します。
              </p>
            </div>
          `
        }
      }
    ]
  },
  {
    id: 'lvl_3',
    level: 3,
    title: '売上の平原',
    subtitle: '仕入（費用の発生）と売上（収益の発生）の基本ルールと、発送費・諸掛りの処理。',
    url: 'http://localhost:3001/guides/sales-and-purchases',
    tags: ['費用', '収益', '仕入', '売上', '諸掛り'],
    questions: [
{
        text: '商品500円を売り上げ、代金は掛けとした。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 500 / （貸方）売 上 500',
          '（借方）売 上 500 / （貸方）売 掛 金 500',
          '（借方）売 掛 金 500 / （貸方）売 上 500',
          '（借方）買 掛 金 500 / （貸方）仕 入 500'
        ],
        correct: 2,
        explanation: {
          concept: '売上の掛け ➔ 売掛金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>掛け売上の処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                代金を後日受け取る権利が生じたため、<strong>「売掛金（資産）」の増加</strong>として借方に計上します。
              </p>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 仕訳</div>
                <p class="text-xs"><strong>（借方）売 掛 金 500 / （貸方）売 上 500</strong></p>
              </div>
            </div>
          `
        }
      },
      {
        text: '商品300円を売り上げ、代金は得意先振出の小切手で受け取った。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 300 / （貸方）売 上 300',
          '（借方）当座預金 300 / （貸方）売 上 300',
          '（借方）受取手形 300 / （貸方）売 上 300',
          '（借方）売 上 300 / （貸方）当座預金 300'
        ],
        correct: 0,
        explanation: {
          concept: '他人振出小切手 ➔ 現金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>他人振出小切手の受取</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                他人（他店）が振り出した小切手を受け取った場合は、すぐに換金できるため<strong>「現金」の増加</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品400円を売り上げ、代金として以前に当店が振り出した小切手を受け取った。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 400 / （貸方）売 上 400',
          '（借方）当座預金 400 / （貸方）売 上 400',
          '（借方）支払手形 400 / （貸方）売 上 400',
          '（借方）売 上 400 / （貸方）現 金 400'
        ],
        correct: 1,
        explanation: {
          concept: '自己振出小切手の回収 ➔ 当座預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>自己振出小切手の回収</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                自己（当店）が振り出した小切手を受け取った場合は、<strong>「当座預金」の増加（減少の取り消し）</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品600円を売り上げ、代金のうち200円は注文時に受け取った手付金と相殺し、残額は掛けとした。',
        type: 'shiwake',
        choices: [
          '（借方）前 払 金 200 / （貸方）売 上 600<br>（借方）売 掛 金 400',
          '（借方）現 金 200 / （貸方）売 上 600<br>（借方）売 掛 金 400',
          '（借方）売 掛 金 600 / （貸方）売 上 400<br>（貸方）前 受 金 200',
          '（借方）前 受 金 200 / （貸方）売 上 600<br>（借方）売 掛 金 400'
        ],
        correct: 3,
        explanation: {
          concept: '前受金の取り崩し ➔ 複合仕訳',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>注文時の手付金（前受金）の処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                販売前に受け取っていた手付金は<strong>「前受金（負債）」</strong>として計上されているため、売上時にこれを取り崩します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品800円を売り上げ、代金は掛けとした。なお、当店負担の発送費100円は現金で支払った。',
        type: 'shiwake',
        choices: [
          '（借方）売 掛 金 800 / （貸方）売 上 900<br>（借方）発 送 費 100',
          '（借方）売 掛 金 800 / （貸方）売 上 800<br>（借方）発 送 費 100 / （貸方）現 金 100',
          '（借方）売 掛 金 900 / （貸方）売 上 800<br>（貸方）現 金 100',
          '（借方）売 掛 金 700 / （貸方）売 上 800<br>（借方）発 送 費 100'
        ],
        correct: 1,
        explanation: {
          concept: '当店負担の発送費 ➔ 発送費',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>当店負担の発送費の処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                当店負担の発送費は、売上とは別に<strong>「発送費（費用）」</strong>として借方に計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品700円を売り上げ、代金は掛けとした。なお、先方負担の発送費100円を現金で立て替え払いし、商品代金に含めて請求した。',
        type: 'shiwake',
        choices: [
          '（借方）売 掛 金 800 / （貸方）売 上 700<br>（貸方）現 金 100',
          '（借方）売 掛 金 700 / （貸方）売 上 800<br>（借方）発 送 費 100',
          '（借方）売 掛 金 700 / （貸方）売 上 700<br>（借方）立 替 金 100 / （貸方）現 金 100',
          '（借方）売 掛 金 800 / （貸方）売 上 800'
        ],
        correct: 0,
        explanation: {
          concept: '先方負担の発送費 ➔ 商品代金に含める',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>立て替えた発送費を商品代金に含めて請求</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                先方負担の発送費を商品代金に含める場合、その立替分も含めた<strong>総額を「売掛金」</strong>として計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品500円を売り上げ、代金は掛けとした。なお、先方負担の発送費100円を現金で支払い、立替金として処理した。',
        type: 'shiwake',
        choices: [
          '（借方）売 掛 金 600 / （貸方）売 上 500<br>（貸方）現 金 100',
          '（借方）売 掛 金 500 / （貸方）売 上 600<br>（借方）発 送 費 100',
          '（借方）売 掛 金 500 / （貸方）売 上 500<br>（借方）立 替 金 100 / （貸方）現 金 100',
          '（借方）売 掛 金 500 / （貸方）売 上 400<br>（貸方）現 金 100'
        ],
        correct: 2,
        explanation: {
          concept: '立替金として処理 ➔ 立替金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>立替金として区別して処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                商品代金と区別して処理する指示があるため、立て替えた発送費は<strong>「立替金（資産）」</strong>として計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品900円を売り上げ、代金は得意先宛の約束手形を振り出し、同店の引き受けを得た。',
        type: 'shiwake',
        choices: [
          '（借方）売 掛 金 900 / （貸方）売 上 900',
          '（借方）支払手形 900 / （貸方）売 上 900',
          '（借方）受取手形 900 / （貸方）売 上 900',
          '（借方）未収入金 900 / （貸方）売 上 900'
        ],
        correct: 2,
        explanation: {
          concept: '為替手形の引き受け ➔ 受取手形',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>得意先が引き受けた手形</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                自らが振り出した手形であっても、得意先が引き受けた（支払いを約束した）場合は<strong>「受取手形」</strong>となります。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品500円をクレジット払いの条件で売り上げた。なお、信販会社への支払手数料100円を計上し、残額は後日入金される。',
        type: 'shiwake',
        choices: [
          '（借方）クレジット売掛金 500 / （貸方）売 上 400<br>（貸方）受取手数料 100',
          '（借方）クレジット売掛金 400 / （貸方）売 上 500<br>（借方）支払手数料 100',
          '（借方）売 掛 金 400 / （貸方）売 上 500<br>（借方）支払手数料 100',
          '（借方）未収入金 400 / （貸方）売 上 500<br>（借方）支払手数料 100'
        ],
        correct: 1,
        explanation: {
          concept: 'クレジット売上 ➔ クレジット売掛金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>クレジット売上の処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                クレジット売上の未収分は<strong>「クレジット売掛金」</strong>とし、販売時に負担する手数料は<strong>「支払手数料」</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品800円を売り上げ、代金のうち300円は同店振出の小切手で受け取り、残額は掛けとした。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 300 / （貸方）売 上 800<br>（借方）売 掛 金 500',
          '（借方）当座預金 300 / （貸方）売 上 800<br>（借方）売 掛 金 500',
          '（借方）現 金 300 / （貸方）売 上 800<br>（借方）未収入金 500',
          '（借方）受取手形 300 / （貸方）売 上 800<br>（借方）売 掛 金 500'
        ],
        correct: 0,
        explanation: {
          concept: '小切手と掛けの複合仕訳 ➔ 現金・売掛金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>受取手段が異なる複合仕訳</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                他人振出小切手は<strong>「現金」</strong>、残りの掛け代金は<strong>「売掛金」</strong>として借方に複合仕訳を行います。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に掛けで売り上げていた商品につき、品違いのため200円の返品を受け、売掛金から減額した。',
        type: 'shiwake',
        choices: [
          '（借方）売 掛 金 200 / （貸方）売 上 200',
          '（借方）仕 入 200 / （貸方）売 掛 金 200',
          '（借方）売 上 200 / （貸方）買 掛 金 200',
          '（借方）売 上 200 / （貸方）売 掛 金 200'
        ],
        correct: 3,
        explanation: {
          concept: '売上返品 ➔ 売上の取消し',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>掛け売上の返品処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                返品（売上戻り）が生じた場合、販売時の仕訳を逆にして<strong>売上と売掛金をそれぞれ取り消し</strong>ます。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に現金で売り上げていた商品につき、キズがあったため100円の返品を受け、同額を現金で返金した。',
        type: 'shiwake',
        choices: [
          '（借方）売 掛 金 100 / （貸方）現 金 100',
          '（借方）現 金 100 / （貸方）売 上 100',
          '（借方）売 上 100 / （貸方）現 金 100',
          '（借方）売 上 100 / （貸方）当座預金 100'
        ],
        correct: 2,
        explanation: {
          concept: '現金売上の返品 ➔ 現金返金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>現金売上の返品処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                現金で返金したため貸方に<strong>「現金」</strong>を計上し、借方で返品分の<strong>「売上」を取り消し</strong>ます。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品700円を売り上げ、代金につき取引銀行を通じて電子記録債権の発生記録を行った。',
        type: 'shiwake',
        choices: [
          '（借方）受取手形 700 / （貸方）売 上 700',
          '（借方）電子記録債権 700 / （貸方）売 上 700',
          '（借方）売 掛 金 700 / （貸方）電子記録債務 700',
          '（借方）売 上 700 / （貸方）電子記録債権 700'
        ],
        correct: 1,
        explanation: {
          concept: '電子記録債権の発生 ➔ 売上',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>電子記録債権で決済する売上</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                電子記録債権が発生した場合は、<strong>「電子記録債権（資産）」</strong>を借方に計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品500円を売り上げ、代金は同業他社が発行した商品券300円と、現金200円で受け取った。',
        type: 'shiwake',
        choices: [
          '（借方）受取商品券 300 / （貸方）売 上 500<br>（借方）現 金 200',
          '（借方）商 品 券 300 / （貸方）売 上 500<br>（借方）現 金 200',
          '（借方）他店商品券 500 / （貸方）売 上 500',
          '（借方）売 上 500 / （貸方）受取商品券 300<br>（貸方）現 金 200'
        ],
        correct: 0,
        explanation: {
          concept: '他社発行の商品券 ➔ 受取商品券',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>他店発行の商品券の受取</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                他店が発行した商品券を受け取った場合は、<strong>「受取商品券（資産）」</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品400円を現金で売り上げていたが、誤って借方を売掛金として起票していた。本日、誤りを発見したためこれを訂正する。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 400 / （貸方）売 上 400',
          '（借方）売 上 400 / （貸方）売 掛 金 400',
          '（借方）売 掛 金 400 / （貸方）現 金 400',
          '（借方）現 金 400 / （貸方）売 掛 金 400'
        ],
        correct: 3,
        explanation: {
          concept: '訂正仕訳 ➔ 売掛金を現金に修正',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>誤った勘定科目の訂正</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                誤って計上した<strong>売掛金を貸方で取り消し</strong>、正しい勘定科目である<strong>現金を借方</strong>に計上して訂正します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品800円を売り上げ、代金として得意先が受け取っていた配当金領収証300円と、現金500円を受け取った。',
        type: 'shiwake',
        choices: [
          '（借方）受取配当金 300 / （貸方）売 上 800<br>（借方）現 金 500',
          '（借方）当座預金 300 / （貸方）売 上 800<br>（借方）現 金 500',
          '（借方）現 金 800 / （貸方）売 上 800',
          '（借方）有価証券 300 / （貸方）売 上 800<br>（借方）現 金 500'
        ],
        correct: 2,
        explanation: {
          concept: '配当金領収証 ➔ 通貨代用証券',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>配当金領収証は現金として処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                配当金領収証（株式配当金領収証）はすぐに換金可能な<strong>「通貨代用証券」</strong>であるため、現金に含めて処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品600円を売り上げ、代金は普通預金口座に振り込まれた。なお、当店負担の振込手数料100円が差し引かれ、実際には500円が入金された。',
        type: 'shiwake',
        choices: [
          '（借方）普通預金 500 / （貸方）売 上 600<br>（借方）売上値引 100',
          '（借方）普通預金 500 / （貸方）売 上 600<br>（借方）支払手数料 100',
          '（借方）普通預金 600 / （貸方）売 上 600',
          '（借方）普通預金 500 / （貸方）売 上 600<br>（借方）雑 損 100'
        ],
        correct: 1,
        explanation: {
          concept: '振込手数料差引 ➔ 支払手数料',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>当店負担の振込手数料</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                当店が負担した振込手数料は<strong>「支払手数料（費用）」</strong>として借方に計上し、売上は<strong>総額</strong>で処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品700円を売り上げ、代金として同店が別の得意先から受け取っていた約束手形を裏書譲渡された。',
        type: 'shiwake',
        choices: [
          '（借方）支払手形 700 / （貸方）売 上 700',
          '（借方）未収入金 700 / （貸方）売 上 700',
          '（借方）裏書手形 700 / （貸方）売 上 700',
          '（借方）受取手形 700 / （貸方）売 上 700'
        ],
        correct: 3,
        explanation: {
          concept: '裏書譲渡 ➔ 受取手形',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>裏書譲渡された手形の受取</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                他人が振り出した約束手形を譲り受けた場合も、手形代金を受け取る権利となるため<strong>「受取手形」</strong>で処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '決算において、かねて貸方残高として計上していた現金過不足300円の原因が、商品売上の記入漏れであることが判明した。',
        type: 'shiwake',
        choices: [
          '（借方）現金過不足 300 / （貸方）売 上 300',
          '（借方）現 金 300 / （貸方）売 上 300',
          '（借方）売 上 300 / （貸方）現金過不足 300',
          '（借方）雑 益 300 / （貸方）売 上 300'
        ],
        correct: 0,
        explanation: {
          concept: '現金過不足の原因判明 ➔ 売上',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>現金過不足の原因が売上と判明</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                現金過不足（実際より帳簿が少なかった際の貸方計上分）の原因が売上と判明したため、<strong>借方で取り崩し、貸方に売上</strong>を計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '決算において、売上勘定の残高900円を損益勘定に振り替える。',
        type: 'shiwake',
        choices: [
          '（借方）損 益 900 / （貸方）売 上 900',
          '（借方）売 上 900 / （貸方）繰越利益剰余金 900',
          '（借方）繰越利益剰余金 900 / （貸方）売 上 900',
          '（借方）売 上 900 / （貸方）損 益 900'
        ],
        correct: 3,
        explanation: {
          concept: '決算振替仕訳 ➔ 損益勘定へ',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>売上勘定の損益への振替</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                収益である売上勘定（貸方残高）をゼロにするため<strong>借方に仕訳</strong>し、相手科目として<strong>「損益」勘定の貸方</strong>に振り替えます。
              </p>
            </div>
          `
        }
      }
    ]
  },
  {
    id: 'lvl_4',
    level: 4,
    title: '掛取引の街道',
    subtitle: '後払い（掛け）の仕組み。権利である「売掛金」と、義務である「買掛金」の増減仕訳。',
    url: 'http://localhost:3001/guides/accounts-receivable-payable',
    tags: ['資産', '負債', '売掛金', '買掛金'],
    questions: [
{
        text: '商品400円を仕入れ、代金は掛けとした。',
        type: 'shiwake',
        choices: [
          '（借方）買 掛 金 400 / （貸方）仕 入 400',
          '（借方）売 掛 金 400 / （貸方）仕 入 400',
          '（借方）仕 入 400 / （貸方）売 掛 金 400',
          '（借方）仕 入 400 / （貸方）買 掛 金 400'
        ],
        correct: 3,
        explanation: {
          concept: '仕入の掛け ➔ 買掛金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>掛け仕入の処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                商品の仕入代金を後日支払う義務が生じたため、<strong>「買掛金（負債）」の増加</strong>として貸方に計上します。
              </p>
              <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 仕訳</div>
                <p class="text-xs"><strong>（借方）仕 入 400 / （貸方）買 掛 金 400</strong></p>
              </div>
            </div>
          `
        }
      },
      {
        text: '商品600円を売り上げ、代金は掛けとした。',
        type: 'shiwake',
        choices: [
          '（借方）売 掛 金 600 / （貸方）売 上 600',
          '（借方）売 上 600 / （貸方）売 掛 金 600',
          '（借方）現 金 600 / （貸方）売 上 600',
          '（借方）買 掛 金 600 / （貸方）売 上 600'
        ],
        correct: 0,
        explanation: {
          concept: '売上の掛け ➔ 売掛金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>掛け売上の処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                商品の代金を後日受け取る権利が生じたため、<strong>「売掛金（資産）」の増加</strong>として借方に計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '買掛金500円の支払いとして、当店が小切手を振り出して得意先に渡した。',
        type: 'shiwake',
        choices: [
          '（借方）買 掛 金 500 / （貸方）現 金 500',
          '（借方）買 掛 金 500 / （貸方）当座預金 500',
          '（借方）当座預金 500 / （貸方）買 掛 金 500',
          '（借方）買 掛 金 500 / （貸方）支払手形 500'
        ],
        correct: 1,
        explanation: {
          concept: '買掛金の支払い ➔ 自己振出小切手',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>自己振出小切手による支払い</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                自己振出の小切手により代金を支払った場合は、<strong>「当座預金（資産）」の減少</strong>として貸方に計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '売掛金700円の回収として、得意先が振り出した小切手を受け取った。',
        type: 'shiwake',
        choices: [
          '（借方）当座預金 700 / （貸方）売 掛 金 700',
          '（借方）受取手形 700 / （貸方）売 掛 金 700',
          '（借方）売 掛 金 700 / （貸方）現 金 700',
          '（借方）現 金 700 / （貸方）売 掛 金 700'
        ],
        correct: 3,
        explanation: {
          concept: '売掛金の回収 ➔ 他人振出小切手',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>他人振出小切手の受取</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                他人（他店）が振り出した小切手はすぐに換金できる<strong>通貨代用証券</strong>であるため、<strong>「現金（資産）」の増加</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '買掛金800円を普通預金口座から振り込んで支払った。なお、振込手数料100円は当店が負担した。',
        type: 'shiwake',
        choices: [
          '（借方）買 掛 金 800 / （貸方）普通預金 900<br>（借方）支払手数料 100',
          '（借方）買 掛 金 900 / （貸方）普通預金 900',
          '（借方）買 掛 金 800 / （貸方）普通預金 700<br>（貸方）受取手数料 100',
          '（借方）買 掛 金 700 / （貸方）普通預金 800<br>（借方）支払手数料 100'
        ],
        correct: 0,
        explanation: {
          concept: '買掛金の支払い ➔ 振込手数料',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>当店負担の振込手数料</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                買掛金の減少分に加え、当店負担の振込手数料を<strong>「支払手数料（費用）」</strong>として借方に計上し、合計額を預金から減額します。
              </p>
            </div>
          `
        }
      },
      {
        text: '売掛金900円が普通預金口座に振り込まれた。なお、当店負担の振込手数料100円が差し引かれている。',
        type: 'shiwake',
        choices: [
          '（借方）普通預金 800 / （貸方）売 掛 金 900<br>（借方）売 掛 金 100',
          '（借方）普通預金 900 / （貸方）売 掛 金 900',
          '（借方）普通預金 800 / （貸方）売 掛 金 900<br>（借方）支払手数料 100',
          '（借方）普通預金 800 / （貸方）売 掛 金 900<br>（借方）売上値引 100'
        ],
        correct: 2,
        explanation: {
          concept: '売掛金の回収 ➔ 手数料差引',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>回収時に差し引かれた手数料</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                回収時に差し引かれた当店負担の振込手数料は、<strong>「支払手数料（費用）」</strong>として借方に計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '以前に掛けで仕入れた商品につき、品違いがあったため200円を返品し、買掛金から差し引いた。',
        type: 'shiwake',
        choices: [
          '（借方）仕 入 200 / （貸方）買 掛 金 200',
          '（借方）買 掛 金 200 / （貸方）現 金 200',
          '（借方）買 掛 金 200 / （貸方）売 上 200',
          '（借方）買 掛 金 200 / （貸方）仕 入 200'
        ],
        correct: 3,
        explanation: {
          concept: '仕入返品 ➔ 仕入の取消し',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>仕入品の返品（仕入戻し）</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                仕入品の返品（仕入戻し）が生じた場合、仕入時の<strong>逆仕訳</strong>を行い、仕入と買掛金を取り消します。
              </p>
            </div>
          `
        }
      },
      {
        text: '以前に掛けで売り上げた商品につき、キズがあったため300円の返品を受け、売掛金から差し引いた。',
        type: 'shiwake',
        choices: [
          '（借方）売 上 300 / （貸方）売 掛 金 300',
          '（借方）売 掛 金 300 / （貸方）売 上 300',
          '（借方）売 上 300 / （貸方）買 掛 金 300',
          '（借方）仕 入 300 / （貸方）売 掛 金 300'
        ],
        correct: 0,
        explanation: {
          concept: '売上返品 ➔ 売上の取消し',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>販売品の返品（売上戻り）</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                販売品の返品（売上戻り）が生じた場合、販売時の<strong>逆仕訳</strong>を行い、売上と売掛金を取り消します。
              </p>
            </div>
          `
        }
      },
      {
        text: '店舗用のパソコン（備品）400円を購入し、代金は翌月末に支払うこととした。',
        type: 'shiwake',
        choices: [
          '（借方）備 品 400 / （貸方）買 掛 金 400',
          '（借方）仕 入 400 / （貸方）未 払 金 400',
          '（借方）備 品 400 / （貸方）未 払 金 400',
          '（借方）備 品 400 / （貸方）未収入金 400'
        ],
        correct: 2,
        explanation: {
          concept: '備品の購入 ➔ 未払金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>商品以外の物品の後払い購入</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                商品以外の物品（備品など）を後払いで購入した場合の未払代金は、<strong>「未払金（負債）」</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '不要になった備品（帳簿価額500円）を同額で売却し、代金は翌月末に受け取ることとした。',
        type: 'shiwake',
        choices: [
          '（借方）売 掛 金 500 / （貸方）備 品 500',
          '（借方）未収入金 500 / （貸方）売 上 500',
          '（借方）未 払 金 500 / （貸方）備 品 500',
          '（借方）未収入金 500 / （貸方）備 品 500'
        ],
        correct: 3,
        explanation: {
          concept: '備品の売却 ➔ 未収入金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>商品以外の物品の売却</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                商品以外の物品を売却し、代金を後日受け取る場合は<strong>「未収入金（資産）」</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: 'かねてクレジット払いで売り上げていた商品の代金600円が、普通預金口座に振り込まれた。なお、販売時に支払手数料の処理は適切に行われている。',
        type: 'shiwake',
        choices: [
          '（借方）普通預金 600 / （貸方）クレジット売掛金 600',
          '（借方）普通預金 600 / （貸方）売 上 600',
          '（借方）普通預金 600 / （貸方）売 掛 金 600',
          '（借方）普通預金 600 / （貸方）未収入金 600'
        ],
        correct: 0,
        explanation: {
          concept: 'クレジット売上代金の入金 ➔ クレジット売掛金の減少',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>クレジット売上代金の入金</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                クレジット売上代金の入金時は、販売時に計上していた<strong>「クレジット売掛金（資産）」</strong>を貸方に計上して減少させます。
              </p>
            </div>
          `
        }
      },
      {
        text: '売掛金700円の回収として、得意先が振り出した約束手形を受け取った。',
        type: 'shiwake',
        choices: [
          '（借方）支払手形 700 / （貸方）売 掛 金 700',
          '（借方）受取手形 700 / （貸方）売 掛 金 700',
          '（借方）受取手形 700 / （貸方）売 上 700',
          '（借方）現 金 700 / （貸方）売 掛 金 700'
        ],
        correct: 1,
        explanation: {
          concept: '売掛金の回収 ➔ 受取手形',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>得意先から手形を受領</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                得意先から手形を受け取ったため、手形代金を請求する権利である<strong>「受取手形（資産）」</strong>を計上し、売掛金を減額します。
              </p>
            </div>
          `
        }
      },
      {
        text: '買掛金800円の支払いとして、当店が約束手形を振り出して得意先に渡した。',
        type: 'shiwake',
        choices: [
          '（借方）買 掛 金 800 / （貸方）受取手形 800',
          '（借方）支払手形 800 / （貸方）買 掛 金 800',
          '（借方）買 掛 金 800 / （貸方）現 金 800',
          '（借方）買 掛 金 800 / （貸方）支払手形 800'
        ],
        correct: 3,
        explanation: {
          concept: '買掛金の支払い ➔ 支払手形',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>約束手形の振出し</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                手形を振り出して代金を支払う義務が生じたため、<strong>「支払手形（負債）」</strong>を貸方に計上し、買掛金を減額します。
              </p>
            </div>
          `
        }
      },
      {
        text: '取引銀行を通じて、買掛金500円につき電子記録債務の発生記録を行った。',
        type: 'shiwake',
        choices: [
          '（借方）電子記録債務 500 / （貸方）買 掛 金 500',
          '（借方）買 掛 金 500 / （貸方）支払手形 500',
          '（借方）買 掛 金 500 / （貸方）電子記録債務 500',
          '（借方）電子記録債権 500 / （貸方）買 掛 金 500'
        ],
        correct: 2,
        explanation: {
          concept: '電子記録債務の発生 ➔ 買掛金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>電子記録債務の発生</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                買掛金の支払いとして電子記録債務が発生したため、借方で買掛金を減らし、貸方に<strong>「電子記録債務（負債）」</strong>を計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '取引銀行を通じて、売掛金600円につき電子記録債権の発生記録を行った。',
        type: 'shiwake',
        choices: [
          '（借方）電子記録債権 600 / （貸方）売 掛 金 600',
          '（借方）売 掛 金 600 / （貸方）電子記録債権 600',
          '（借方）電子記録債権 600 / （貸方）受取手形 600',
          '（借方）受取手形 600 / （貸方）売 掛 金 600'
        ],
        correct: 0,
        explanation: {
          concept: '電子記録債権の発生 ➔ 売掛金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>電子記録債権の発生</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                売掛金が電子記録債権に代わったため、借方に<strong>「電子記録債権（資産）」</strong>を計上し、貸方で売掛金を減額します。
              </p>
            </div>
          `
        }
      },
      {
        text: '売掛金400円を回収するため、先に当店が発行していた商品券100円と、現金300円を受け取った。',
        type: 'shiwake',
        choices: [
          '（借方）商 品 券 100 / （貸方）売 上 400<br>（借方）現 金 300',
          '（借方）売 掛 金 400 / （貸方）商 品 券 100<br>（貸方）現 金 300',
          '（借方）受取商品券 100 / （貸方）売 掛 金 400<br>（借方）現 金 300',
          '（借方）商 品 券 100 / （貸方）売 掛 金 400<br>（借方）現 金 300'
        ],
        correct: 3,
        explanation: {
          concept: '自社発行の商品券回収 ➔ 商品券勘定',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>当店発行の商品券の受取</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                当店が発行した商品券を受け取った場合、発行時に計上した負債である<strong>「商品券」勘定</strong>を借方に記入して取り崩します。
              </p>
            </div>
          `
        }
      },
      {
        text: '買掛金500円を支払うため、商品注文時に支払っていた前払金200円を充当し、残額は現金で支払った。',
        type: 'shiwake',
        choices: [
          '（借方）買 掛 金 500 / （貸方）前 受 金 200<br>（貸方）現 金 300',
          '（借方）買 掛 金 500 / （貸方）前 払 金 200<br>（貸方）現 金 300',
          '（借方）前 払 金 200 / （貸方）買 掛 金 500<br>（借方）現 金 300',
          '（借方）買 掛 金 300 / （貸方）現 金 500<br>（借方）前 払 金 200'
        ],
        correct: 1,
        explanation: {
          concept: '前払金の充当 ➔ 買掛金の支払い',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>前払金の充当と残額の支払い</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                買掛金の決済にあたり、あらかじめ計上していた<strong>「前払金（資産）」</strong>を取り崩し、不足額のみを現金で支払います。
              </p>
            </div>
          `
        }
      },
      {
        text: '前期に発生した売掛金300円が、得意先の倒産により貸し倒れた。なお、貸倒引当金の残高は500円ある。',
        type: 'shiwake',
        choices: [
          '（借方）貸倒引当金 300 / （貸方）売 掛 金 300',
          '（借方）貸倒損失 300 / （貸方）売 掛 金 300',
          '（借方）貸倒損失 300 / （貸方）貸倒引当金 300',
          '（借方）貸倒引当金 500 / （貸方）売 掛 金 300<br>（貸方）貸倒損失 200'
        ],
        correct: 0,
        explanation: {
          concept: '前期発生債権の貸倒れ ➔ 貸倒引当金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>前期以前の債権の貸倒れ</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                前期以前の債権が貸し倒れた場合、設定されている<strong>「貸倒引当金（評価勘定）」</strong>を優先して取り崩し、売掛金を減額します。
              </p>
            </div>
          `
        }
      },
      {
        text: '当期に発生した売掛金200円が、得意先の倒産により貸し倒れた。なお、貸倒引当金の残高は400円ある。',
        type: 'shiwake',
        choices: [
          '（借方）貸倒引当金 200 / （貸方）売 掛 金 200',
          '（借方）貸倒引当金繰入 200 / （貸方）売 掛 金 200',
          '（借方）貸倒損失 200 / （貸方）売 掛 金 200',
          '（借方）売 掛 金 200 / （貸方）貸倒引当金 200'
        ],
        correct: 2,
        explanation: {
          concept: '当期発生債権の貸倒れ ➔ 貸倒損失',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>当期発生債権の貸倒れ</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                当期に発生した債権の貸倒れに対しては、貸倒引当金を取り崩すことはできず、全額を<strong>「貸倒損失（費用）」</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品仕入時の代金800円を掛けとした際、誤って貸方を「売掛金」として起票していた。本日誤りを発見したため、これを訂正する。',
        type: 'shiwake',
        choices: [
          '（借方）売 掛 金 800 / （貸方）買 掛 金 800',
          '（借方）買 掛 金 800 / （貸方）売 掛 金 800',
          '（借方）買 掛 金 800 / （貸方）仕 入 800',
          '（借方）仕 入 800 / （貸方）買 掛 金 800'
        ],
        correct: 0,
        explanation: {
          concept: '訂正仕訳 ➔ 売掛金を買掛金に修正',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>誤った勘定科目の訂正</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                誤って貸方に計上した<strong>「売掛金」を借方に記入して取り消し</strong>、正しい負債である<strong>「買掛金」を貸方</strong>に計上して訂正します。
              </p>
            </div>
          `
        }
      }
    ]
  },
  {
    id: 'lvl_5',
    level: 5,
    title: '電子マネーの街',
    subtitle: 'クレジットカード売上と、差し引かれる『支払手数料』の仕訳テクニック。',
    url: 'http://localhost:3001/guides/credit-card-sales',
    tags: ['資産', '費用', 'クレジット売掛金', '支払手数料'],
    questions: [
{
        text: '従業員の交通系ICカードに現金300円をチャージした。なお、チャージ時点では仮払金として処理する。',
        type: 'shiwake',
        choices: [
          '（借方）仮 払 金 300 / （貸方）現 金 300',
          '（借方）旅費交通費 300 / （貸方）現 金 300',
          '（借方）前 払 金 300 / （貸方）現 金 300',
          '（借方）現 金 300 / （貸方）仮 払 金 300'
        ],
        correct: 0,
        explanation: {
          concept: 'ICカードチャージ ➔ 仮払金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>ICカードへのチャージ（仮払金として処理）</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                用途が確定する前のICカードへのチャージ額は、一時的な前渡しとして<strong>「仮払金（資産）」</strong>で処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '従業員が出張から戻り、先にチャージして仮払金としていた交通系ICカードから交通費200円を支払った旨の報告を受けた。',
        type: 'shiwake',
        choices: [
          '（借方）旅費交通費 200 / （貸方）現 金 200',
          '（借方）旅費交通費 200 / （貸方）仮 払 金 200',
          '（借方）旅費交通費 200 / （貸方）仮 払 金 300<br>（借方）現 金 100',
          '（借方）仮 払 金 200 / （貸方）旅費交通費 200'
        ],
        correct: 1,
        explanation: {
          concept: '仮払金の精算 ➔ 旅費交通費',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>交通費の支払い確定時</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                交通費の支払いが確定したため<strong>「旅費交通費（費用）」</strong>を計上し、同額の<strong>「仮払金」</strong>を貸方で減少させます。
              </p>
            </div>
          `
        }
      },
      {
        text: '交通系ICカードのチャージ残高（仮払金）100円につき、不要となったため現金で払い戻しを受けた。',
        type: 'shiwake',
        choices: [
          '（借方）仮 払 金 100 / （貸方）現 金 100',
          '（借方）現 金 100 / （貸方）旅費交通費 100',
          '（借方）現 金 100 / （貸方）前 払 金 100',
          '（借方）現 金 100 / （貸方）仮 払 金 100'
        ],
        correct: 3,
        explanation: {
          concept: 'ICカード払戻 ➔ 仮払金の取崩し',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>チャージ残高の払い戻し</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                払い戻しにより現金が増加するため借方に<strong>「現金」</strong>、不要となった<strong>「仮払金」</strong>を貸方に計上して取り消します。
              </p>
            </div>
          `
        }
      },
      {
        text: '従業員の交通系ICカードに普通預金から500円をチャージした。なお、当店ではチャージ時に全額を旅費交通費として処理している。',
        type: 'shiwake',
        choices: [
          '（借方）仮 払 金 500 / （貸方）普通預金 500',
          '（借方）旅費交通費 500 / （貸方）現 金 500',
          '（借方）旅費交通費 500 / （貸方）普通預金 500',
          '（借方）前払費用 500 / （貸方）普通預金 500'
        ],
        correct: 2,
        explanation: {
          concept: 'チャージ時直接費用処理 ➔ 旅費交通費',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>チャージ時に費用処理する指示がある場合</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                実務的な処理として、チャージ時に直接<strong>「旅費交通費」</strong>として費用計上する指示がある場合はそれに従います。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品600円を売り上げ、代金は交通系電子マネーで決済されたため、同額を電子マネー勘定で処理した。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 600 / （貸方）売 上 600',
          '（借方）売 掛 金 600 / （貸方）売 上 600',
          '（借方）電子マネー 600 / （貸方）売 上 600',
          '（借方）クレジット売掛金 600 / （貸方）売 上 600'
        ],
        correct: 2,
        explanation: {
          concept: '電子マネー受取 ➔ 電子マネー勘定',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>電子マネーでの決済受取</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                電子マネー勘定での処理が指定されている場合、受け取った残高は<strong>「電子マネー（資産）」の増加</strong>として借方に計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '店舗で保有する電子マネー残高600円を、普通預金口座に入金（銀行口座へ出金）した。',
        type: 'shiwake',
        choices: [
          '（借方）普通預金 600 / （貸方）電子マネー 600',
          '（借方）普通預金 600 / （貸方）売 上 600',
          '（借方）電子マネー 600 / （貸方）普通預金 600',
          '（借方）普通預金 600 / （貸方）現 金 600'
        ],
        correct: 0,
        explanation: {
          concept: '電子マネーの預金振替 ➔ 普通預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>電子マネー残高の銀行口座への振替</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                電子マネーを預金口座に振り替えたため、借方に<strong>「普通預金」の増加</strong>、貸方に<strong>「電子マネー」の減少</strong>を計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '文房具（消耗品）200円を購入し、代金は店舗で保有する電子マネー（資産）で支払った。',
        type: 'shiwake',
        choices: [
          '（借方）消耗品費 200 / （貸方）現 金 200',
          '（借方）消耗品費 200 / （貸方）当座預金 200',
          '（借方）消耗品費 200 / （貸方）仮 払 金 200',
          '（借方）消耗品費 200 / （貸方）電子マネー 200'
        ],
        correct: 3,
        explanation: {
          concept: '電子マネーでの支払い ➔ 消耗品費',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>電子マネーでの消耗品購入</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                費用の発生として<strong>「消耗品費」</strong>を借方に計上し、支払いに充てた<strong>「電子マネー」</strong>を貸方で減少させます。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品800円を売り上げ、代金はスマートフォンのQRコード決済とし、決済手数料100円を差し引かれた残額を未収入金として処理した。',
        type: 'shiwake',
        choices: [
          '（借方）未収入金 800 / （貸方）売 上 700<br>（貸方）受取手数料 100',
          '（借方）未収入金 700 / （貸方）売 上 800<br>（借方）支払手数料 100',
          '（借方）売 掛 金 700 / （貸方）売 上 800<br>（借方）支払手数料 100',
          '（借方）電子マネー 700 / （貸方）売 上 800<br>（借方）支払手数料 100'
        ],
        correct: 1,
        explanation: {
          concept: 'QRコード決済 ➔ 未収入金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>QRコード決済の処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                決済代行会社への債権は<strong>「未収入金」</strong>、販売時に負担する手数料は<strong>「支払手数料（費用）」</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: 'QRコード決済による未収入金700円が、当店の普通預金口座に振り込まれた。',
        type: 'shiwake',
        choices: [
          '（借方）普通預金 700 / （貸方）売 上 700',
          '（借方）普通預金 700 / （貸方）売 掛 金 700',
          '（借方）普通預金 700 / （貸方）未収入金 700',
          '（借方）普通預金 700 / （貸方）電子マネー 700'
        ],
        correct: 2,
        explanation: {
          concept: '未収入金の回収 ➔ 普通預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>QRコード決済代金の入金</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                代金が回収されたため<strong>「普通預金」</strong>を増加させ、借方に計上していた<strong>「未収入金」</strong>を貸方で減少させます。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品900円をクレジットカード払いの条件で売り上げた。なお、信販会社への手数料100円を計上し、残額は後日入金される。',
        type: 'shiwake',
        choices: [
          '（借方）売 掛 金 800 / （貸方）売 上 900<br>（借方）支払手数料 100',
          '（借方）クレジット売掛金 800 / （貸方）売 上 900<br>（借方）支払手数料 100',
          '（借方）未収入金 800 / （貸方）売 上 900<br>（借方）支払手数料 100',
          '（借方）クレジット売掛金 900 / （貸方）売 上 900'
        ],
        correct: 1,
        explanation: {
          concept: 'クレジット売上 ➔ クレジット売掛金・支払手数料',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>クレジットカード決済の売上</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                クレジットカード決済による売上債権は<strong>「クレジット売掛金」</strong>、負担する手数料は<strong>「支払手数料」</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: 'かねてクレジットカード払いで売り上げていた代金につき、信販会社から普通預金口座へ800円が振り込まれた。なお、販売時に手数料は適切に処理されている。',
        type: 'shiwake',
        choices: [
          '（借方）普通預金 800 / （貸方）クレジット売掛金 800',
          '（借方）普通預金 800 / （貸方）売 掛 金 800',
          '（借方）普通預金 800 / （貸方）売 上 800',
          '（借方）普通預金 800 / （貸方）未収入金 800'
        ],
        correct: 0,
        explanation: {
          concept: 'クレジット売掛金の入金 ➔ 普通預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>クレジット売上代金の入金</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                入金時は、販売時に計上していた<strong>「クレジット売掛金」</strong>を貸方に計上して減少させます。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品500円を売り上げ、代金はクレジットカード払いの条件とした。なお、信販会社への手数料は入金時に計上するため、売上時は総額で処理する。',
        type: 'shiwake',
        choices: [
          '（借方）クレジット売掛金 450 / （貸方）売 上 500<br>（借方）支払手数料 50',
          '（借方）クレジット売掛金 500 / （貸方）売 上 500',
          '（借方）売 掛 金 500 / （貸方）売 上 500',
          '（借方）未収入金 500 / （貸方）売 上 500'
        ],
        correct: 1,
        explanation: {
          concept: '総額処理のクレジット売上 ➔ クレジット売掛金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>入金時手数料計上の指示がある場合</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                入金時に手数料を計上する指示がある場合、販売時は手数料を差し引かず、売上総額を<strong>「クレジット売掛金」</strong>として計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '上記（問題12）のクレジット売掛金500円につき、手数料50円が差し引かれ、残額が普通預金口座に振り込まれた。',
        type: 'shiwake',
        choices: [
          '（借方）普通預金 450 / （貸方）クレジット売掛金 500<br>（借方）支払手数料 50',
          '（借方）普通預金 450 / （貸方）クレジット売掛金 500<br>（借方）売上値引 50',
          '（借方）普通預金 450 / （貸方）売 掛 金 500<br>（借方）支払手数料 50',
          '（借方）普通預金 500 / （貸方）クレジット売掛金 500'
        ],
        correct: 0,
        explanation: {
          concept: '入金時の手数料計上 ➔ 支払手数料',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>クレジット売掛金の回収と手数料</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                総額で計上していたクレジット売掛金を取り崩し、差し引かれた額を<strong>「支払手数料」</strong>として入金時に計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品400円を売り上げ、得意先がデビットカードで決済したため、ただちに当店の普通預金口座に入金された。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 400 / （貸方）売 上 400',
          '（借方）売 掛 金 400 / （貸方）売 上 400',
          '（借方）普通預金 400 / （貸方）売 上 400',
          '（借方）クレジット売掛金 400 / （貸方）売 上 400'
        ],
        correct: 2,
        explanation: {
          concept: 'デビットカード決済 ➔ 普通預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>デビットカード決済の即時入金</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                デビットカード決済は即時に預金口座の資金が移動するため、代金を受け取った側は直ちに<strong>「普通預金」</strong>を増加させます。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品300円を仕入れ、代金は当店のデビットカードを利用して決済したため、ただちに普通預金口座から引き落とされた。',
        type: 'shiwake',
        choices: [
          '（借方）仕 入 300 / （貸方）買 掛 金 300',
          '（借方）仕 入 300 / （貸方）普通預金 300',
          '（借方）仕 入 300 / （貸方）現 金 300',
          '（借方）仕 入 300 / （貸方）未 払 金 300'
        ],
        correct: 1,
        explanation: {
          concept: 'デビットカード支払い ➔ 普通預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>デビットカードでの即時支払い</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                デビットカードで支払った場合は即座に口座から引き落とされるため、貸方に<strong>「普通預金」の減少</strong>を計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '備品500円を購入し、代金はクレジットカードで決済した。代金は翌月に預金口座から引き落とされる。',
        type: 'shiwake',
        choices: [
          '（借方）備 品 500 / （貸方）買 掛 金 500',
          '（借方）備 品 500 / （貸方）未 払 金 500',
          '（借方）備 品 500 / （貸方）普通預金 500',
          '（借方）仕 入 500 / （貸方）未 払 金 500'
        ],
        correct: 1,
        explanation: {
          concept: 'クレジットカード後払い ➔ 未払金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>クレジットカードでの後払い購入</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                商品以外の物品（備品など）をクレジットカードで後払い購入した場合の債務は、<strong>「未払金（負債）」</strong>で処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '店舗で利用している電子マネー（資産）に、普通預金口座から400円をチャージした。',
        type: 'shiwake',
        choices: [
          '（借方）仮 払 金 400 / （貸方）普通預金 400',
          '（借方）電子マネー 400 / （貸方）普通預金 400',
          '（借方）現 金 400 / （貸方）普通預金 400',
          '（借方）旅費交通費 400 / （貸方）普通預金 400'
        ],
        correct: 1,
        explanation: {
          concept: '電子マネーへのチャージ ➔ 普通預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>店舗用電子マネーへのチャージ</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                店舗用の電子マネー勘定に直接チャージした場合、<strong>「電子マネー」の増加</strong>として借方に計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '商品700円を売り上げ、代金は電子マネーで決済された。なお、決済時に手数料100円が差し引かれ、残額が電子マネー勘定にチャージされた。',
        type: 'shiwake',
        choices: [
          '（借方）電子マネー 700 / （貸方）売 上 700',
          '（借方）電子マネー 600 / （貸方）売 上 700<br>（借方）支払手数料 100',
          '（借方）電子マネー 600 / （貸方）売 上 700<br>（借方）売 上 100',
          '（借方）クレジット売掛金 600 / （貸方）売 上 700<br>（借方）支払手数料 100'
        ],
        correct: 1,
        explanation: {
          concept: '電子マネー決済 ➔ 手数料差引',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>電子マネー決済と手数料</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                決済時に差し引かれる手数料は<strong>「支払手数料」</strong>、実際にチャージされた額を<strong>「電子マネー」</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '先月クレジットカードで決済して購入した備品の代金500円が、本日、普通預金口座から引き落とされた。',
        type: 'shiwake',
        choices: [
          '（借方）未 払 金 500 / （貸方）普通預金 500',
          '（借方）買 掛 金 500 / （貸方）普通預金 500',
          '（借方）備 品 500 / （貸方）普通預金 500',
          '（借方）未払費用 500 / （貸方）普通預金 500'
        ],
        correct: 0,
        explanation: {
          concept: 'クレジットカード代金の引落し ➔ 未払金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>クレジットカード代金の口座引落し</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                購入時に計上していた<strong>「未払金」</strong>を借方に記入して減少させ、引き落とし元である<strong>「普通預金」</strong>を貸方に計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '従業員が出張用の交通系ICカードに現金200円をチャージした際、一時的に立替金として処理していたが、本日これを全額旅費交通費に振り替えた。',
        type: 'shiwake',
        choices: [
          '（借方）旅費交通費 200 / （貸方）仮 払 金 200',
          '（借方）旅費交通費 200 / （貸方）立 替 金 200',
          '（借方）旅費交通費 200 / （貸方）現 金 200',
          '（借方）仮 払 金 200 / （貸方）立 替 金 200'
        ],
        correct: 1,
        explanation: {
          concept: '立替金の振替 ➔ 旅費交通費',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>立替金から旅費交通費への振替</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                一時的に計上していた<strong>「立替金」</strong>を貸方に記入して取り消し、正しい使途である<strong>「旅費交通費」</strong>に振り替えます。
              </p>
            </div>
          `
        }
      }
    ]
  },
  {
    id: 'lvl_6',
    level: 6,
    title: '返品の港',
    subtitle: '不良品を返した・返された時の『返品（売上戻り・仕入戻し）』の逆仕訳ルール。',
    url: 'http://localhost:3001/guides/returns-and-shipping',
    tags: ['売上', '仕入', '返品'],
    questions: [
{
        text: '先に掛けで仕入れた商品につき、品違いのため200円を返品し、買掛金から差し引いた。',
        type: 'shiwake',
        choices: [
          '（借方）仕 入 200 / （貸方）買 掛 金 200',
          '（借方）買 掛 金 200 / （貸方）現 金 200',
          '（借方）買 掛 金 200 / （貸方）仕 入 200',
          '（借方）現 金 200 / （貸方）仕 入 200'
        ],
        correct: 2,
        explanation: {
          concept: '仕入返品 ➔ 仕入の取消し',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>仕入品の返品（仕入戻し）</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                商品の返品（仕入戻し）をした場合は、仕入時の<strong>逆仕訳</strong>を行い、買掛金と仕入をそれぞれ減額します。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に掛けで売り上げた商品につき、キズがあったため300円の返品を受け、売掛金から差し引いた。',
        type: 'shiwake',
        choices: [
          '（借方）売 上 300 / （貸方）売 掛 金 300',
          '（借方）売 掛 金 300 / （貸方）売 上 300',
          '（借方）売 上 300 / （貸方）現 金 300',
          '（借方）返 品 300 / （貸方）売 掛 金 300'
        ],
        correct: 0,
        explanation: {
          concept: '売上返品 ➔ 売上の取消し',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>販売品の返品（売上戻り）</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                商品の返品（売上戻り）を受けた場合は、販売時の<strong>逆仕訳</strong>を行い、売上と売掛金をそれぞれ減額します。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に現金で仕入れた商品につき、不良品であったため100円を返品し、同額を現金で受け取った。',
        type: 'shiwake',
        choices: [
          '（借方）現 金 100 / （貸方）買 掛 金 100',
          '（借方）仕 入 100 / （貸方）現 金 100',
          '（借方）買 掛 金 100 / （貸方）現 金 100',
          '（借方）現 金 100 / （貸方）仕 入 100'
        ],
        correct: 3,
        explanation: {
          concept: '現金仕入の返品 ➔ 現金受取',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>現金仕入の返品</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                現金で返金を受けたため借方に<strong>「現金」</strong>を計上し、貸方で返品分の<strong>「仕入」を取り消し</strong>ます。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に現金で売り上げた商品につき、品違いのため200円の返品を受け、同額を現金で返金した。',
        type: 'shiwake',
        choices: [
          '（借方）売 上 200 / （貸方）現 金 200',
          '（借方）現 金 200 / （貸方）売 上 200',
          '（借方）売 上 200 / （貸方）売 掛 金 200',
          '（借方）売 掛 金 200 / （貸方）現 金 200'
        ],
        correct: 0,
        explanation: {
          concept: '現金売上の返品 ➔ 現金返金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>現金売上の返品</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                現金で返金したため貸方に<strong>「現金」</strong>を計上し、借方で返品分の<strong>「売上」を取り消し</strong>ます。
              </p>
            </div>
          `
        }
      },
      {
        text: '先にクレジット払いの条件で売り上げた商品につき、300円の返品を受けた。なお、販売時の手数料等の処理は取り消さないものとする。',
        type: 'shiwake',
        choices: [
          '（借方）売 掛 金 300 / （貸方）売 上 300',
          '（借方）売 上 300 / （貸方）クレジット売掛金 300',
          '（借方）売 上 300 / （貸方）売 掛 金 300',
          '（借方）クレジット売掛金 300 / （貸方）売 上 300'
        ],
        correct: 1,
        explanation: {
          concept: 'クレジット売上の返品 ➔ クレジット売掛金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>クレジット売上の返品処理</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                クレジット売上の返品が生じた場合は、借方に<strong>「売上」</strong>、貸方に<strong>「クレジット売掛金」</strong>を計上して減額します。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に掛けで仕入れた商品に破損があったため400円を返品し、代金は買掛金と相殺した。なお、返品に伴う発送費100円は当店が全額現金で負担した。',
        type: 'shiwake',
        choices: [
          '（借方）買 掛 金 400 / （貸方）仕 入 400<br>（借方）発 送 費 100 / （貸方）現 金 100',
          '（借方）買 掛 金 400 / （貸方）仕 入 300<br>（貸方）現 金 100',
          '（借方）買 掛 金 400 / （貸方）仕 入 400<br>（借方）支払手数料 100 / （貸方）現 金 100',
          '（借方）買 掛 金 500 / （貸方）仕 入 400<br>（貸方）現 金 100'
        ],
        correct: 0,
        explanation: {
          concept: '仕入返品と発送費 ➔ 複合仕訳',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>返品と当店負担の発送費</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                買掛金と仕入の相殺に加え、当店負担の発送費は<strong>「発送費（費用）」</strong>として借方に計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に掛けで売り上げた商品につき200円の返品を受け、売掛金から差し引いた。なお、返品に伴う発送費100円は当店が現金で負担した。',
        type: 'shiwake',
        choices: [
          '（借方）売 上 200 / （貸方）売 掛 金 300<br>（借方）発 送 費 100',
          '（借方）売 上 200 / （貸方）売 掛 金 200<br>（借方）発 送 費 100 / （貸方）現 金 100',
          '（借方）売 掛 金 200 / （貸方）売 上 200<br>（借方）発 送 費 100 / （貸方）現 金 100',
          '（借方）売 上 300 / （貸方）売 掛 金 200<br>（貸方）現 金 100'
        ],
        correct: 1,
        explanation: {
          concept: '売上返品と発送費 ➔ 複合仕訳',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>返品と当店負担の発送費</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                売掛金と売上の相殺に加え、当店負担の発送費は<strong>「発送費（費用）」</strong>として借方に計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に掛けで仕入れた商品につき300円を返品した。なお、返品にかかった発送費100円は先方負担であるが、当店が現金で立て替え払いし、買掛金から差し引くこととした。',
        type: 'shiwake',
        choices: [
          '（借方）買 掛 金 400 / （貸方）仕 入 300<br>（貸方）現 金 100',
          '（借方）買 掛 金 300 / （貸方）仕 入 300<br>（借方）立 替 金 100 / （貸方）現 金 100',
          '（借方）買 掛 金 300 / （貸方）仕 入 300<br>（借方）発 送 費 100 / （貸方）現 金 100',
          '（借方）買 掛 金 200 / （貸方）仕 入 300<br>（貸方）現 金 100'
        ],
        correct: 0,
        explanation: {
          concept: '仕入返品と立替発送費 ➔ 買掛金から控除',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>立て替えた発送費を買掛金から差し引く</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                先方負担の発送費を立て替えた分について買掛金から差し引くため、返品分と合わせた<strong>400円の買掛金</strong>を借方で減額します。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に掛けで売り上げた商品につき400円の返品を受けた。なお、返品にかかった発送費100円は先方負担であり、当店が現金で立て替え払いし、売掛金に含めることとした。',
        type: 'shiwake',
        choices: [
          '（借方）売 上 400 / （貸方）売 掛 金 400',
          '（借方）売 上 400 / （貸方）売 掛 金 400<br>（借方）発 送 費 100 / （貸方）現 金 100',
          '（借方）売 上 400 / （貸方）売 掛 金 300<br>（貸方）現 金 100',
          '（借方）売 上 400 / （貸方）売 掛 金 400<br>（借方）売 掛 金 100 / （貸方）現 金 100'
        ],
        correct: 2,
        explanation: {
          concept: '売上返品と立替発送費 ➔ 売掛金に含める',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>立て替えた発送費を売掛金に含める</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                売上返品による売掛金の減少<strong>400円</strong>と、立替払いによる売掛金の増加<strong>100円</strong>を相殺し、貸方に売掛金<strong>300円</strong>を計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に同店発行の商品券で売り上げた商品につき500円の返品を受け、同額の商品券を返還した。',
        type: 'shiwake',
        choices: [
          '（借方）売 上 500 / （貸方）受取商品券 500',
          '（借方）売 上 500 / （貸方）商 品 券 500',
          '（借方）受取商品券 500 / （貸方）売 上 500',
          '（借方）商 品 券 500 / （貸方）売 上 500'
        ],
        correct: 1,
        explanation: {
          concept: '自己商品券の返品 ➔ 商品券',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>自己商品券を返還した場合</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                自己商品券を返還したため、売上の取り消しとともに、減少していた<strong>「商品券（負債）」</strong>を貸方に計上して元に戻します。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に他店発行の商品券で売り上げた商品につき300円の返品を受け、同額の商品券を返還した。',
        type: 'shiwake',
        choices: [
          '（借方）売 上 300 / （貸方）商 品 券 300',
          '（借方）売 上 300 / （貸方）受取商品券 300',
          '（借方）受取商品券 300 / （貸方）売 上 300',
          '（借方）売 掛 金 300 / （貸方）受取商品券 300'
        ],
        correct: 1,
        explanation: {
          concept: '他店商品券の返品 ➔ 受取商品券',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>他店商品券を返還した場合</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                他店商品券を返還したため、売上の取り消しとともに、計上していた<strong>「受取商品券（資産）」</strong>を貸方に記入して減額します。
              </p>
            </div>
          `
        }
      },
      {
        text: '注文時に受け取った前受金を充当して売り上げた商品につき200円の返品を受け、同額を現金で返金した。',
        type: 'shiwake',
        choices: [
          '（借方）前 受 金 200 / （貸方）現 金 200',
          '（借方）売 上 200 / （貸方）現 金 200',
          '（借方）売 上 200 / （貸方）前 受 金 200',
          '（借方）売 掛 金 200 / （貸方）現 金 200'
        ],
        correct: 1,
        explanation: {
          concept: '前受金充当売上の返品 ➔ 現金返金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>前受金充当売上の返品</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                売上計上後に返品されたため、借方で<strong>「売上」を取り消し</strong>、現金で返金したため貸方に<strong>「現金」</strong>を計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '注文時に支払った前払金を充当して仕入れた商品につき400円を返品し、同額を普通預金口座への振り込みで返金を受けた。',
        type: 'shiwake',
        choices: [
          '（借方）普通預金 400 / （貸方）前 払 金 400',
          '（借方）買 掛 金 400 / （貸方）仕 入 400',
          '（借方）普通預金 400 / （貸方）仕 入 400',
          '（借方）普通預金 400 / （貸方）売 上 400'
        ],
        correct: 2,
        explanation: {
          concept: '前払金充当仕入の返品 ➔ 普通預金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>前払金充当仕入の返品</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                仕入計上後に返品したため、貸方で<strong>「仕入」を取り消し</strong>、返金された額を借方に<strong>「普通預金」</strong>として計上します。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に掛けで仕入れた商品の一部200円につき、キズがあったため値引を受け、買掛金から差し引いた。（返品と同様の処理とする）',
        type: 'shiwake',
        choices: [
          '（借方）仕 入 200 / （貸方）買 掛 金 200',
          '（借方）買 掛 金 200 / （貸方）仕入値引 200',
          '（借方）買 掛 金 200 / （貸方）仕 入 200',
          '（借方）現 金 200 / （貸方）買 掛 金 200'
        ],
        correct: 2,
        explanation: {
          concept: '仕入値引 ➔ 仕入の取消し',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>仕入値引を受けた場合</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                仕入値引を受けた場合も返品（仕入戻し）と同様に、仕入時の<strong>逆仕訳</strong>を行って買掛金と仕入を減額します。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に掛けで売り上げた商品の一部100円につき、品違いがあったため値引を行い、売掛金から差し引いた。（返品と同様の処理とする）',
        type: 'shiwake',
        choices: [
          '（借方）売 掛 金 100 / （貸方）売 上 100',
          '（借方）売 上 100 / （貸方）売 掛 金 100',
          '（借方）売上値引 100 / （貸方）売 掛 金 100',
          '（借方）売 上 100 / （貸方）現 金 100'
        ],
        correct: 1,
        explanation: {
          concept: '売上値引 ➔ 売上の取消し',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>売上値引を行った場合</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                売上値引を行った場合も返品（売上戻り）と同様に、販売時の<strong>逆仕訳</strong>を行って売上と売掛金を減額します。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に現金で仕入れた商品につき300円を返品し、代金は後日受け取ることとした。',
        type: 'shiwake',
        choices: [
          '（借方）未収入金 300 / （貸方）仕 入 300',
          '（借方）買 掛 金 300 / （貸方）仕 入 300',
          '（借方）売 掛 金 300 / （貸方）仕 入 300',
          '（借方）現 金 300 / （貸方）仕 入 300'
        ],
        correct: 0,
        explanation: {
          concept: '現金仕入の返品 ➔ 未収入金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>返品代金を後日受け取る場合</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                商品代金の返金として後日金銭を受け取る権利が生じたため、<strong>「未収入金（資産）」</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '先に現金で売り上げた商品につき400円の返品を受けたが、代金は後日支払うこととした。',
        type: 'shiwake',
        choices: [
          '（借方）売 上 400 / （貸方）買 掛 金 400',
          '（借方）売 上 400 / （貸方）現 金 400',
          '（借方）売 上 400 / （貸方）売 掛 金 400',
          '（借方）売 上 400 / （貸方）未 払 金 400'
        ],
        correct: 3,
        explanation: {
          concept: '現金売上の返品 ➔ 未払金',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>返金を後日支払う場合</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                商品代金の返金として後日金銭を支払う義務が生じたため、<strong>「未払金（負債）」</strong>として処理します。
              </p>
            </div>
          `
        }
      },
      {
        text: '掛けで仕入れた商品500円の返品を行い、正しく買掛金と相殺したが、誤って借方を「売掛金」として起票していた。本日この誤りを発見したため訂正する。',
        type: 'shiwake',
        choices: [
          '（借方）買 掛 金 500 / （貸方）売 掛 金 500',
          '（借方）売 掛 金 500 / （貸方）買 掛 金 500',
          '（借方）買 掛 金 500 / （貸方）仕 入 500',
          '（借方）売 上 500 / （貸方）売 掛 金 500'
        ],
        correct: 0,
        explanation: {
          concept: '訂正仕訳 ➔ 売掛金を買掛金に修正',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>誤った勘定科目の訂正</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                誤って借方に計上した<strong>「売掛金」を貸方に記入して取り消し</strong>、本来計上すべき<strong>「買掛金」</strong>を借方に計上して訂正します。
              </p>
            </div>
          `
        }
      },
      {
        text: '決算において、当期中に発生した掛け売上の返品200円の処理が未記入であることが判明した。',
        type: 'shiwake',
        choices: [
          '（借方）売 掛 金 200 / （貸方）売 上 200',
          '（借方）売 上 200 / （貸方）現 金 200',
          '（借方）売 上 200 / （貸方）売 掛 金 200',
          '（借方）売 上 200 / （貸方）繰越利益剰余金 200'
        ],
        correct: 2,
        explanation: {
          concept: '決算時の売上返品漏れ ➔ 売上の取消し',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>未記入の返品処理を決算時に行う</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                未記入の返品処理を決算時に行う場合でも、期中と同様に借方に<strong>「売上」</strong>、貸方に<strong>「売掛金」</strong>を計上して減額します。
              </p>
            </div>
          `
        }
      },
      {
        text: '決算において、当期中に発生した掛け仕入の返品100円の処理が未記入であることが判明した。',
        type: 'shiwake',
        choices: [
          '（借方）買 掛 金 100 / （貸方）仕 入 100',
          '（借方）仕 入 100 / （貸方）買 掛 金 100',
          '（借方）買 掛 金 100 / （貸方）現 金 100',
          '（借方）繰越利益剰余金 100 / （貸方）仕 入 100'
        ],
        correct: 0,
        explanation: {
          concept: '決算時の仕入返品漏れ ➔ 仕入の取消し',
          brilliantExplanation: `
            <div class="space-y-3 font-sans">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                <span class="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20">仕訳のポイント</span>
                <span>未記入の仕入返品を決算時に行う</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                未記入の返品処理を決算時に行う場合でも、期中と同様に借方に<strong>「買掛金」</strong>、貸方に<strong>「仕入」</strong>を計上して減額します。
              </p>
            </div>
          `
        }
      }
    ]
  },
  {
    id: 'lvl_7',
    level: 7,
    title: '値引の市場',
    subtitle: '品質不良などによる代金の減額『値引』の仕訳ルール。',
    url: 'http://localhost:3001/guides/sales-purchase-returns',
    tags: ['売上値引', '仕入値引', '値引'],
    questions: [
    ]
  },
  {
    id: 'lvl_8',
    level: 8,
    title: '貸借の橋',
    subtitle: 'お金の貸し借りと利息（支払利息・受取利息）の計算および手形を用いた取引。',
    url: 'http://localhost:3001/guides/loans-and-interest',
    tags: ['貸付金', '借入金', '手形借入金'],
    questions: [
    ]
  },
  {
    id: 'lvl_9',
    level: 9,
    title: '手形の関所',
    subtitle: '約束手形の振出（支払手形）と受取（受取手形）、および裏書譲渡の決済処理。',
    url: 'http://localhost:3001/guides/bills-receivable-payable',
    tags: ['受取手形', '支払手形', '裏書譲渡'],
    questions: [
    ]
  },
  {
    id: 'lvl_10',
    level: 10,
    title: '電子債権の塔',
    subtitle: 'ネット時代の決済『電子記録債権』『電子記録債務』の発生と消滅。',
    url: 'http://localhost:3001/guides/electronically-recorded-monetary-claims',
    tags: ['電子記録債権', '電子記録債務'],
    questions: [
    ]
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
    questions: [
    ]
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
    if (isTutorialMode()) {
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
// Quiz Session Helper
// ==========================================
const startQuizSession = (questions) => {
  state.activeQuestions = questions;
  state.currentQuestionIndex = 0;
  state.score = 0;
  state.hearts = APP_CONSTANTS.INITIAL_HEARTS;
  state.firstTimeWrongCount = 0;
  showView('quiz');
};

const isTutorialMode = () => state.currentService === 'boki_tutorial' || state.debugMode;

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
    startQuizSession(generateTutorialQuestions());
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
        startQuizSession(shuffleByCategory(interleaveAnswers([...lvl.questions])));
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
      state.hearts = APP_CONSTANTS.INITIAL_HEARTS;
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
    if (isTutorialMode()) {
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
    const canGoBack = state.currentQuestionIndex > 0;
    actionBar.innerHTML = `
      <div class="max-w-xl mx-auto flex items-center justify-between gap-4">
        <button id="quiz-prev-btn" class="px-6 py-3 rounded-xl font-bold ${canGoBack ? 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white' : 'text-gray-300 dark:text-gray-700 cursor-not-allowed'}" ${canGoBack ? '' : 'disabled'}>
          ← 前の問題に戻る
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
  
  const prevBtn = document.getElementById('quiz-prev-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (state.currentQuestionIndex <= 0) return;
      state.currentQuestionIndex--;
      renderQuiz();
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
    state.score += APP_CONSTANTS.SCORE_PER_CORRECT;
    state.xp += APP_CONSTANTS.XP_PER_CORRECT;
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
    
    if (!isTutorialMode()) {
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
            ライフ残量: ${isTutorialMode() ? '∞' : state.hearts}
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
      if (state.hearts <= 0 && !isTutorialMode()) {
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
  if (xpEl) xpEl.innerText = `獲得XP: +${state.score * APP_CONSTANTS.XP_RATE} XP`;
  
  const earnedXP = state.score * APP_CONSTANTS.XP_RATE;
  state.xp += earnedXP;
  if (state.xp >= APP_CONSTANTS.MAX_XP_PER_LEVEL) {
    state.level++;
    state.xp = state.xp - APP_CONSTANTS.MAX_XP_PER_LEVEL;
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
          // 5回連続クリックで全レベルをアンロック + デバッグモードON（ハート減少なし）
          state.debugMode = true;
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
