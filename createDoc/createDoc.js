let saveDocBtn = document.getElementById('saveDocBtn');
let headingInput = document.getElementById('headingInput');
let previewContainer = document.getElementById('previewContainer');
let InspektBtn = document.getElementById('InspektBtn');
let errorText = document.getElementById('errorText');
let updateBtn = document.getElementById('updateBtn');
let errorDivContainer = document.getElementById('errorDivContainer');
let heading = document.getElementById('heading');
let dateInfoText = document.getElementById('dateInfoText');
let previewDoc = document.getElementById('previewDoc');
errorDivContainer.style.display = 'none';
previewContainer.style.display = 'none';
updateBtn.disabled = true;
InspektBtn.disabled = true;
let state = false;

let idFromDatabase = '';
let dateText = '';
let changedDate = '';

updateBtn.style.display = 'none';

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

tinymce.init({
  selector: '#textContent',
  plugins: 'code',
  toolbar: 'undo redo | forecolor backcolor |  styleselect bold italic underline strikethrough superscript subscript| alginleft alginright | code',
  setup: function (editor) {
    editor.on('change', function () {
      editor.save();
      if ((onchange = editor)) {
        InspektBtn.disabled = false;
        errorText.textContent = '';
        changedDate = new Date().toLocaleString();
      }
    });
  },
});

saveDocBtn.addEventListener('click', () => {
  let headingValue = headingInput.value;
  let contentValue = document.getElementById('textContent').value;
  dateText = new Date().toLocaleString();
  if (!contentValue == '') {
    let newDoc = {
      heading: headingValue,
      content: contentValue,
      created: dateText,
    };
    sendDoc(newDoc);
  } else {
    errorDivContainer.style.display = 'block';
    errorText.textContent = 'Var snäll och skriv in något';
  }
});

const sendDoc = async (newDoc) => {
  await fetch('http://localhost:3000/docs/newDoc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newDoc),
  })
    .then((response) => response.json())
    .then((result) => {
      idFromDatabase = result;

      errorText.textContent = 'Du har nu skapa ett dokument! Du kan fortfarande kolla på den via inspektera knappen. All ändringarna nu räknas som en uppdatering';

      updateBtn.disabled = false;
      saveDocBtn.disabled = true;

      errorDivContainer.style.display = 'block';
      updateBtn.style.display = 'block';
      saveDocBtn.style.display = 'none';
    })
    .catch((error) => console.error(error));
};

InspektBtn.addEventListener('click', () => {
  if (!state) {
    state = !state;
    previewContainer.style.display = 'block';

    heading.innerHTML = 'Rubrik: ' + headingInput.value;
    dateInfoText.innerHTML = 'Skapdes: ' + dateText + ' ' + ' Senast ändring: ' + changedDate;
    previewDoc.innerHTML = document.getElementById('textContent').value;
  } else {
    state = !state;
    previewContainer.style.display = 'none';
  }
});

updateBtn.addEventListener('click', () => {
  errorDivContainer.style.display = 'block';

  let headingValue = headingInput.value;
  let contentValue = document.getElementById('textContent').value;

  if (!contentValue == '') {
    let updatedDoc = {
      id: idFromDatabase,
      heading: headingValue,
      content: contentValue,
      last_changed: changedDate,
    };

    updateDoc(updatedDoc, idFromDatabase);

    previewContainer.style.display = 'block';
    heading.innerHTML = 'Rubrik: ' + headingInput.value;
    dateInfoText.innerHTML = 'Skapdes: ' + dateText + ' ' + ' Senast ändring: ' + changedDate;
    previewDoc.innerHTML = document.getElementById('textContent').value;
  } else {
    errorText.textContent = 'Var snäll och skriv in något';
  }
});

const updateDoc = async (updatedDoc, id) => {
  await fetch(`http://localhost:3000/docs/updateDoc${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedDoc),
  })
    .then((response) => response.json())
    .then((result) => {
      idFromDatabase = result;
      errorText.textContent = 'Du har nu uppdatera ett dokument!';
    })
    .catch((error) => console.error(error));
};

logOutBtn.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});
