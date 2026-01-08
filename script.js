// HTML要素を取得
const input = document.getElementById('text-input');
const displayArea = document.getElementById('displayArea');

const todos = [];
const showCheckedBtn = document.getElementById('showChecked');
const showUncheckedBtn = document.getElementById('showUnchecked');
const showAllBtn = document.getElementById('showAll');


// Enterキーが押されたとき
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const value = input.value.trim();
    if (value !== '') {

      // pを作る
      const p = document.createElement('p');

      // チェックボックスを作る
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';  // チェックボックスにする

      // +α. ボタンを作る
      const button = document.createElement('button');
      button.type = 'button';  //ボタン作った。
      button.textContent = '削除';

      // テキストだけspanに入れる
      const textSpan = document.createElement('span');
      textSpan.textContent = ' ' + value;

      // チェックボックスとテキストをpに追加
      p.appendChild(checkbox);
      p.appendChild(textSpan);
      p.appendChild(button);

      // 表示領域・配列に追加
      displayArea.appendChild(p);
      todos.push(p);
      updateRemainingCount();


      // 入力欄をクリア
      input.value = '';

      // チェックボックスが押されたときの処理
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          textSpan.style.color = 'gray';             // 文字をグレーに
          textSpan.style.textDecoration = 'line-through'; // 取り消し線
        } else {
          textSpan.style.color = 'black';            // 元に戻す
          textSpan.style.textDecoration = 'none';
        }
        updateRemainingCount(); // ←チェック変更時に残りアイテム数を更新
      });
      
      // ボタンが押されたときの処理
      button.addEventListener('click', () => {
      displayArea.removeChild(p);
      todos.splice(todos.indexOf(p), 1); // 配列からも削除
      updateRemainingCount(); // ←削除後に残りアイテム数を更新
      });
    }
  }
});

      //すべて完了するボタン
    const checkAllBtn = document.getElementById('checkAll');

    checkAllBtn.addEventListener('click', () => {
      todos.forEach(p => {
      const checkbox = p.querySelector('input[type="checkbox"]');
      const textSpan = p.querySelector('span');
      checkbox.checked = true; // チェックを入れる

      textSpan.style.color = 'gray';
      textSpan.style.textDecoration = 'line-through';
      });
      updateRemainingCount(); // 残りタスク数を更新
    });

      // 完了だけ標示するよボタンが押されたときの処理
      showCheckedBtn.addEventListener('click', () => {
      todos.forEach(p => {
      const checkbox = p.querySelector('input[type="checkbox"]');
      if (checkbox.checked) {
      p.style.display = 'block'; // 表示
      } else {
      p.style.display = 'none';  // 非表示
      }
      });
      });

      // 未完了だけ標示するよボタンが押されたときの処理
      showUncheckedBtn.addEventListener('click', () => {
      todos.forEach(p => {
      const checkbox = p.querySelector('input[type="checkbox"]');
        if (!checkbox.checked) {
        p.style.display = 'block';  // チェックされていないものだけ表示
        } else {
        p.style.display = 'none';   // チェックされているものは非表示
        }
      });
      });

      // 全部表示するよボタンが押されたときの処理
      showAllBtn.addEventListener('click', () => {
      todos.forEach(p => p.style.display = 'block');
      });
      
      //残りのアイテム数を表示する。
      const remainingCount = document.getElementById('remainingCount');

    function updateRemainingCount() {
       var remaining = todos.filter(function(p) {
       var checkbox = p.querySelector('input[type="checkbox"]');
       return !checkbox.checked; //チェックされていないものだけ数える
     }).length;

      remainingCount.textContent = '残りタスク: ' + remaining;
    }
      //(チェックされていないアイテム数の表示。)
