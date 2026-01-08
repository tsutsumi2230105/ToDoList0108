// HTML要素を取得
const input = document.getElementById('text-input');
const displayArea = document.getElementById('displayArea');

const todos = [];
const showCheckedBtn = document.getElementById('showChecked');
const showUncheckedBtn = document.getElementById('showUnchecked');
const showAllBtn = document.getElementById('showAll');
const deleteCheckedBtn = document.getElementById('deleteChecked');

let isComposing = false;

input.addEventListener('compositionstart', () => {
  isComposing = true;
});

input.addEventListener('compositionend', () => {
  isComposing = false;
});

input.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' || isComposing) return; // IME変換中は無視

  const value = input.value.trim();
  if (!value) return; // 空文字は無視

  // p要素作成
  const p = document.createElement('p');

  // チェックボックス作成
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  // 削除ボタン作成
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = '削除';

  // テキストspan作成
  const textSpan = document.createElement('span');
  textSpan.textContent = ' ' + value;

  // pに要素を追加
  p.appendChild(checkbox);
  p.appendChild(textSpan);
  p.appendChild(button);

  // 表示領域に追加
  displayArea.appendChild(p);
  todos.push(p);
  updateRemainingCount();

  // 入力欄クリア
  input.value = '';

  // チェックボックス変更
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      textSpan.style.color = 'gray';
      textSpan.style.textDecoration = 'line-through';
    } else {
      textSpan.style.color = 'black';
      textSpan.style.textDecoration = 'none';
    }
    updateRemainingCount();
  });

  // 削除ボタン
  button.addEventListener('click', () => {
    displayArea.removeChild(p);
    todos.splice(todos.indexOf(p), 1);
    updateRemainingCount();
  });
});

      //すべて完了するボタン
    const checkAllBtn = document.getElementById('checkAll');

      checkAllBtn.addEventListener('click', () => {
        // 1. 未完了のタスクが1つでもあるか確認
       const hasUnchecked = todos.some(p => {
        const checkbox = p.querySelector('input[type="checkbox"]');
        return !checkbox.checked;
      });

      todos.forEach(p => {
        const checkbox = p.querySelector('input[type="checkbox"]');
        const textSpan = p.querySelector('span');

      if (hasUnchecked) {
        // 未完了タスクがある場合 → すべて完了にする
        checkbox.checked = true;
        textSpan.style.color = 'gray';
        textSpan.style.textDecoration = 'line-through';
      } else {
       // すべて完了済みの場合 → すべて未完了に戻す
        checkbox.checked = false;
        textSpan.style.color = 'black';
        textSpan.style.textDecoration = 'none';
      }
    });

    updateRemainingCount(); // 残りタスク数を更新
  });

      // 完了だけ標示するよボタンが押されたときの処理
      showCheckedBtn.addEventListener('click', () => {
        todos.forEach(p => {
         const checkbox = p.querySelector('input[type="checkbox"]');
         p.style.display = checkbox.checked ? '' : 'none'; // ←ここを '' に変更
       });
    });

      // 未完了だけ標示するよボタンが押されたときの処理
      showUncheckedBtn.addEventListener('click', () => {
        todos.forEach(p => {
          const checkbox = p.querySelector('input[type="checkbox"]');
          p.style.display = !checkbox.checked ? '' : 'none';
        });
      });

      // 全部表示するよボタンが押されたときの処理
      showAllBtn.addEventListener('click', () => {
      todos.forEach(p => p.style.display = '');
      });
      
      // 完了しているものを削除ボタンが押されたときの処理
      deleteCheckedBtn.addEventListener('click', () => {

        for (let i = todos.length - 1; i >= 0; i--) {
          const p = todos[i];
          const checkbox = p.querySelector('input[type="checkbox"]');
          if (checkbox.checked) {
          displayArea.removeChild(p);
          todos.splice(i, 1); // 配列からも削除        
          }
        }
         updateRemainingCount(); // ←削除後に残りアイテム数を更新
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
