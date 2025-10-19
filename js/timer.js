let seconds = 0; // タイマーの秒数を格納する変数の初期化 
let timerId = null; // タイマーIDを格納する変数の初期化
let sessionType = ''; // 現在のセッションタイプを追跡する変数.. 'full', 'break', 'longbreak', 'mini', 'extended' のいずれか
let workSessionCount = 0; // 作業セッションのカウント
let isMiniSessionCompleted = false; // 5分セッションが終わったかどうかのフラグ


//現在のセッションタイプをHTML上に表示する関数
function getCurrentSessionType() {
  const status = document.getElementById("sessionStatus");
  let displayText = "";

  if (!timerId) {
    displayText = "⏸ 一時停止中";
  } else {
    switch (sessionType) {
      case 'full':
        displayText = "💼 作業中";
        break;
      case 'break':
        displayText = "☕ 休憩中";
        break;
      case 'longbreak':
        displayText = "🌿 長めの休憩中";
        break;
      case 'mini':
        displayText = "🕔 5分だけ頑張る！";
        break;
      case 'extended':
        displayText = "🚀 もうあと20分！";
        break;
      default:
        displayText =  "";
    }
  }

  status.textContent = displayText;
}

// タイマーをスタートする関数
function startTimer(duration, type) { // onclick="startTimer(10, 'full')"の1500がdurationに入る。'full'がtypeに入る
  prepareTimer(duration, type); // タイマー開始時のUI制御関数群
  beginCountdown(); // カウントダウンを開始する関数
  getCurrentSessionType(); // セッションタイプの表示を更新
}

function prepareTimer(duration, type) { // タイマー開始時のUI制御関数群
  clearInterval(timerId); // 前のタイマーをリセット
  seconds = duration; // 25分、5分、15分の秒数を代入
  sessionType = type; // 現在のセッションタイプを設定
  showTime(); // タイマーの秒数・状態・UI表示初期化のため
  // getCurrentSessionType(); // 現在のセッションタイプをHTML上に表示する関数
  disablePrimaryButtons(); // 全てのプライマリーボタンを無効化する関数
}

function beginCountdown() { // カウントダウンを開始する関数
  timerId = setInterval(countDown, 1000); // 1秒ごとにcountDown関数
}

// 1秒ごとにカウントダウンする関数
function countDown() {
  seconds--;
  if (seconds >= 0) {
    showTime();
  }  else {
    pauseTimer();
    handleSesstionEnd();
  }
}

function handleSesstionEnd() { // セッション終了時の共通処理
  enablePrimaryButtons(); // 全てのプライマリーボタンを有効化する関数
  alert("タイマー終了！");

  console.log("sessionType:" + sessionType); // 挙動確認用


  if (sessionType === 'mini') {
    handleMiniSessionEnd(); // 5分ミニセッションが終了した場合にポップアップを表示する関数
  } else if (sessionType === 'extended' || sessionType === 'full') {
    workSessionCount++;
    addWorkIcon();
  }
  handleBreak(); // 休憩セッションの共通処理
  closeMiniSession(); //miniSesionを非表示にする関数

  console.log("workSessionCount:" + workSessionCount); // 挙動確認用
}

function handleBreak() { // 休憩セッションの共通処理
  if (sessionType === 'extended' || sessionType === 'full') {
    if (workSessionCount % 3 === 0 && workSessionCount !== 0) {
      // startTimer(900, 'longbreak');
      startTimer(5, 'longbreak');
    } else {
      // startTimer(300, 'break');
      startTimer(5, 'break');
    }
  } else if (sessionType === 'break' || sessionType === 'longbreak') {
    // startTimer(1500, 'full');
    startTimer(10, 'full');
  }
  console.log("handleBreak:", sessionType, workSessionCount); // 挙動確認用
}

//5分ミニセッションが終了した場合にポップアップを表示する関数（seconds < 0の条件は厳しすぎて動作しなかった）
function handleMiniSessionEnd() {
  if (sessionType === 'mini') {
    isMiniSessionCompleted = true; // フラグをtrueに設定
    showPopup();
  }
}

//ポップアップを表示する関数
function showPopup() {
  document.getElementById("popup").showModal();
}

//ポップアップを閉じる関数
function closePopup() {
  document.getElementById("popup").close();
}

//ポップアップの「今日はここまで」ボタンを押したときの処理関数
function handlePopupEnd() {
  closePopup();
  alert("おつかれさまでした！");
}

//miniSesionを非表示にする関数
function closeMiniSession() {
  const element = document.getElementById("miniSession");
  if (element) {
    element.style.display = "none";
  }
}

// タイマーの一時停止・再開のトグルボタンUI制御関数
function updateToggleBtn() {
  const toggleBtn = document.getElementById("toggleTimer");
  toggleBtn.textContent = timerId ? "⏸" : "▶";
}

// タイマーの一時停止・再開を切り替える関数
function toggleTimer() {
  if (timerId) {
    pauseTimer();
  } else {
    resumeTimer();
  }
  getCurrentSessionType(); // セッションタイプの表示を更新
  updateToggleBtn(); // トグルボタンの表示を更新
}

// タイマーをストップする関数
function pauseTimer() {
  clearInterval(timerId);
  timerId = null; // タイマーIDをリセット
  getCurrentSessionType(); // セッションタイプの表示を更新
}

// タイマーを再開する関数 
function resumeTimer() {
  if (seconds > 0 && !timerId) {
    timerId = setInterval(countDown, 1000);
    getCurrentSessionType(); // セッションタイプの表示を更新
  }
}

// 残り時間MM:SSを画面に表示する関数
function showTime() {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  document.getElementById("timerContainer").textContent = formatted;
  console.log("残り秒数:", seconds); // 挙動確認用
}

//🔥アイコンを追加していく関数
function addWorkIcon() {
  const container = document.getElementById("workIcons");
  container.textContent = ""; // 一応中身をカラにしておく
  console.log("workSessionCount:" + workSessionCount); // 挙動確認用

  for (let i = 0; i < workSessionCount; i++) {
    const icon = document.createElement("span"); // span要素を作成
    icon.textContent = "🔥"; // アイコンを設定
    icon.classList.add("work-icon"); // クラスを追加（必要に応じてスタイルを適用するため）
    container.appendChild(icon); // コンテナに追加
    console.log("🔥"); // 挙動確認用

    // 3回の作業セッションごとに改行を追加
    if ((i + 1) % 3 === 0) {
      container.appendChild(document.createElement("br"));
    }
  }
}

// 全てのプライマリーボタンを無効化する関数
// document.querySelectorAll(".primary-btns button").forEach(btn => btn.disabled = true);
function disablePrimaryButtons() {
  let buttons = document.querySelectorAll(".primary-btns button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
}

// 全てのプライマリーボタンを有効化する関数
function enablePrimaryButtons() {
  let buttons = document.querySelectorAll(".primary-btns button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = false;
  }
}

