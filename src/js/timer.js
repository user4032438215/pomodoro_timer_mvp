//--挙動管理系
const isDevelopment = true;
function log(tag, ...messages) {
  if (isDevelopment) {
    console.log(`[${tag}]`, ...messages);
  }
}


//--状態管理
let seconds = 0; // タイマーの秒数を格納する変数の初期化 
let timerId = null; // タイマーIDを格納する変数の初期化
let sessionType = ''; // 現在のセッションタイプを追跡する変数.. 'full', 'break', 'longbreak', 'mini', 'extended' のいずれか
let workSessionCount = 0; // 作業セッションのカウント
let isMiniSessionCompleted = false; // 5分セッションが終わったかどうかのフラグ

const alertDelayMS = 50; //マジックナンバー回避 アラートを一瞬遅くすることでアナログUIとのタイミングを合わせる


const sessionLabels = {
  full: "💼 作業中",
  break: "☕ 休憩中",
  longbreak: "🌿 長めの休憩中",
  mini: "🕔 5分だけ頑張る！",
  extended: "🚀 もうあと20分！"
};

const sessionDurations = {
  full: 10, //1500
  break: 5, //300
  longbreak: 5, //900
  mini: 10, //300
  extended: 10 //1200
};

//// 現在のセッションタイプをHTML上に表示する関数←配列に置き換え
// function getCurrentSessionType() {
//   const status = document.getElementById("sessionStatus");
//   let displayText = "";

//   if (!timerId) {
//     displayText = "⏸ 一時停止中";
//   } else {
//     switch (sessionType) {
//       case 'full':
//         displayText = "💼 作業中";
//         break;
//       case 'break':
//         displayText = "☕ 休憩中";
//         break;
//       case 'longbreak':
//         displayText = "🌿 長めの休憩中";
//         break;
//       case 'mini':
//         displayText = "🕔 5分だけ頑張る！";
//         break;
//       case 'extended':
//         displayText = "🚀 もうあと20分！";
//         break;
//       default:
//         displayText = "";
//     }
//   }

//   status.textContent = displayText;
// }



//--タイマー制御
// タイマーをスタートする関数
function startTimer(duration, type) { // onclick="startTimer(10, 'full')"の1500がdurationに入る。'full'がtypeに入る
  prepareTimer(duration, type); // タイマー開始時のUI制御関数群
  beginCountdown(); // カウントダウンを開始する関数
  // getCurrentSessionType(); // セッションタイプの表示を更新
  updateSessionLabel(); //セッション表示の共通処理

  log("startTimer:", { duration, type });
}

// タイマー開始時のUI制御関数群
function prepareTimer(duration, type) {
  clearInterval(timerId); // 前のタイマーをリセット
  seconds = duration; // 25分、5分、15分の秒数を代入
  sessionType = type; // 現在のセッションタイプを設定
  showTime(); // タイマーの秒数・状態・UI表示初期化のため
  // disablePrimaryButtons(); // 全てのプライマリーボタンを無効化する関数
  togglePrimaryButtons(false); //タイマーの一時停止・再開を切り替える関数
  applySessionClass(sessionType);

  log("prepareTimer:", { seconds, sessionType });
}

// カウントダウンを開始する関数
function beginCountdown() {
  timerId = setInterval(countDown, 1000); // 1秒ごとにcountDown関数
}

// 1秒ごとにカウントダウンする関数
function countDown() {
  seconds--;
  if (seconds >= 0) {
    showTime();
  } else {
    clearInterval(timerId);
    timerId = null;
    updateProgress(0, sessionType); // アナログ表記のラグ解消目的で呼び出し
    // pauseTimer();
    handleSesstionEnd();
  }

  log("countDown:", { seconds });
}

//
// function countDown() {
//   if (seconds <= 0) {
//     clearInterval(timerId);
//     timerId = null;
//     updateProgress(0, sessionType); // アナログ表記のラグ解消目的で呼び出し
//     // pauseTimer();
//     handleSesstionEnd();
//   }

//   seconds--;
//   showTime();
//   log("countDown:", { seconds });
// }

//
// function countDown() {
//   // 次の残秒を計算
//   const next = seconds - 1;
//   if (next <= 0) {
//     seconds = 0;
//     clearInterval(timerId);
//     timerId = null;
//     refreshUI();                // 表示を先に確定
//     handleSesstionEnd();        // 一度だけ終了処理
//     return;
//   }

//   seconds = next;
//   refreshUI();                  // showTime + updateProgress 等
//   log("countDown:", { seconds });
// }



// タイマーをストップする関数
function pauseTimer() {
  clearInterval(timerId); //
  timerId = null; // タイマーIDをリセット
  updateProgress(seconds, sessionType); //保険でアナログ表記の時間経過を描画関数を呼び出す。無駄なら後からDRYする
  updateSessionLabel(); //セッション表示の共通処理
  log("pauseTimer:", { seconds, sessionType });
}

// タイマーを再開する関数 
function resumeTimer() {
  if (seconds > 0 && !timerId) {
    timerId = setInterval(countDown, 1000);
    updateSessionLabel(); //セッション表示の共通処理
    log("resumeTimer:", { seconds, sessionType });
  }

  log("pauseTimer:", { seconds, sessionType });
}



//--UI更新
// 残り時間MM:SSを画面に表示する関数
function showTime() {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  document.getElementById("timerContainer").textContent = formatted;
  updateProgress(seconds, sessionType); //アナログ表記の時間経過を描画
}

//セッション表示の共通処理
function updateSessionLabel() {
  const status = document.getElementById("sessionStatus");
  status.textContent = timerId ? sessionLabels[sessionType] || "" : "⏸ 一時停止中";
}

//primary-btnsの制御
//下記の2つの関数を統合→DRY、保守性、可読性UP
function togglePrimaryButtons(enable) {
  document.querySelectorAll(".primary-btns button").forEach(btn => {
    btn.disabled = !enable;
  });
  // for文で書いた場合
  // let buttons = document.querySelectorAll(".primary-btns button");
  // for (let i = 0; i < buttons.length; i++) {
  //   buttons[i].disabled = true;
  // }
}

// タイマーの一時停止・再開のトグルボタンUI制御関数
function updateToggleBtn() {
  const toggleBtn = document.getElementById("toggleTimer");
  toggleBtn.textContent = timerId ? "⏸" : "▶";
}

// タイマーの一時停止・再開を切り替える関数
function toggleTimer() {
  if (seconds <= 0) {
    log("toggleTimer:", "タイマー終了後の操作は無効");
    return;
  }

  timerId ? pauseTimer() : resumeTimer();
  refreshUI(); //↑UI更新関数
  log("toggleTimer:", timerId ? "pause" : "resume");
}

//UI更新をまとめた関数群
function refreshUI() {
  updateProgress(seconds, sessionType); //← ラグいので追加：即時描画更新
  updateSessionLabel(); //セッション表示の共通処理
  updateToggleBtn(); // トグルボタンの表示を更新
}

//--セッション処理
// セッション終了時の共通処理
function handleSesstionEnd() {
  togglePrimaryButtons(true); //
  updateProgress(0, sessionType); //アナログ表記の時間経過を描画

  // alert("タイマー終了！");
  //アナログの残量が0になるよう保険でsetTimeoutメソッドでalertのわずかにタイミングをずらす
  setTimeout(() => {
    alert("タイマー終了！");
    proceedToNextSession();
  }, alertDelayMS);

  log("handleSessionEnd:", sessionType);
  log("proceedToNextSession:", { sessionType, workSessionCount });
}


//
function proceedToNextSession() {
  if (sessionType === 'mini') {
    handleMiniSessionEnd(); // 5分ミニセッションが終了した場合にポップアップを表示する関数
  } else if (sessionType === 'extended' || sessionType === 'full') {
    workSessionCount++;
    addWorkIcon();
  }
  handleBreak(); // 休憩セッションの共通処理
  closeMiniSession(); //miniSesionを非表示にする関数

  log("handleSessionEnd:", sessionType);
  log("proceedToNextSession:", { sessionType, workSessionCount });
}

// 休憩セッションの共通処理
function handleBreak() {
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

}

//🔥アイコンを追加していく関数
function addWorkIcon() {
  const container = document.getElementById("workIcons");
  container.textContent = ""; // 一応中身をカラにしておく
  for (let i = 0; i < workSessionCount; i++) {
    const icon = document.createElement("span"); // span要素を作成
    icon.textContent = "🔥"; // アイコンを設定
    icon.classList.add("work-icon"); // クラスを追加（必要に応じてスタイルを適用するため）
    container.appendChild(icon); // コンテナに追加
    log("🔥");

    // 3回の作業セッションごとに改行を追加
    if ((i + 1) % 3 === 0) container.appendChild(document.createElement("br"));
    //if文バージョンブロックあり
    // if ((i + 1) % 3 === 0) {
    //   container.appendChild(document.createElement("br"));
    // }
  }
}



//--アナログ描画
//アナログ表記の時間経過を描画
function updateProgress(seconds, sessionType) {
  const totalSeconds = sessionDurations[sessionType] || 0;
  const circle = document.querySelector('.ring-fg'); //class="ring-fg"を取得
  const radius = circle.r.baseVal.value; //SVGの円の半径rを数字として取り出す
  const circumference = 2 * Math.PI * radius;
  // let offset;
  // if(seconds <= 0){
  //   offset = circumference;
  // } else {
  //   offset = circumference * (1 - seconds / totalSeconds);
  // }
  const offset = seconds <= 0 ? circumference : circumference * (1 - seconds / totalSeconds);
  // const offset = circumference * (1 - seconds / totalSeconds);
  circle.style.strokeDashoffset = offset;
}

//sessionTypeに応じてUIを変更する関数
function applySessionClass(type) {
  const body = document.body;
  body.classList.remove('session-break', 'session-longbreak');
  if (type === 'break') body.classList.add('session-break');
  if (type === 'longbreak') body.classList.add('session-longbreak');
  //if分二つのほうが拡張性、保守性、バグ耐性の面で優れているためCO
  // if (sessionType === 'break') {
  //   body.classList.add('session-break');
  // } else if (sessionType === 'longbreak') {
  //   body.classList.add('session-longbreak');
  // }
}



//--ポップアップ関連
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
