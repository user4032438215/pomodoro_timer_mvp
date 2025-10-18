let seconds = 0; // タイマーの秒数を格納する変数の初期化 
let timerId = null; // タイマーIDを格納する変数の初期化
let workSessionType = ''; // 現在のセッションタイプを追跡する変数.. 'full', 'break', 'longbreak', 'mini', 'extended' のいずれか
let workSessionCount = 0; // 作業セッションのカウント
let isMiniSessionCompleted = false; // 5分セッションが終わったかどうかのフラグ

//現在のセッションタイプをHTML上に表示する関数
function getCurrentSessionType() {
  const status = document.getElementById("session-status");

  if (workSessionType === 'full') {
    status.textContent = "💼 作業中";
  } else if (workSessionType === 'break') {
    status.textContent = "☕ 休憩中";
  } else if (workSessionType === 'longbreak') {
    status.textContent = "🌿 長めの休憩中";
  } else if (workSessionType === 'mini') {
    status.textContent = "🕔 5分だけ頑張る！";
  } else if (workSessionType === 'extended') {
    status.textContent = "🚀 調子づいてきた！あと20分！";
  } else {
    status.textContent = "";
  }
}

// タイマーをスタートする関数
function startTimer(duration, type) { // onclick="startTimer(10, 'full')"の1500がdurationに入る。'full'がtypeに入る
  clearInterval(timerId); // 前のタイマーをリセット
  seconds = duration; // 25分、5分、15分の秒数を代入
  workSessionType = type; // 現在のセッションタイプを設定
  showTime(); // 残り時間MM:SSを画面に表示する関数
  getCurrentSessionType(type); // 現在のセッションタイプをHTML上に表示する関数
  disablePrimaryButtons(); // 全てのプライマリーボタンを無効化する関数
  timerId = setInterval(countDown, 1000); // 1秒ごとにcountDown関数を実行だけど正直よくわからんなんで代入しないといけないのか
}

// 1秒ごとにカウントダウンする関数（セッションタイプの状態管理とアイコンカウントとか本来分けるべき処理が混ざってる。。たぶんよくない）
function countDown() {
  seconds--;

  if (seconds < 0) {
    clearInterval(timerId);

    enablePrimaryButtons(); // 全てのプライマリーボタンを有効化する関数

    alert("タイマー終了！");

    //セッションタイプに応じた処理
    if (workSessionType === 'mini') {
      handleMiniSessionEnd(); // 5分ミニセッションが終了した場合にポップアップを表示する関数
    } else if (workSessionType === 'extended') {
      workSessionCount++;
      addWorkIcon(); // 作業セッションが終了した場合、カウントを増やして🔥アイコンを更新する関数
    } else if (workSessionType === 'full') {
      workSessionCount++;
      addWorkIcon(); // 作業セッションが終了した場合、カウントを増やして🔥アイコンを更新する関数
    }

    //セッション終了後セッション数に応じての自動的に休憩カウントダウンを進める
    if (workSessionType === 'full' || workSessionType === 'extended') {
      if (workSessionCount % 3 === 0 && workSessionCount !== 0) {
        // 15分の長めの休憩セッションを開始
        // startTimer(900, 'longbreak'); 
        startTimer(5, 'longbreak');
      } else {
        // 5分の休憩セッションを開始
        // startTimer(300, 'break');
        startTimer(5, 'break');
      }
    } else if (workSessionType === 'break' || workSessionType === 'longbreak') {
      // 休憩セッション終了後に25分の作業セッションを開始
      // startTimer(1500, 'full');
      startTimer(5, 'full');
    }

    closeMiniSession(); //mini-sesionを非表示にする関数

    console.log(workSessionCount); // 挙動確認用
    console.log(workSessionType); // 挙動確認用

    return;
  }

  showTime();
}

//5分ミニセッションが終了した場合にポップアップを表示する関数
// function handleMiniSessionEnd() {
//   if (workSessionType === 'mini' && seconds < 0) {
//     isMiniSessionCompleted = true; // フラグをtrueに設定
//     showPopup();
//   }
// }
//5分ミニセッションが終了した場合にポップアップを表示する関数（seconds < 0の条件は厳しすぎて動作しなかった）
function handleMiniSessionEnd() {
  if (workSessionType === 'mini') {
    isMiniSessionCompleted = true; // フラグをtrueに設定
    showPopup();
  }
}

//ポップアップを表示する関数
function showPopup() {
  document.getElementById("popup").showModal();
}

//ポップアップを閉じる関数
function closePopup(actionType) {
  if (actionType === 'end') {
    alert("おつかれさまでした！");
  }
  document.getElementById("popup").close();

  // //セッション終了後セッション数に応じての自動的に休憩カウントダウンを進める
  // if (workSessionCount % 3 === 0 && workSessionCount !== 0) {
  //   startTimer(900, 'longbreak'); // 15分の長めの休憩セッションを開始
  // } else {
  //   startTimer(300, 'break'); // 5分の休憩セッションを開始
  // }
}

//mini-sesionを非表示にする関数
function closeMiniSession() {
  const element = document.getElementById("mini-session");
  if (element) {
    element.style.display = "none";
  }
}

// タイマーをストップする関数
function pauseTimer() {
  clearInterval(timerId);
  timerId = null; // タイマーIDをリセット
}

// タイマーを再開する関数
function resumeTimer() {
  if (seconds > 0 && !timerId) {
    timerId = setInterval(countDown, 1000);
  }
}

// 残り時間MM:SSを画面に表示する関数
function showTime() {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  document.getElementById("timer-container").textContent = formatted;
  console.log(seconds); // 挙動確認用
}

//🔥アイコンを追加していく関数
function addWorkIcon() {
  const container = document.getElementById("work-icons");
  container.textContent = ""; // 一応中身をカラにしておく
  console.log(workSessionCount); // 挙動確認用

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
// document.querySelectorAll(".primary-buttons button").forEach(btn => btn.disabled = true);
function disablePrimaryButtons() {
  let buttons = document.querySelectorAll(".primary-buttons button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
}

// 全てのプライマリーボタンを有効化する関数
function enablePrimaryButtons() {
  let buttons = document.querySelectorAll(".primary-buttons button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = false;
  }
}