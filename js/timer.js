let seconds = 0;
let timerId = null;


// タイマーをスタートする関数
function startTimer(duration) { // onclick="startTimer(1500)" の1500がdurationに入る
  clearInterval(timerId); // 前のタイマーをリセット
  seconds = duration; // 25分、5分、15分の秒数を代入
  showTime(); // 残り時間MM:SSを画面に表示する関数

  timerId = setInterval(countDown, 1000); // 1秒ごとにcountDown関数を実行だけど正直よくわからんなんで代入しないといけないのか
}

// 1秒ごとにカウントダウンされる関数
function countDown() {
  seconds--;

  if (seconds < 0) {
    clearInterval(timerId);
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