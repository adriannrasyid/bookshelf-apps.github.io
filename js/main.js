const shelfs = [];
const RENDER_EVENT = "render-shelf";
const SAVED_EVENT = "saved-shelf";
const STORAGE_KEY = "BOOK_APPS";

function generateId() {
  return +new Date();
}

function generateShelfObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
}

function findShelf(shelfId) {
  for (const shelfItem of shelfs) {
    if (shelfItem.id === shelfId) {
      return shelfItem;
    }
  }
  return null;
}

function findShelfIndex(shelfId) {
  for (const index in shelfs) {
    if (shelfs[index].id === shelfId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser is not support local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(shelfs);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const shelf of data) {
      shelfs.push(shelf);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeShelf(shelfObject) {
  const { id, title, author, year, isComplete } = shelfObject;

  const textTitle = document.createElement("h3");
  textTitle.classList.add("item-list");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = author;

  const textYear = document.createElement("p");
  textYear.innerText = year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.append(textContainer);

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(container);
  article.setAttribute("id", `todo-${id}`);

  if (isComplete) {
    const unreadButton = document.createElement("button");
    unreadButton.classList.add("green-unread");
    unreadButton.innerText = "Belum selesai dibaca";
    unreadButton.addEventListener("click", function () {
      undoToUnread(id);
    });

    const deleteButtonRead = document.createElement("button");
    deleteButtonRead.classList.add("red-unread");
    deleteButtonRead.innerText = "Hapus buku";
    deleteButtonRead.addEventListener("click", function () {
      deleteShelf(id);
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
    buttonContainer.append(unreadButton, deleteButtonRead);

    article.append(buttonContainer);
  } else {
    const readButton = document.createElement("button");
    readButton.classList.add("green-read");
    readButton.innerText = "Selesai dibaca";
    readButton.addEventListener("click", function () {
      addToRead(id);
    });

    const deleteButtonUnread = document.createElement("button");
    deleteButtonUnread.classList.add("red-read");
    deleteButtonUnread.innerText = "Hapus buku";
    deleteButtonUnread.addEventListener("click", function () {
      deleteShelf(id);
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
    buttonContainer.append(readButton, deleteButtonUnread);

    article.append(buttonContainer);
  }

  return article;
}

function addShelf() {
    const titleShelf = document.getElementById("inputBookTitle").value;
    const authorShelf = document.getElementById("inputBookAuthor").value;
    const yearShelf = document.getElementById("inputBookYear").value;
  
    const generatedID = generateId();
    const isChecked = document.getElementById("inputBookIsComplete").checked;

    const shelfObject = generateShelfObject(
            generatedID,
            titleShelf,
            authorShelf,
            yearShelf,
            isChecked
        );
        shelfs.push(shelfObject);
        
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addToRead(shelfId) {
  const shelfTarget = findShelf(shelfId);
  if (shelfTarget == null) return;
  shelfTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteShelf(shelfId) {
  const shelfTarget = findShelfIndex(shelfId);
  if (shelfTarget === -1) return;
  shelfs.splice(shelfTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoToUnread(shelfId) {
  const shelfTarget = findShelf(shelfId);
  if (shelfTarget == null) return;
  shelfTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addShelf();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const findBook = document.getElementById("searchBook");
const findTitle = document.querySelector("#searchBookTitle");

findBook.addEventListener("submit", function (e) {
  e.preventDefault();

  const titleValue = findTitle.value.toLowerCase().trim();

  const findValue = shelfs.filter((book) => {
    return (
      book.title.toLowerCase().includes(titleValue) ||
      book.author.toLowerCase().includes(titleValue) ||
      book.year.toString().includes(titleValue)
    );
  });

  search(findValue);
});

function search(value) {
  const uncompletedShelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completedShelfList = document.getElementById("completeBookshelfList");

  uncompletedShelfList.innerHTML = "";
  completedShelfList.innerHTML = "";

  for (const book of value) {
    const bookItem = makeShelf(book);

    if (book.isComplete) {
      completedShelfList.append(bookItem);
    } else {
      uncompletedShelfList.append(bookItem);
    }
  }
}

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan");
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedShelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completedShelfList = document.getElementById("completeBookshelfList");

  uncompletedShelfList.innerHTML = "";
  completedShelfList.innerHTML = "";

  for (const shelfItem of shelfs) {
    const shelfElement = makeShelf(shelfItem);
    if (shelfItem.isComplete) {
      completedShelfList.append(shelfElement);
    } else {
      uncompletedShelfList.append(shelfElement);
    }
  }
});
