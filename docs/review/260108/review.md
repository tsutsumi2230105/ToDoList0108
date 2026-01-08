# Todo リストアプリ コードレビュー

**レビュー日**: 2026/01/08
**対象者**: 堤さん
**プロジェクト**: ToDoList0108

---

## 総評

JS 初心者として**十分に良くできています**。基本機能が網羅されており、IME 対応や逆順削除など細かい部分まで考慮されている点は評価できます。

---

## 良い点

### 1. 基本機能が網羅されている

Todo アプリに必要な以下の機能がすべて実装済み：

- タスクの追加
- タスクの削除
- 完了/未完了の切り替え
- フィルタリング（すべて/完了/未完了）
- 一括完了/一括解除
- 完了済み一括削除
- 残りタスク数の表示

### 2. IME 対応 (`script.js:11-19`)

```javascript
input.addEventListener("compositionstart", () => {
  isComposing = true;
});

input.addEventListener("compositionend", () => {
  isComposing = false;
});
```

日本語入力時の Enter 誤動作を防止している。これは見落としがちなポイントなので素晴らしい。

### 3. 空文字チェック (`script.js:24-25`)

```javascript
const value = input.value.trim();
if (!value) return;
```

`trim()`で空白のみの入力を防止している。

### 4. 配列の逆順削除 (`script.js:130`)

```javascript
for (let i = todos.length - 1; i >= 0; i--) {
```

`for`ループで逆順に削除することでインデックスずれを回避している。これは初心者がよく間違えるポイントなので、正しく実装できている。

---

## 改善点

### 1. `var` と `const/let` の混在 [優先度: 高]

**場所**: `script.js:145-146`

**現状**:

```javascript
function updateRemainingCount() {
   var remaining = todos.filter(function(p) {
   var checkbox = p.querySelector('input[type="checkbox"]');
```

**問題**: 他の箇所では`const`とアロー関数を使っているのに、ここだけ`var`と`function`式を使用している。

**改善案**:

```javascript
function updateRemainingCount() {
  const remaining = todos.filter((p) => {
    const checkbox = p.querySelector('input[type="checkbox"]');
    return !checkbox.checked;
  }).length;

  remainingCount.textContent = "残りタスク: " + remaining;
}
```

---

### 2. スタイル変更ロジックの重複 [優先度: 高]

**場所**: `script.js:57-66` と `script.js:90-99`

**現状**: チェックボックスの状態変更時のスタイル処理が 2 箇所に重複している。

**改善案**: 関数化して再利用する。

```javascript
function updateTextStyle(textSpan, isChecked) {
  textSpan.style.color = isChecked ? "gray" : "black";
  textSpan.style.textDecoration = isChecked ? "line-through" : "none";
}
```

---

### 3. `<p>`タグの不適切な使用 [優先度: 高]

**場所**: `script.js:28, 44-46`

**現状**:

```javascript
const p = document.createElement("p");
// ...
p.appendChild(checkbox);
p.appendChild(textSpan);
p.appendChild(button);
```

**問題**: `<p>`タグは「段落（paragraph）」を意味するが、Todo アイテムは段落ではなく**リスト項目**である。

- HTML 仕様上、`<input>`や`<button>`は`<p>`内に配置可能（フレージングコンテンツのため）
- しかし**セマンティクス的に不適切**
- アクセシビリティ（スクリーンリーダー等）にも影響する

**改善案**: `<ul>/<li>`構造 + `<label>`を使用する。

```html
<!-- 現状（不適切） -->
<p>
  <input type="checkbox" />
  <span>タスク内容</span>
  <button>削除</button>
</p>

<!-- 推奨 -->
<ul id="displayArea">
  <li>
    <label>
      <input type="checkbox" />
      <span>タスク内容</span>
    </label>
    <button>削除</button>
  </li>
</ul>
```

**メリット**:

1. **セマンティクス**: Todo リストは「リスト」なので`<ul>/<li>`が適切
2. **アクセシビリティ**: `<label>`でチェックボックスを囲むと、テキストクリックでもチェックできる
3. **スクリーンリーダー対応**: リスト構造として正しく読み上げられる

---

### 4. HTML にインラインスタイル [優先度: 中]

**場所**: `index.html:14`

**現状**:

```html
<div
  id="inputWrapper"
  style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 40px;"
></div>
```

**改善案**: CSS ファイルに移動する。

```css
#inputWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
}
```

---

### 5. セマンティック HTML の改善 [優先度: 低]

**現状**: ボタン群が`<body>`直下に並んでいる。

**改善案**:

- ボタン群を`<footer>`や`<nav>`で囲む

---

### 6. コメントの誤字 [優先度: 低]

**場所**: `script.js:106, 114`

**現状**:

```javascript
// 完了だけ標示するよボタン
// 未完了だけ標示するよボタン
```

**改善案**: 「標示」→「表示」

---

### 7. CSS セレクタの競合 [優先度: 低]

**場所**: `style.css:31` と `style.css:57`

**現状**:

```css
#displayArea p {
  font-size: 28px;
  /* ... */
}

p {
  font-size: 10px;
  text-align: center;
}
```

**問題**: `#displayArea p`と素の`p`セレクタが競合し、意図しないスタイルが適用される可能性がある。

**改善案**: より具体的なセレクタを使用するか、クラス名で管理する。

---

### 8. データ構造の問題 [優先度: 中]

**場所**: `script.js:5, 50`

**現状**:

```javascript
const todos = [];
// ...
todos.push(p); // DOM要素を直接配列に保存
```

**問題**: DOM 要素を直接配列に保存しているため、データと表示が分離されていない。これにより以下の問題が発生する可能性がある：

- データの永続化（ローカルストレージ保存など）が困難
- データの検索・フィルタリングが複雑
- テストが書きにくい

**改善案**: データ構造をオブジェクト配列で管理し、表示は別関数で生成する。

```javascript
const todos = []; // { id: number, text: string, completed: boolean } の配列

function createTodoElement(todo) {
  const p = document.createElement("p");
  // ... 要素作成
  return p;
}

function renderTodos() {
  displayArea.innerHTML = "";
  todos.forEach((todo) => {
    const element = createTodoElement(todo);
    displayArea.appendChild(element);
  });
}
```

---
