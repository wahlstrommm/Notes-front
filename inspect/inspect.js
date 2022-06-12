let previewContainer = document.getElementById('previewContainer');
let infoSumContainer = document.getElementById('infoSumContainer');
let doc;
let printBtn = document.getElementById('printBtn');
let logOutBtn = document.getElementById('logOutBtn');

const init = async () => {
  let params = new URLSearchParams(document.location.search);
  paramsId = params.get('Id');

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

  try {
    await fetch(`http://localhost:3000/showAllDocs/${paramsId}`)
      .then((response) => response.json())
      .then((result) => {
        doc = result[0];
        render(doc);
      });
  } catch (error) {
    console.log(error);
  }
};

const render = (doc) => {
  let text = document.createElement('p');
  text.innerHTML = `
  Id: ${doc.id} <br>
  Rubrik: ${doc.heading}<br>
  Skapades: ${doc.created} <br>
  Senast ändrad:${doc.last_changed}<br>
  Innehåll:`;

  infoSumContainer.append(text);
  previewContainer.innerHTML = doc.heading + doc.content;
};

printBtn.addEventListener('click', () => {
  window.print();
});

logOutBtn.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});

init();
