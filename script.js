// --------------------------
// 要素取得
// --------------------------
const input = document.getElementById('text-input');
const displayArea = document.getElementById('displayArea');
const buttonWrapper = document.getElementById('buttonWrapper');

const showAllBtn = document.getElementById('showAll');
const showCheckedBtn = document.getElementById('showChecked');
const showUncheckedBtn = document.getElementById('showUnchecked');
const deleteCheckedBtn = document.getElementById('deleteChecked');
const remainingCount = document.getElementById('remainingCount');
const checkAllBtn = document.getElementById('checkAll');

const todos = [];
let isComposing = false;


input.addEventListener('compositionstart', () => isComposing = true);
input.addEventListener('compositionend', () => isComposing = false);

function updateRemainingCount() {
  const remaining = todos.filter(p => !p.querySelector('input[type="checkbox"]').checked).length;
  remainingCount.textContent = remaining + ' items left';
}

function clearActive() {
  showAllBtn.classList.remove('active');
  showCheckedBtn.classList.remove('active');
  showUncheckedBtn.classList.remove('active');
}

input.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' || isComposing) return;

  const value = input.value.trim();
  if (!value) return;

  const p = document.createElement('p');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  const textSpan = document.createElement('span');
  textSpan.textContent = value;

  const leftDiv = document.createElement('div');
  leftDiv.className = 'todo-left';
  leftDiv.appendChild(checkbox);
  leftDiv.appendChild(textSpan);

  const button = document.createElement('button');
  const img = document.createElement('img');
  img.src = 'delete-icon.png';
  img.className = 'delete-icon';
  img.alt = '削除';
  img.style.width = '20px';
  img.style.height = '20px';
  button.appendChild(img);

  p.appendChild(leftDiv);
  p.appendChild(button);

  displayArea.appendChild(p);
  todos.push(p);
  input.value = '';
  buttonWrapper.style.display = 'flex';
  checkAllBtn.style.display = 'block';   // ← 追加

  
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

  button.addEventListener('click', () => {
    displayArea.removeChild(p);
    todos.splice(todos.indexOf(p), 1);
    updateRemainingCount();

    if (todos.length === 0) {
  buttonWrapper.style.display = 'none';
  checkAllBtn.style.display = 'none';   // ← 追加
}
  });

  updateRemainingCount();
});

showAllBtn.addEventListener('click', () => {
  clearActive();
  showAllBtn.classList.add('active');
  todos.forEach(p => p.style.display = '');
});

showCheckedBtn.addEventListener('click', () => {
  clearActive();
  showCheckedBtn.classList.add('active');
  todos.forEach(p => {
    const checkbox = p.querySelector('input[type="checkbox"]');
    p.style.display = !checkbox.checked ? '' : 'none';
  });
});

showUncheckedBtn.addEventListener('click', () => {
  clearActive();
  showUncheckedBtn.classList.add('active');
  todos.forEach(p => {
    const checkbox = p.querySelector('input[type="checkbox"]');
    p.style.display = checkbox.checked ? '' : 'none';
  });
});

deleteCheckedBtn.addEventListener('click', () => {
  for (let i = todos.length - 1; i >= 0; i--) {
    const p = todos[i];
    const checkbox = p.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
      displayArea.removeChild(p);
      todos.splice(i, 1);
    }
  }
  updateRemainingCount();
  if (todos.length === 0) {
  buttonWrapper.style.display = 'none';
  checkAllBtn.style.display = 'none';   // ← 追加
}
});

checkAllBtn.addEventListener('click', () => {
  const hasUnchecked = todos.some(p => {
    const checkbox = p.querySelector('input[type="checkbox"]');
    return !checkbox.checked;
  });

  todos.forEach(p => {
    const checkbox = p.querySelector('input[type="checkbox"]');
    const textSpan = p.querySelector('span');

    if (hasUnchecked) {
      checkbox.checked = true;
      textSpan.style.color = 'gray';
      textSpan.style.textDecoration = 'line-through';
    } else {
      checkbox.checked = false;
      textSpan.style.color = 'black';
      textSpan.style.textDecoration = 'none';
    }
  });

  updateRemainingCount();
});

