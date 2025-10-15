let seconds = 0;
let timerId = null;
workSessionType = ''; // 現在のセッションタイプを追跡する変数.. 'work', 'break', 'longbreak'のいずれか
let workSessionCount = 0; // 作業セッションのカウント

//現在のセッションタイプをHTML上に表示する関数
function getCurrentSessionType(){
  const status = document.getElementById("session-status");

  if (workSessionType === 'work') {
    status.textContent = "作業中";
  } else if (workSessionType === 'break') {
    status.textContent = "休憩中";
  } else if (workSessionType === 'longbreak') {
    status.textContent = "長めの休憩中";
  } else {
    status.textContent = "";
  }
}



// タイマーをスタートする関数
function startTimer(duration, type) { // onclick="startTimer(1500)" の1500がdurationに入る
  clearInterval(timerId); // 前のタイマーをリセット
  seconds = duration; // 25分、5分、15分の秒数を代入
  workSessionType = type; // 現在のセッションタイプを設定
  showTime(); // 残り時間MM:SSを画面に表示する関数
  getCurrentSessionType(type); // 現在のセッションタイプをHTML上に表示する関数
  timerId = setInterval(countDown, 1000); // 1秒ごとにcountDown関数を実行だけど正直よくわからんなんで代入しないといけないのか
}

// 1秒ごとにカウントダウンされる関数
function countDown() {
  seconds--;

  if (seconds < 0) {
    clearInterval(timerId);

    // 作業セッションが終了した場合、カウントを増やして🔥アイコンを更新
    if (workSessionType === 'work') {
      workSessionCount++;
      addWorkIcon();
    }

    alert("タイマー終了！");
    return;
  }

  showTime();
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





// let seconds = 1500; // 25分を秒に変換

// function countDown() {
//   seconds--;
//   if (seconds < 0) {
//     clearInterval(timerId);
//     alert("25分経過しました。休憩しましょう！");
//     return;
//   }
//   console.log(seconds);
// }

// setInterval(countDown, 1000);


// let seconds = 300; // 5分を秒に変換

// function countDown() {
//   seconds--;
//   if (seconds < 0) {
//     clearInterval(timerId);
//     alert("5分経過しました。作業に戻りましょう！");
//     return;
//   }
//   console.log(seconds);
// }

// setInterval(countDown, 1000);

// let seconds = 900; // 25分を秒に変換

// function countDown() {
//   seconds--;
//   if (seconds < 0) {
//     clearInterval(timerId);
//     alert("15分経過しました。作業に戻りましょう！");
//     return;
//   }
//   console.log(seconds);
// }

// setInterval(countDown, 1000);




// document.getElementById("timer-container").textContent = seconds;