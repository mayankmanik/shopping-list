import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
  databaseURL: 'https://realtime-database-5711b-default-rtdb.firebaseio.com/',
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, 'shoppingList');

const inputFieldEl = document.getElementById('input-field');
const addButtonEl = document.getElementById('add-button');
const shoppingListEl = document.getElementById('shopping-list');

addButtonEl.addEventListener('click', () => {
  let inputValue = inputFieldEl.value;
  if (inputValue === '') {
    alert('Add any item');
  } else {
    push(shoppingListInDB, inputValue);
    clearInput();
  }
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (const item of itemsArray) {
      let currentItem = item;
      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = `<li>No items yet...</li>`;
  }
});

function clearInput() {
  inputFieldEl.value = '';
}

function clearShoppingListEl() {
  shoppingListEl.innerHTML = '';
}

function appendItemToShoppingListEl(item) {
  const itemId = item[0];
  const itemValue = item[1];
  const listEl = document.createElement('li');
  listEl.innerHTML = itemValue;
  listEl.setAttribute('title', 'Double tap to delete');

  listEl.addEventListener('dblclick', () => {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemId}`);
    remove(exactLocationOfItemInDB);
  });
  shoppingListEl.appendChild(listEl);
}
