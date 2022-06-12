let listContainer = document.getElementById('listContainer');
let deletedContainer = document.getElementById('deletedContainer');
let choiceContainer = document.getElementById('choiceContainer');
let updateContainer = document.getElementById('updateContainer');
let headingInput = document.getElementById('headingInput');
let logOutBtn = document.getElementById('logOutBtn');
let sendNewDocsBtn = document.getElementById('sendNewDocsBtn');
let containerForDoc = document.getElementById('containerForDoc');
updateContainer.style.display = 'none';
sendNewDocsBtn.disabled = true;
let textFromEditor;
let state = true;
let chooseDoc;
const checkLS = () => {
  let LS = localStorage.getItem('logged');
  let LSParsed = JSON.parse(LS);

  if (LSParsed) {
    loggedinContainer.style.display = 'block';
  } else {
    window.location.href = '/Notes-front/Index.html';
  }
};
checkLS();

const getAllDocs = async () => {
  await fetch(`http://localhost:3000/showAllDocs`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((result) => {
      let docsList = result;
      console.log(result);
      console.log(docsList);
      if (!docsList.length == 0) {
        render(docsList);
      } else {
        console.log('TOM LIsta');
        listContainer.innerText = 'Listan är tom';
      }
    })
    .catch((error) => console.error(error));
};
getAllDocs();

const render = (docsList) => {
  //   updateContainer.style.display = 'none';

  for (let i = 0; i < docsList.length; i++) {
    let div = document.createElement('div');
    let btnContainer = document.createElement('div');
    let deleteBtn = document.createElement('button');
    let updateBtn = document.createElement('button');
    let inspectBtn = document.createElement('button');
    let yesBtn = document.createElement('button');
    let noBtn = document.createElement('button');

    yesBtn.innerText = 'Ja jag är säker!';
    noBtn.innerText = 'Avbryt';
    deleteBtn.innerText = 'Radera';
    updateBtn.innerText = 'Uppdatera';

    inspectBtn.innerText = 'Inspektera';
    yesBtn.className = 'button-30';
    noBtn.className = 'button-30';
    deleteBtn.className = 'button-30';
    updateBtn.className = 'button-30';
    inspectBtn.className = 'button-30';

    let text = document.createElement('p');
    var length = 20;
    var trimmedString = docsList[i].content.length > length ? docsList[i].content.substring(0, length - 3) + '...' : docsList[i].content;

    if (docsList[i].deleted == 0) {
      text.innerHTML = `ID: ${docsList[i].id} <br />   Skapades: ${docsList[i].created} <br /> Rubrik: ${docsList[i].heading}  <br/>Innehåll:  ${trimmedString} <br />  Senast ändrad: ${docsList[i].last_changed} <br /> Status: Kvar`;
      div.className = 'docContainer';
      btnContainer.className = 'btnContainer';
      btnContainer.append(deleteBtn, updateBtn, inspectBtn);
      div.append(text, btnContainer);
      // listContainer.append(div);
      containerForDoc.append(div);
    } else {
      text.innerHTML = `ID: ${docsList[i].id} <br />   Skapades: ${docsList[i].created} <br /> Rubrik: ${docsList[i].heading}  <br/> Innehåll:  ${trimmedString} <br />  Senast ändrad: ${docsList[i].last_changed} <br /> Status: Raderad`;
      div.className = 'deletedContainer';
      div.append(text);
      deletedContainer.append(div);
    }

    deleteBtn.addEventListener('click', () => {
      if (state) {
        choiceContainer.innerHTML = '';
        console.log('Klcckar på ' + docsList[i].id);
        choiceContainer.append('Är du säker? Detta går inte att ändra...', yesBtn, noBtn);
        div.append(choiceContainer);

        state = !state;
      } else if (!state) {
        choiceContainer.innerHTML = '';
        state = !state;
      }
    });

    noBtn.addEventListener('click', () => {
      choiceContainer.innerHTML = '';
      state = !state;
    });

    yesBtn.addEventListener('click', () => {
      deleteDoc(docsList[i].id);
    });

    updateBtn.addEventListener('click', () => {
      if (state) {
        updateContainer.style.display = 'block';
        chooseDoc = docsList[i].id;
        console.log('ChooseDoc', chooseDoc);
        div.append(updateContainer);
        getLatestDocForUpdate(docsList[i].id);
        state = !state;
      } else if (!state) {
        updateContainer.style.display = 'none';
        location.reload();

        state = !state;
      }
    });
    inspectBtn.addEventListener('click', () => {
      let Id = docsList[i].id;
      console.log(Id);
      inspectDoc(Id);
    });
  }
};

const inspectDoc = async (Id) => {
  console.log(Id);
  console.log(typeof Id);
  window.location.href = '../inspect/inspect.html?Id=' + Id;
};

const getLatestDocForUpdate = async (id) => {
  console.log('GETLATEST');
  let headingFromResp = '';
  let contentFromResp = '';
  console.log(id);
  await fetch(`http://localhost:3000/showAllDocs/${id}`, {
    method: 'Get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      console.log(result[0].content);
      headingInput.value = result[0].heading;
      headingFromResp = result[0].heading;
      contentFromResp = result[0].content;
      //   renderUpdate(headingFromResp, contentFromResp);
    })
    .catch((error) => console.error(error));

  await tinymce.init({
    selector: '#title',
    plugins: 'code',
    toolbar: 'undo redo | forecolor backcolor |  styleselect bold italic underline strikethrough superscript subscript| alginleft alginright | code',
    init_instance_callback: function (editor) {
      editor.setContent(`${contentFromResp}`);
      //   console.log('Editor', `${contentFromResp}`);
    },
    setup: function (editor) {
      editor.on('change', function () {
        editor.save();
        sendNewDocsBtn.disabled = false;
        textFromEditor = editor.save();
      });
    },
  });
};

const deleteDoc = async (id) => {
  console.log(id);
  await fetch(`http://localhost:3000/showAllDocs/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      location.reload();
    })
    .catch((error) => console.error(error));
};

sendNewDocsBtn.addEventListener('click', () => {
  console.log(chooseDoc);
  let headingValue = headingInput.value;
  let contentValue = textFromEditor;
  console.log(contentValue);
  console.log('SEND DOC BTN', headingValue, contentValue);
  let date = new Date().toLocaleString('sv');
  //   .toLocaleString('sv', { timeZone: 'Europe/Paris' })
  console.log(date, new Date());
  LastChanged = date;

  let updatedDoc = {
    heading: headingValue,
    content: contentValue,
    last_changed: date,
  };
  sendUpdateDoc(updatedDoc, chooseDoc);
});

const sendUpdateDoc = async (updatedDoc, chooseDoc) => {
  console.log('SendUpdateDOC', updatedDoc, chooseDoc);

  await fetch(`http://localhost:3000/showAllDocs/updated/${chooseDoc}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedDoc),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result) {
        let message = confirm('Dokumentet är nu uppdaterad!');
        if (message == true) {
          window.location.reload();
        }
      }
    })
    .catch((error) => console.error(error));
};

logOutBtn.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});
