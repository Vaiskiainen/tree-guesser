const treesData = [
  { id: 'alder-black', name: { en: 'Black Alder', fi: 'Tervaleppä' }, images: [{ src: '/assets/trees/image15.jpeg', type: 'leaf' }, { src: '/assets/trees/image16.jpeg', type: 'full' }] },
  { id: 'norway-spruce', name: { en: 'Spruce', fi: 'Kuusi' }, images: [{ src: '/assets/trees/image9.png', type: 'full' }, { src: '/assets/trees/image10.jpeg', type: 'leaf' }] },
  { id: 'lime', name: { en: 'Lime', fi: 'Lehmus' }, images: [{ src: '/assets/trees/image6.jpeg', type: 'leaf' }, { src: '/assets/trees/image7.jpeg', type: 'full' }, { src: '/assets/trees/image8.jpeg', type: 'leaf' }] },
  { id: 'maple', name: { en: 'Maple', fi: 'Vaahtera' }, images: [{ src: '/assets/trees/image28.png', type: 'leaf' }, { src: '/assets/trees/image29.png', type: 'full' }] },
  { id: 'ash', name: { en: 'Ash', fi: 'Saarni' }, images: [{ src: '/assets/trees/image17.jpeg', type: 'leaf' }, { src: '/assets/trees/image18.png', type: 'leaf' }] },
  { id: 'juniper', name: { en: 'Juniper', fi: 'Kataja' }, images: [{ src: '/assets/trees/image34.jpeg', type: 'leaf' }, { src: '/assets/trees/image35.jpeg', type: 'full' }] },
  { id: 'rowan', name: { en: 'Rowan', fi: 'Pihlaja' }, images: [{ src: '/assets/trees/image11.jpeg', type: 'leaf' }] },
  { id: 'oak', name: { en: 'Oak', fi: 'Tammi' }, images: [{ src: '/assets/trees/image32.jpeg', type: 'leaf' }, { src: '/assets/trees/image33.png', type: 'leaf' }] },
  { id: 'scots-pine', name: { en: 'Pine', fi: 'Mänty' }, images: [{ src: '/assets/trees/image1.jpeg', type: 'full' }, { src: '/assets/trees/image2.jpeg', type: 'leaf' }] },
  { id: 'cherry', name: { en: 'Bird Cherry', fi: 'Tuomi' }, images: [{ src: '/assets/trees/image3.png', type: 'leaf' }, { src: '/assets/trees/image4.jpeg', type: 'leaf' }, { src: '/assets/trees/image5.jpeg', type: 'full' }] },
  { id: 'chestnut', name: { en: 'Chestnut', fi: 'Hevoskastanja' }, images: [{ src: '/assets/trees/image12.jpeg', type: 'leaf' }, { src: '/assets/trees/image13.jpeg', type: 'full' }] },
  { id: 'birch-downy', name: { en: 'Downy Birch', fi: 'Hieskoivu' }, images: [{ src: '/assets/trees/image14.jpeg', type: 'leaf' }] },
  { id: 'alder-grey', name: { en: 'Grey Alder', fi: 'Harmaaleppä' }, images: [{ src: '/assets/trees/image25.jpeg', type: 'leaf' }, { src: '/assets/trees/image26.jpeg', type: 'leaf' }, { src: '/assets/trees/image27.png', type: 'full' }] },
  { id: 'willow', name: { en: 'Willow', fi: 'Raita' }, images: [{ src: '/assets/trees/image22.png', type: 'leaf' }, { src: '/assets/trees/image23.png', type: 'leaf' }, { src: '/assets/trees/image24.png', type: 'full' }] },
  { id: 'larch', name: { en: 'Larch', fi: 'Lehtikuusi' }, images: [{ src: '/assets/trees/image39.jpeg', type: 'full' }, { src: '/assets/trees/image40.jpeg', type: 'leaf' }] },
  { id: 'aspen', name: { en: 'Aspen', fi: 'Haapa' }, images: [{ src: '/assets/trees/image19.jpeg', type: 'trunk' }, { src: '/assets/trees/image20.jpeg', type: 'leaf' }, { src: '/assets/trees/image21.jpeg', type: 'leaf' }] },
  { id: 'silver-birch', name: { en: 'Silver Birch', fi: 'Rauduskoivu' }, images: [{ src: '/assets/trees/image30.jpeg', type: 'leaf' }, { src: '/assets/trees/image31.png', type: 'full' }] },
  { id: 'elm', name: { en: 'Elm', fi: 'Jalava' }, images: [{ src: '/assets/trees/image36.png', type: 'full' }, { src: '/assets/trees/image37.jpeg', type: 'leaf' }, { src: '/assets/trees/image38.jpeg', type: 'leaf' }] }
];
let lang = localStorage.getItem('treeGuesserLang');

if (!lang) {
  lang = 'en';
  fetch('https://get.geojs.io/v1/ip/country.json')
    .then(res => res.json())
    .then(data => {
      if (data.country === 'FI' && !localStorage.getItem('treeGuesserLang')) {
        lang = 'fi';
        updateLangUI();
        render(true);
      }
    })
    .catch(err => console.error('Error detecting location:', err));
}

let currentQuestion = 0;
let score = 0;
let gameOver = false;
let options = [];
let selectedOption = null;
let gameSequence = [];

const appEl = document.getElementById('app');
const btnEn = document.getElementById('btn-en');
const btnFi = document.getElementById('btn-fi');

btnEn.addEventListener('click', () => {
  lang = 'en';
  localStorage.setItem('treeGuesserLang', 'en');
  updateLangUI();
  render(true);
});

btnFi.addEventListener('click', () => {
  lang = 'fi';
  localStorage.setItem('treeGuesserLang', 'fi');
  updateLangUI();
  render(true);
});

updateLangUI();

function updateLangUI() {
  if (lang === 'en') {
    btnEn.classList.add('active');
    btnFi.classList.remove('active');
  } else {
    btnFi.classList.add('active');
    btnEn.classList.remove('active');
  }
}

function shuffle(array) {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function initGame() {
  gameSequence = shuffle(treesData);
  currentQuestion = 0;
  score = 0;
  gameOver = false;
  prepareQuestion();
}

function prepareQuestion() {
  if (currentQuestion >= gameSequence.length) {
    gameOver = true;
    render();
    return;
  }
  const correctTree = gameSequence[currentQuestion];
  const wrongTrees = shuffle(treesData.filter(t => t.id !== correctTree.id)).slice(0, 3);
  options = shuffle([correctTree, ...wrongTrees]);
  selectedOption = null;
  render();
}

window.handleSelect = function(id) {
  if (selectedOption) return;
  selectedOption = id;
  if (id === gameSequence[currentQuestion].id) {
    score++;
  }
  render(true);
};

window.handleNext = function() {
  currentQuestion++;
  prepareQuestion();
};

window.handleRestart = function() {
  initGame();
};

const iconCheck = `<span class="icon icon-check scale-in"></span>`;
const iconX = `<span class="icon icon-cross scale-in"></span>`;
const iconRefresh = `<span class="icon icon-refresh"></span>`;

function render(preserveAnimation = false) {
  if (gameOver) {
    appEl.innerHTML = `
      <div class="game-over fade-in">
        <h2>${lang === 'en' ? 'Game Over!' : 'Peli Ohi!'}</h2>
        <p>${lang === 'en' ? `You scored ${score} out of ${gameSequence.length}` : `Sait ${score}/${gameSequence.length} oikein`}</p>
        <button class="btn-primary" onclick="handleRestart()">
          ${iconRefresh}
          ${lang === 'en' ? 'Play Again' : 'Pelaa Uudelleen'}
        </button>
      </div>
    `;
    return;
  }
  const correctTree = gameSequence[currentQuestion];
  const isAnswered = selectedOption !== null;
  let optionsHtml = options.map((opt, index) => {
    let btnClass = 'btn-option';
    let iconHtml = '';
    
    if (isAnswered) {
      if (opt.id === correctTree.id) {
        btnClass += ' correct';
        iconHtml = iconCheck;
      } else if (opt.id === selectedOption) {
        btnClass += ' wrong';
        iconHtml = iconX;
      } else {
        btnClass += ' disabled';
      }
    }
    const animStyle = !preserveAnimation && !isAnswered ? `style="animation: fadeInUp 0.4s ease forwards ${index * 0.1}s; opacity: 0;"` : '';
    return `
      <button class="${btnClass}" onclick="handleSelect('${opt.id}')" ${isAnswered ? 'disabled' : ''} ${animStyle}>
        <span>${opt.name[lang]}</span>
        ${iconHtml}
      </button>
    `;
  }).join('');
  let nextBtnHtml = isAnswered ? `
    <div class="next-container fade-in">
      <button class="btn-primary" onclick="handleNext()">
        ${lang === 'en' ? 'Next Tree' : 'Seuraava Puu'}
      </button>
    </div>
  ` : '<div class="next-container"></div>';
  appEl.innerHTML = `
    <div class="progress-bar ${!preserveAnimation ? 'fade-in' : ''}">
      <span>${lang === 'en' ? `Question ${currentQuestion + 1} of ${gameSequence.length}` : `Kysymys ${currentQuestion + 1}/${gameSequence.length}`}</span>
      <span>${lang === 'en' ? `Score: ${score}` : `Pisteet: ${score}`}</span>
    </div>
    <div class="images-container">
      ${correctTree.images.map((img, idx) => {
        let label = '';
        if (img.type === 'trunk') label = lang === 'en' ? 'Trunk' : 'Runko';
        else if (img.type === 'leaf') label = lang === 'en' ? 'Leaves / Needles' : 'Lehdet / Neulaset';
        else if (img.type === 'full') label = lang === 'en' ? 'Full Tree' : 'Koko Puu';
        
        return `
          <div class="image-box ${!preserveAnimation ? 'fade-in' : ''}" style="animation-delay: ${idx * 0.1}s;">
            <div class="image-frame">
              <img src="${img.src}" alt="${label}">
            </div>
            <p>${label}</p>
          </div>
        `;
      }).join('')}
    </div>
    <div class="options-container">
      ${optionsHtml}
    </div>
    ${nextBtnHtml}
  `;
}

initGame();
