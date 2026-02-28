/* ============================================
   さくらじまおタイマー - Application Logic
   鹿児島テーマ × 癒しボイス
   ============================================ */

// ============================================
// 🌋 さくらじまおのセリフ集
// ここに好きなセリフを追加・変更してください！
// タイマー終了時にランダムで1つ選ばれて読み上げられます。
// ============================================
const funnyMessages = [
  // 鹿児島あるある
  "時間でごわす！桜島が今日も元気に灰を降らしてるけど、鹿児島県民は基本無視します。",
  "だいたい車を洗った次の日に灰が降って、がっかりします。",
  "はい、終了。今日の桜島、めっちゃ噴火してるけど、特にびっくりしません。",
  "お疲れ様です。",
  "とんかつ食べるなら、竹亭が最後の晩餐にもぴったり。",
  "はい、おしまい。錦江湾に沈む夕日みたいに、めっちゃあなた輝いてるよ。",
  "鹿児島県民は黒板消しのこと、「ラーフル」って言ってたけど、今でも言うのかな。",
  "マリッペかわいい。",
  "タイムアップ。",
  "鹿児島の方言で「ありがとう」は、「あいがとさげもした」って言います。",

  // 鹿児島トリビア
  "終了でごわす。桜島大根は、全盛期の中野浩一の太ももぐらい太いよ。",
  "はい、時間でごわす。焼酎のお湯割りはお湯から入れて、次に焼酎。6：4がおいしいよ！",
  "はい、おしまいでごわす。今日が人生で一番若い日！まずはスクワット2万回からスタート！",
  "鹿児島県のラーメンは、実はとっても美味しいお店がいっぱいあるのでごわす。",
  "鹿児島で水車が回っているお蕎麦のお店「そば茶屋」は、めっちゃ美味しいけど、お昼時はめっちゃ多いのでごわす！",
  "鹿児島の天気予報は、桜島上空の風向きというのを流すのでごわす！",
  "実際、方言で「ごわす」を使っている人は、ほとんどいないのでごわす。",

  // 名言・元気が出るセリフ
  "痛みに耐えてよく頑張った。感動した！",
  "頑張れ、やわらちゃん！",
  "ふなきー！",
  "報われない努力があるとすれば、まだそれは努力とは呼べないのかもしれないね。",
  "小さなことを積み重ねることが、とんでもないところに行くただ一つの道でごわす。",
  "芸術は爆発でごわす！",
  "夢なき者に成功なし。",
  "世の中、大事なことは大抵めんどくさいでごわす。",
  "チャレンジして失敗を恐れるより、何もしないことを恐れろでごわす！",
];

// タイマー動作中のつぶやき
const idleMessages = [
  "タイマーをセットするでごわす！🌋",
  "今日の桜島は穏やかでごわすねぇ",
  "さつまいも食べたいでごわす〜🍠",
  "鹿児島はいいところでごわすよ！",
];

const runningMessages = [
  "がんばれ〜でごわす！💪",
  "いい調子でごわすよ！",
  "桜島が応援してるでごわす🌋",
  "集中、集中でごわす！",
];

// ============================================
// State
// ============================================
let totalSeconds = 0;
let remainingSeconds = 0;
let timerInterval = null;
let alarmInterval = null;
let isRunning = false;
let isPaused = false;
let isAlarming = false;
let pickerMinutes = 0;
let pickerSeconds = 0;

// ============================================
// DOM Elements
// ============================================
const minutesDisplay = document.getElementById('minutesDisplay');
const secondsDisplay = document.getElementById('secondsDisplay');
const timerWrapper = document.getElementById('timerWrapper');
const progressRing = document.getElementById('progressRing');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const characterImg = document.getElementById('characterImg');
const characterWrapper = document.getElementById('characterWrapper');
const speechBubble = document.getElementById('speechBubble');
const speechText = document.getElementById('speechText');

// Spinner
const spinnerPicker = document.getElementById('spinnerPicker');
const spinnerMinutes = document.getElementById('spinnerMinutes');
const spinnerSeconds = document.getElementById('spinnerSeconds');
const minUpBtn = document.getElementById('minUp');
const minDownBtn = document.getElementById('minDown');
const secUpBtn = document.getElementById('secUp');
const secDownBtn = document.getElementById('secDown');

const RING_CIRCUMFERENCE = 2 * Math.PI * 145;

// ============================================
// Ash Particles
// ============================================
function createAshParticles() {
  const container = document.getElementById('ashParticles');
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.classList.add('ash-particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (8 + Math.random() * 12) + 's';
    particle.style.animationDelay = -(Math.random() * 15) + 's';
    particle.style.width = (2 + Math.random() * 4) + 'px';
    particle.style.height = particle.style.width;
    particle.style.opacity = 0.1 + Math.random() * 0.2;
    container.appendChild(particle);
  }
}

// ============================================
// SVG Gradient
// ============================================
function injectSVGGradient() {
  const svg = document.querySelector('.progress-ring');
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'gradient');
  gradient.setAttribute('x1', '0%');
  gradient.setAttribute('y1', '0%');
  gradient.setAttribute('x2', '100%');
  gradient.setAttribute('y2', '100%');

  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#f4a7b9');

  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#c0623a');

  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  svg.insertBefore(defs, svg.firstChild);
}

// ============================================
// Speech Bubble
// ============================================
function showSpeech(text, isActive = false) {
  speechText.textContent = text;
  speechBubble.classList.toggle('active', isActive);
}

// ============================================
// Spinner Picker
// ============================================
function updateSpinnerDisplay() {
  spinnerMinutes.textContent = String(pickerMinutes).padStart(2, '0');
  spinnerSeconds.textContent = String(pickerSeconds).padStart(2, '0');
  if (!isRunning && !isPaused) {
    const total = pickerMinutes * 60 + pickerSeconds;
    totalSeconds = total;
    remainingSeconds = total;
    updateDisplay();
  }
}

function animateSpinner(element, direction) {
  element.classList.remove('bump-up', 'bump-down');
  void element.offsetWidth;
  element.classList.add(direction === 'up' ? 'bump-up' : 'bump-down');
}

function setupSpinnerButton(button, callback) {
  let interval = null;
  let timeout = null;
  const startRepeat = () => {
    callback();
    timeout = setTimeout(() => { interval = setInterval(callback, 100); }, 400);
  };
  const stopRepeat = () => {
    clearTimeout(timeout);
    clearInterval(interval);
  };
  button.addEventListener('mousedown', startRepeat);
  button.addEventListener('mouseup', stopRepeat);
  button.addEventListener('mouseleave', stopRepeat);
  button.addEventListener('touchstart', (e) => { e.preventDefault(); startRepeat(); });
  button.addEventListener('touchend', stopRepeat);
  button.addEventListener('touchcancel', stopRepeat);
}

setupSpinnerButton(minUpBtn, () => { pickerMinutes = (pickerMinutes + 1) % 100; animateSpinner(spinnerMinutes, 'up'); updateSpinnerDisplay(); });
setupSpinnerButton(minDownBtn, () => { pickerMinutes = (pickerMinutes - 1 + 100) % 100; animateSpinner(spinnerMinutes, 'down'); updateSpinnerDisplay(); });
setupSpinnerButton(secUpBtn, () => { pickerSeconds = (pickerSeconds + 1) % 60; animateSpinner(spinnerSeconds, 'up'); updateSpinnerDisplay(); });
setupSpinnerButton(secDownBtn, () => { pickerSeconds = (pickerSeconds - 1 + 60) % 60; animateSpinner(spinnerSeconds, 'down'); updateSpinnerDisplay(); });

spinnerMinutes.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.deltaY < 0) { pickerMinutes = (pickerMinutes + 1) % 100; animateSpinner(spinnerMinutes, 'up'); }
  else { pickerMinutes = (pickerMinutes - 1 + 100) % 100; animateSpinner(spinnerMinutes, 'down'); }
  updateSpinnerDisplay();
}, { passive: false });

spinnerSeconds.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.deltaY < 0) { pickerSeconds = (pickerSeconds + 1) % 60; animateSpinner(spinnerSeconds, 'up'); }
  else { pickerSeconds = (pickerSeconds - 1 + 60) % 60; animateSpinner(spinnerSeconds, 'down'); }
  updateSpinnerDisplay();
}, { passive: false });

// ============================================
// Display Update
// ============================================
function updateDisplay() {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  minutesDisplay.textContent = String(mins).padStart(2, '0');
  secondsDisplay.textContent = String(secs).padStart(2, '0');

  if (totalSeconds > 0) {
    const progress = remainingSeconds / totalSeconds;
    const offset = RING_CIRCUMFERENCE * (1 - progress);
    progressRing.style.strokeDasharray = RING_CIRCUMFERENCE;
    progressRing.style.strokeDashoffset = offset;
  }

  timerWrapper.classList.remove('warning', 'danger', 'finished');
  if (isRunning && remainingSeconds <= 10 && remainingSeconds > 3) {
    timerWrapper.classList.add('warning');
  } else if (isRunning && remainingSeconds <= 3 && remainingSeconds > 0) {
    timerWrapper.classList.add('danger');
  }
}

// ============================================
// Timer Control
// ============================================
function setTimer(seconds) {
  resetTimer();
  totalSeconds = seconds;
  remainingSeconds = seconds;
  pickerMinutes = Math.floor(seconds / 60);
  pickerSeconds = seconds % 60;
  updateSpinnerDisplay();
  updateDisplay();
  showSpeech('セット完了でごわす！スタートを押すでごわす👆');
  characterImg.classList.remove('happy', 'excited');
  void characterImg.offsetWidth;
  characterImg.classList.add('happy');
}

function startTimer() {
  if (remainingSeconds <= 0) {
    const total = pickerMinutes * 60 + pickerSeconds;
    if (total <= 0) return;
    totalSeconds = total;
    remainingSeconds = total;
    updateDisplay();
  }

  unlockAudio(); // スマホのAudio制限を解除
  isRunning = true;
  isPaused = false;
  startBtn.classList.add('hidden');
  pauseBtn.classList.remove('hidden');
  spinnerPicker.classList.add('hidden');

  const msg = runningMessages[Math.floor(Math.random() * runningMessages.length)];
  showSpeech(msg);
  timerWrapper.classList.add('running');

  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateDisplay();
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      isRunning = false;
      timerWrapper.classList.add('finished');
      onTimerComplete();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
  isPaused = true;
  startBtn.classList.remove('hidden');
  pauseBtn.classList.add('hidden');
  startBtn.querySelector('span').textContent = '再開';
  timerWrapper.classList.remove('running', 'warning', 'danger');
  showSpeech('一時停止でごわす。ゆっくりしてくださいね ☕');
}

function stopAlarm() {
  if (alarmInterval) {
    clearTimeout(alarmInterval);
    alarmInterval = null;
  }
  isAlarming = false;
  stopVoice();
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  stopAlarm();
  isRunning = false;
  isPaused = false;
  totalSeconds = 0;
  remainingSeconds = 0;
  startBtn.classList.remove('hidden');
  pauseBtn.classList.add('hidden');
  spinnerPicker.classList.remove('hidden');
  startBtn.querySelector('span').textContent = 'スタート';
  timerWrapper.classList.remove('running', 'warning', 'danger', 'finished');
  pickerMinutes = 0;
  pickerSeconds = 0;
  updateSpinnerDisplay();
  updateDisplay();
  progressRing.style.strokeDasharray = RING_CIRCUMFERENCE;
  progressRing.style.strokeDashoffset = 0;
  const msg = idleMessages[Math.floor(Math.random() * idleMessages.length)];
  showSpeech(msg);
  speechBubble.classList.remove('active');
  characterImg.classList.remove('happy', 'excited');
}

// ============================================
// Timer Complete
// ============================================
function onTimerComplete() {
  isAlarming = true;

  // リセットボタンを「停止」表示に変更
  startBtn.classList.add('hidden');
  pauseBtn.classList.add('hidden');
  spinnerPicker.classList.add('hidden');
  resetBtn.querySelector('span').textContent = '⏹ 停止';

  // 最初のセリフを再生し、チェーン再生を開始
  playNextAlarmMessage();
}

function playNextAlarmMessage() {
  if (!isAlarming) return;

  const msg = getRandomMessage();
  showSpeech(msg, true);
  speakMessage(msg);

  // キャラクターアニメーション
  characterImg.classList.remove('happy', 'excited');
  void characterImg.offsetWidth;
  characterImg.classList.add('excited');
}

function getRandomMessage() {
  return funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
}

// ============================================
// 🎙️ 音声再生（事前生成済みMP3ファイル）
// スマホ対応: 単一Audio要素を再利用 + endedチェーン方式
// ============================================
const VOICE_FILES = {
  main: Array.from({ length: 26 }, (_, i) => `voices/msg_${String(i).padStart(2, '0')}.mp3`),
  easter: Array.from({ length: 5 }, (_, i) => `voices/egg_${String(i).padStart(2, '0')}.mp3`),
};

// スマホ対応: 1つのAudio要素を使い回す（ユーザー操作で初期化）
let sharedAudio = null;
let audioUnlocked = false;

function ensureAudio() {
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = 'auto';
  }
  return sharedAudio;
}

// ユーザーの最初のタップ/クリックでAudioをアンロック（スマホ必須）
function unlockAudio() {
  if (audioUnlocked) return;
  const audio = ensureAudio();
  // 無音再生でアンロック
  audio.src = VOICE_FILES.main[0];
  audio.volume = 0;
  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
    audioUnlocked = true;
    console.log('🔊 Audio unlocked for mobile');
  }).catch(() => { });
}

function playVoice(fileUrl, onEndCallback) {
  const audio = ensureAudio();
  // 前のendedリスナーを削除
  audio.onended = null;
  audio.pause();
  audio.currentTime = 0;
  audio.src = fileUrl;
  audio.volume = 1;

  // 再生終了時のコールバック（チェーン再生用）
  if (onEndCallback) {
    audio.onended = onEndCallback;
  }

  audio.play().catch(e => console.warn('音声再生エラー:', e));
}

function stopVoice() {
  if (sharedAudio) {
    sharedAudio.onended = null;
    sharedAudio.pause();
    sharedAudio.currentTime = 0;
  }
}

// メインのセリフ読み上げ
function speakMessage(text) {
  const idx = funnyMessages.indexOf(text);
  let fileUrl;
  if (idx >= 0 && idx < VOICE_FILES.main.length) {
    fileUrl = VOICE_FILES.main[idx];
  } else {
    fileUrl = VOICE_FILES.main[Math.floor(Math.random() * VOICE_FILES.main.length)];
  }

  // アラーム中は再生終了後に次のメッセージをチェーン再生
  if (isAlarming) {
    playVoice(fileUrl, () => {
      // 2秒の間を空けてから次のセリフ
      alarmInterval = setTimeout(() => {
        if (isAlarming) playNextAlarmMessage();
      }, 2000);
    });
  } else {
    playVoice(fileUrl);
  }
}

// イースターエッグ用の音声再生
function speakEasterEgg(index) {
  if (index >= 0 && index < VOICE_FILES.easter.length) {
    playVoice(VOICE_FILES.easter[index]);
  }
}

// 音声ファイルのプリロード
function preloadVoices() {
  // モバイル対応: fetchで先読みだけしてキャッシュに入れる
  [...VOICE_FILES.main, ...VOICE_FILES.easter].forEach(url => {
    fetch(url).catch(() => { });
  });
  console.log('🎙️ ずんだもんの音声ファイルをプリロード中...');
}

// ステータス表示更新
const statusEl = document.getElementById('voiceStatus');
if (statusEl) statusEl.textContent = 'ずんだもんの声で読み上げるのだ！';

// ============================================
// Character Click Easter Egg
// ============================================
characterImg.addEventListener('click', () => {
  const messages = [
    "えへへ、くすぐったいでごわす！😊",
    "灰が頭に積もってるでごわすか？",
    "さつまいも食べるでごわす？🍠",
    "鹿児島に遊びに来てでごわす！",
    "桜島は今日も元気でごわすよ🌋",
  ];
  const idx = Math.floor(Math.random() * messages.length);
  showSpeech(messages[idx]);
  speakEasterEgg(idx);
  characterImg.classList.remove('happy', 'excited');
  void characterImg.offsetWidth;
  characterImg.classList.add('happy');
});

// ============================================
// Event Listeners
// ============================================
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    setTimer(parseInt(btn.dataset.seconds, 10));
  });
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', () => {
  if (isAlarming) {
    stopAlarm();
    resetBtn.querySelector('span').textContent = 'リセット';
  }
  resetTimer();
});

// ============================================
// Init
// ============================================
injectSVGGradient();
createAshParticles();
updateDisplay();
preloadVoices();
