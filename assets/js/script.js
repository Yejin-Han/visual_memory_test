const mainContainer = document.querySelector('.main-container');
const titleContainer = document.querySelector('.title-container');
const gameContainer = document.querySelector('.game-container');
const endingContainer = document.querySelector('.ending-container');
const btnStart = document.querySelector('.btn-start');
const btnHome = document.querySelector('.btn-home');
const levelDisplay = document.querySelector('.level');
const livesDisplay = document.querySelectorAll('.lives > svg');
const endLevelDisplay = document.querySelector('.end-level');

let l = 1; // 레벨
let lives = 3; // 목숨

let interactable = false; // 그리드 아이템 클릭 가능 상태 플래그
let errorClicked = 0; // 잘못된 아이템 클릭 횟수

function show(elem) {
  elem.style.display = 'block';
}

function showFlex(elem) {
  elem.style.display = 'flex';
}

function hide(elem) {
  elem.style.display = 'none';
}

const toggleAudio = () => {
  document.querySelector('.audio-container').addEventListener('click', function() {
    let container = this;
    if (container.querySelector('svg').getAttribute('data-icon') === "volume-up") {
      container.innerHTML = `<svg data-prefix="fas" data-icon="volume-mute" class="svg-inline--fa fa-volume-mute fa-w-16 fa-2x" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">Toggle sound effects on and off</title><path fill="currentColor" d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM461.64 256l45.64-45.64c6.3-6.3 6.3-16.52 0-22.82l-22.82-22.82c-6.3-6.3-16.52-6.3-22.82 0L416 210.36l-45.64-45.64c-6.3-6.3-16.52-6.3-22.82 0l-22.82 22.82c-6.3 6.3-6.3 16.52 0 22.82L370.36 256l-45.63 45.63c-6.3 6.3-6.3 16.52 0 22.82l22.82 22.82c6.3 6.3 16.52 6.3 22.82 0L416 301.64l45.64 45.64c6.3 6.3 16.52 6.3 22.82 0l22.82-22.82c6.3-6.3 6.3-16.52 0-22.82L461.64 256z"></path></svg>`;
    } else {
      container.innerHTML = `<svg data-prefix="fas" data-icon="volume-up" class="svg-inline--fa fa-volume-up fa-w-18 fa-2x" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><title>Toggle sound effects on and off</title><path fill="currentColor" d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z"></path></svg>`;
    }
  });
}

toggleAudio();

btnStart.addEventListener('click', () => {
  hide(titleContainer);
  show(gameContainer);

  createGrid(l);
});

btnHome.addEventListener('click', () => {
  hide(endingContainer);
  show(titleContainer);
  initializeGame();
});

const createGrid = (level) => {
  const n = Math.floor(Math.sqrt(9 + 3 * level)); // 그리드 개수
  const h = level + 2; // 정답 개수
  const con = document.querySelector('.grid');
  con.innerHTML = '';
  levelDisplay.textContent = level;

  let answerSet = new Set(); // 정답 세트
  
  // n x n개의 item 중에 0 ~ (h-1)개의 랜덤 정답을 만듦
  while(answerSet.size < h) {
    const ranIdx = Math.floor(Math.random() * n * n);
    answerSet.add(ranIdx);
  }
  console.log('정답', answerSet);
  
  for(let i = 0; i < n; i++) {
    const row = document.createElement('div');
    row.className = 'grid-row';

    for(let j = 0; j < n; j++) {
      const item = document.createElement('div');
      const itemWidth = Math.floor(con.offsetWidth / n);
      item.style.width = itemWidth + 'px';
      item.style.height = itemWidth + 'px';
      item.style.borderWidth = (itemWidth * 0.0625) + 'px';
      item.style.borderRadius = (itemWidth * 0.125) + 'px';
      item.className = 'grid-item';
      item.dataset.index = i * n + j;
      row.appendChild(item);
    }

    con.appendChild(row);
  }

  const gridItem = document.querySelectorAll('.grid-item');

  showAnswer(gridItem, answerSet);

  clickAnswer(gridItem, answerSet);
}

const showAnswer = (gridItem, set) => {
  interactable = false;

  gridItem.forEach((item, idx) => {
    for(const num of set) {
      if(num == idx) {
        setTimeout(() => {
          item.classList.add('active');

          setTimeout(() => {
            item.classList.remove('active');

            if(idx === Math.max(...set)) {
              setTimeout(() => {
                interactable = true;
              }, 300);
            }
          }, 1000);
        }, 500);
      }
    }
  });
}

const clickAnswer = (gridItem, set) => {
  gridItem.forEach((item, idx) => {
    item.addEventListener('click', (e) => {
      if(!interactable) return;

      if(item.classList.contains('active') || item.classList.contains('error')) return;

      if(set.has(idx)) {
        e.target.classList.add('active');
        set.delete(idx);

        if(set.size === 0) {
          interactable = false;

          setTimeout(() => {
            mainContainer.classList.add('anim-correct');
            setTimeout(levelUp, 800);
          }, 300);
        }
      } else {
        e.target.classList.add('error');
        errorClicked++;

        if(errorClicked >= 3) {
          interactable = false;
          lives--;
          updateLivesDisplay();
          mainContainer.classList.add('anim-incorrect');

          setTimeout(() => {
            if(lives > 0) {
              reLevel();
            } else {
              endGame();
            }
          }, 800);
        }
      }
    });
  });
}

const updateLivesDisplay = () => {
  livesDisplay.forEach((svg, idx) => {
    if(idx >= lives) {
      svg.style.opacity = '0.3';
    }
  });
}

const initializeLivesDisplay = () => {
  livesDisplay.forEach((svg, idx) => {
    svg.style.opacity = '1';
  });
}

const initializeLevel = () => {
  mainContainer.classList.remove('anim-correct');
  mainContainer.classList.remove('anim-incorrect');
  interactable = false;
  errorClicked = 0;
  createGrid(l);
}

const initializeGame = () => {
  l = 1;
  lives = 3;
  levelDisplay.textContent = l;
  initializeLivesDisplay();
  initializeLevel();
}

const levelUp = () => {
  l++;
  initializeLevel();
}

const reLevel = () => {
  mainContainer.classList.remove('anim-incorrect');
  initializeLevel();
}

const endGame = () => {
  endLevelDisplay.textContent = l;
  hide(gameContainer);
  show(endingContainer);
}