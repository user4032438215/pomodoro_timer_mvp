ブレスト用MD

アナログタイマー表示
セッション状態表示（sessionStatus）
BGM切り替えUI

メインとするカラーは低い彩度のブルーやニュートラルなグレーがベース
UIの明度差が小さい（脳を刺激しすぎない）
操作負荷を極限まで下げる
注意を分散させない
↓
モダンなアプリケーションは
ユーザーがずっと作業しても疲れない」ことがKPIであり、アプリから離れる」ことは失敗指標
ただし僕のアプリがやろうとしている
“休憩＝アプリを一時的に離れることを促す”
という設計は、モダンUIとは真逆の思想
これはすごく珍しく、そして正しい挑戦

アプリケーション全体ではモダンなアプリケーションの設計、カラーマネジメントを模倣しつつ、”休憩”というセッション中だけは色相を大きく変えず、明度や彩度をコントロールすることでユーザーに視覚的なセションの切り替えを促す

アナログタイマー表示、デジタルタイマー表示コンソール上のカウントダウンあたりに軽微なバグあり。
具体的には
[prepareTimer:] {seconds: 10, sessionType: 'mini'}
timer.js:5 [startTimer:] {duration: 10, type: 'mini'}
timer.js:5 [countDown:] {seconds: 9}
timer.js:5 [countDown:] {seconds: 8}
timer.js:5 [countDown:] {seconds: 7}
timer.js:5 [countDown:] {seconds: 6}
timer.js:5 [countDown:] {seconds: 5}
timer.js:5 [countDown:] {seconds: 4}
timer.js:5 [countDown:] {seconds: 3}
timer.js:5 [countDown:] {seconds: 2}
timer.js:5 [countDown:] {seconds: 1}
timer.js:5 [countDown:] {seconds: 0}
timer.js:5 [handleSessionEnd:] mini
timer.js:5 [proceedToNextSession:] {sessionType: 'mini', workSessionCount: 0}
timer.js:5 [countDown:] {seconds: -1}
timer.js:5 [handleSessionEnd:] mini
timer.js:5 [proceedToNextSession:] {sessionType: 'mini', workSessionCount: 0}

timer.js:5 [countDown:] {seconds: -1}とマイナスまでカウントダウンされてしまう。→今後使用を追加していく過程でのバグのリスクになるかもしれないから根本的な解決が必要。

CSSの分割、現在から新たにUIの変更のDOM操作実装予定もある

- 誤操作防止（停止中は再開ボタン以外を無効化）→最初の2択以降は停止再開のトグルボタン以外非表示にする仕様に変更予定 25/10/27変更済み

根本的な解決は後回し。

**UX仕様書のブラッシュアップが最優先→Canvaで状態図の整理** 

❗️課題と懸念
🔥が増えすぎるとUIが縦に伸びてノイズになる可能性
3ポモドーロを何セット行ったかが明示されない
案1.3	🔥最大表示数制限＋セット数を数字で表示	実装が簡単で視認性が高い	情報量が減る可能性←一番有力 FORCUS TO DOに近い
案1.1	🔥を横並びにしてスペース区切り	ノイズ軽減、視認性UP	折り返し処理が必要
案1.2	🔥×3をバッジ化して表示	セット感が明確	CSS設計が必要


「今日はここまで」ボタンが存在しない → 終了の意思表示ができない
🛑 終了ボタン＋ナッジ付きダイアログ
UI構成
「今日はここまで」ボタン → #end-session-btn

<dialog id="end-dialog"> にナッジ付き選択肢

💪 やっぱりまだ頑張る！or🛌 終了する

🛌 終了するを選択した場合のアラート実装メモ
function endSession() {
  clearInterval(timerId);
  timerId = null;
  const totalMinutes = Math.floor(workSessionCount * sessionDurations.full / 60);
  alert(`今日は ${totalMinutes} 分集中できました！素晴らしい集中力！お疲れ様です！`);
}
