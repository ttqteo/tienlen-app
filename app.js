const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const MONEY_STORAGE_KEY = "MONEY-ARRAY";
const config = JSON.parse(localStorage.getItem(MONEY_STORAGE_KEY)) || {};

let playerNameArray = ["Player 1", "Player 2", "Player 3", "Player 4"];
let resultTextArray = [0, 0, 0, 0];
let specialCase = -1;
let specialCasePlayer = -1;
let currIndex = -1;
let rankTextArray = [];
let boardNumber = 0;
let moneyArrayBoard = [];

const playerName = $$(".player-name");
const playerNameBtn = $$(".player-name-btn");
const tablePlayerName = $$(".table-player-name");
const rankText = $$(".rank-text");
const resultText = $$(".result-text");

// Library

function scrollToSmoothly(pos, time) {
  var currentPos = window.pageYOffset;
  var start = null;
  if (time == null) time = 500;
  (pos = +pos), (time = +time);
  window.requestAnimationFrame(function step(currentTime) {
    start = !start ? currentTime : start;
    var progress = currentTime - start;
    if (currentPos < pos) {
      window.scrollTo(0, ((pos - currentPos) * progress) / time + currentPos);
    } else {
      window.scrollTo(0, currentPos - ((currentPos - pos) * progress) / time);
    }
    if (progress < time) {
      window.requestAnimationFrame(step);
    } else {
      window.scrollTo(0, pos);
    }
  });
}

// function Initial Render

function renderInitial() {
  //Name Player
  playerName.forEach((player, index) => {
    player.innerHTML = playerNameArray[index];
    tablePlayerName[index].innerText = playerNameArray[index];
  });
  //Result Summary
  resultText.forEach((result, index) => {
    if (resultTextArray[index] === 0) {
      result.innerHTML = `0`;
    } else {
      result.innerHTML = `${resultTextArray[index] > 0 ? "+" : ""}${
        resultTextArray[index]
      }.000`;
    }
  });
  //Table Result
  if (boardNumber > 0) $(".table-empty").classList.add("disabled");
  moneyArrayBoard.forEach((money, index) => {
    let htmls = money.moneyArray
      .map((money) => {
        if (money === 0) return `<td>0</td>`;
        else return `<td>${money > 0 ? "+" : ""}${money}.000</td>`;
      })
      .join("");

    $(".result-table tbody").innerHTML += `
        <tr>
          <td>${money.boardNumber}</td>
          ${htmls}
        </tr>`;
  });
}

// function Handle

function editName(e) {
  if (e.target.closest(".edit-name")) {
    playerName.forEach((player, index) => {
      playerNameBtn[index].classList.toggle("active", true);
      player.setAttribute("contenteditable", "true");
    });
    playerName[0].focus();
  }
  if (e.target.closest(".player-name-btn")) {
    e.target.closest(".player-name-btn").classList.toggle("active", false);
    e.target
      .closest(".player")
      .querySelector(".player-name")
      .setAttribute("contenteditable", "false");
    playerName.forEach((player, index) => {
      playerNameArray[index] = player.innerText;
      tablePlayerName[index].innerText = player.innerText;
    });
    setConfig("playerNameArray", playerNameArray);
  }
}

function rankSelect(e) {
  if (e.target.closest(".rank-text")) {
    e.target
      .closest(".rank")
      .querySelector(".rank-list")
      .classList.toggle("active");
    e.target.closest(".rank").querySelector(".rank-list").innerHTML = `
        <div class="rank-item">1</div>
        <div class="rank-item">2</div>
        <div class="rank-item">3</div>
        <div class="rank-item">4</div>`;
  }
  if (e.target.closest(".rank-list")) {
    $$(".rank-text").forEach((text) => {
      text.classList.toggle("error", false);
    });
    let rankNum = e.target.closest(".rank-item").innerText;
    e.target.closest(".rank").querySelector(".rank-text").innerText = rankNum;
    e.target
      .closest(".rank")
      .querySelector(".rank-list")
      .classList.toggle("active");
    rankText.forEach((rank, index) => {
      rankTextArray[index] = rank.innerHTML;
    });
  }
}

function checkNewBoard() {
  var isPass = true;
  rankText.forEach((rank1, index1) => {
    rankText.forEach((rank2, index2) => {
      if (rank1.innerText === rank2.innerText && index1 !== index2) {
        isPass = false;
      }
    });
  });
  return isPass;
}

function renderBoardResult(moneyArray) {
  $(".table-empty").classList.add("disabled");
  boardNumber++;

  resultText.forEach((result, index) => {
    if (resultTextArray[index] === 0) {
      result.innerHTML = `0`;
    } else {
      result.innerHTML = `${resultTextArray[index] > 0 ? "+" : ""}${
        resultTextArray[index]
      }.000`;
    }
  });

  let htmls = moneyArray
    .map((money) => {
      if (money === 0) return `<td>0</td>`;
      else return `<td>${money > 0 ? "+" : ""}${money}.000</td>`;
    })
    .join("");

  $(".result-table tbody").innerHTML += `
    <tr>
      <td>${boardNumber}</td>
      ${htmls}
    </tr>`;
  $$(".player-option-box").forEach((item) => {
    item.classList.remove("active");
  });

  moneyArrayBoard.push({ boardNumber: boardNumber, moneyArray: moneyArray });

  setConfig("resultTextArray", resultTextArray);
  setConfig("moneyArrayBoard", moneyArrayBoard);
  setConfig("boardNumber", boardNumber);
  //Reset
  specialCase = 0;
  $$(".hand-input").forEach((value) => {
    value.value = "";
  });
  $(".rank-title").classList.toggle("disabled", false);
  $(".hand-title").classList.toggle("disabled", true);
  $$(".rank").forEach((rank) => rank.classList.toggle("disabled", false));
  $$(".hand").forEach((rank) => rank.classList.toggle("disabled", true));
  $$(".hand-input").forEach((input) => input.classList.toggle("error", false));
  $$(".rank-text").forEach((text) => {
    text.classList.toggle("error", false);
  });
}

function newBoard(e) {
  const typeMoney = parseInt($("#money-picker").value);
  const rankMoney = [0, 2, 1, -1, -2];
  let moneyArray = [];
  if (e.target.closest("#new-board")) {
    if ($(".rank").classList.contains("disabled")) {
      let totalType = 0;
      $$(".hand-input").forEach(
        (value) => (totalType += parseInt(value.value))
      );
      if (totalType === 0) {
        $$(".hand-input").forEach((value, index) => {
          moneyArray[index] = value.value;
        });
        renderBoardResult(moneyArray);
      } else {
        $$(".hand-input").forEach((input) =>
          input.classList.toggle("error", true)
        );
      }
    } else if (specialCase > 0) {
      if (boardNumber === 0) {
        for (let i = 0; i < 4; i++) {
          moneyArray[i] = 0;
        }
      } else {
        for (let i = 0; i < 4; i++) {
          resultTextArray[i] +=
            i === specialCasePlayer ? 9 * typeMoney : -3 * typeMoney;
          moneyArray[i] =
            i === specialCasePlayer ? 9 * typeMoney : -3 * typeMoney;
        }
      }
      renderBoardResult(moneyArray);
    } else if (checkNewBoard()) {
      rankText.forEach((rank, index) => {
        resultTextArray[index] +=
          rankMoney[parseInt(rank.innerText)] * typeMoney;
        moneyArray[index] = rankMoney[parseInt(rank.innerText)];
      });
      renderBoardResult(moneyArray);
    } else {
      $$(".rank-text").forEach((text) => {
        text.classList.toggle("error", true);
      });
    }
  }
}

function showTable(e) {
  if (e.target.closest("#show-table")) {
    scrollToSmoothly(650, 200);
  }
}

function toTopPage(e) {
  if (e.target.closest(".scroll-top-btn")) {
    scrollToSmoothly(0, 200);
  }
}

function playerOption(e) {
  let count = 0;
  $$(".player-name-btn").forEach((name) => {
    if (!name.classList.contains("active")) count++;
  });
  if (count === 4) {
    if (e.target.closest(".player-name")) {
      e.target
        .closest(".player")
        .querySelector(".player-option-list")
        .classList.toggle("active");
      e.target
        .closest(".player")
        .querySelector(".player-option-list").innerHTML = `
        <input class="player-option-item" type="button" value="Ba Mù" name="1">
        <input class="player-option-item" type="button" value="Về Lăng" name="2">
        </div>
        `;
      currIndex = parseInt(
        e.target.closest(".player").getAttribute("data-index")
      );
      $$(".player").forEach((player, index) => {
        if (index !== currIndex) player.classList.add("player--unfocus");
      });
    }
    if (e.target.closest(".player-option-list")) {
      $$(".player-option-box").forEach((box) => {
        box.classList.remove("active");
      });
      e.target
        .closest(".player")
        .querySelector(".player-option-list")
        .classList.toggle("active");
      e.target
        .closest(".player")
        .querySelector(".player-option-box")
        .classList.add("active");
      e.target
        .closest(".player")
        .querySelector(
          ".player-option-box"
        ).innerHTML = `<span>${e.target.value} <i class="fas fa-times"></i></span>`;
      specialCase = parseInt(e.target.name);
      specialCasePlayer = parseInt(
        e.target.closest(".player").getAttribute("data-index")
      );
      $$(".player").forEach((player, index) => {
        if (index !== currIndex) player.classList.remove("player--unfocus");
      });
      currIndex = -1;
    }
    if (e.target.closest(".player-option-box")) {
      e.target.closest(".player-option-box").classList.remove("active");
      specialCase = -1;
      specialCasePlayer = -1;
    }
  }
}

function swapRankHand(e) {
  if (e.target.closest(".rank-hand")) {
    $(".rank-title").classList.toggle("disabled");
    $(".hand-title").classList.toggle("disabled");
    $$(".rank").forEach((rank) => rank.classList.toggle("disabled"));
    $$(".hand").forEach((rank) => rank.classList.toggle("disabled"));
  }
}

function loadConfig() {
  playerNameArray = config.playerNameArray;
  resultTextArray = config.resultTextArray;
  moneyArrayBoard = config.moneyArrayBoard;
  boardNumber = config.boardNumber;
  if (playerNameArray === undefined)
    playerNameArray = ["Player 1", "Player 2", "Player 3", "Player 4"];
  if (boardNumber === undefined) boardNumber = 0;
  if (resultTextArray === undefined) resultTextArray = [0, 0, 0, 0];
  if (moneyArrayBoard === undefined) moneyArrayBoard = new Array();
  renderInitial();
}

function setConfig(key, value) {
  config[key] = value;
  localStorage.setItem(MONEY_STORAGE_KEY, JSON.stringify(config));
}

function tutorial(e) {
  if (e.target.closest(".tutorial-wrap")) {
    $(".tutorial-list").classList.toggle("disabled");
  }
}

document.addEventListener("click", function (e) {
  editName(e);
  swapRankHand(e);
  playerOption(e);
  rankSelect(e);
  newBoard(e);
  showTable(e);
  tutorial(e);
  toTopPage(e);
});

document.onscroll = function () {
  $(".scroll-top-btn").style.opacity = (window.scrollY - 62) / 100;
};

loadConfig();
localStorage.clear();
