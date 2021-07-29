const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let playerNameArray = ["Player 1", "Player 2", "Player 3", "Player 4"];
let rankTextArray = [];
let resultTextArray = [0, 0, 0, 0];
let boardNumber = 0;
let specialCase = 0;
let specialCasePlayer = 0;

const playerName = $$(".player-name");
const playerNameBtn = $$(".player-name-btn");
const tablePlayerName = $$(".table-player-name");
const rankText = $$(".rank-text");
const resultText = $$(".result-text");

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
  }
}

function rankSelect(e) {
  if (e.target.closest(".rank-text")) {
    let rankNumber = e.target.closest(".rank-text").innerText;
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
  specialCase = 0;
}

function newBoard(e) {
  const typeMoney = parseInt($("#money-picker").value);
  const rankMoney = [0, 2, 1, -1, -2];
  let moneyArray = [];
  if (e.target.closest("#new-board")) {
    if (specialCase > 0) {
      if (specialCase === 1 || specialCase === 2) {
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
      }
      renderBoardResult(moneyArray);
    } else if (checkNewBoard()) {
      rankText.forEach((rank, index) => {
        resultTextArray[index] +=
          rankMoney[parseInt(rank.innerText)] * typeMoney;
        moneyArray[index] = rankMoney[parseInt(rank.innerText)];
      });
      renderBoardResult(moneyArray);
    }
  }
}

function showTable(e) {
  if (e.target.closest("#show-table")) {
    window.scrollTo(0, 650);
  }
}

function toTopPage(e) {
  if (e.target.closest(".scroll-top-btn")) {
    window.scrollTo(0, 0);
  }
}

function playerOption(e) {
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
      <input class="player-option-item" type="button" value="Chặt Heo" name="3">
      <input class="player-option-item" type="button" value="Cháy" name="4">
      <div class="player-picker-list">
      </div>
      `;
  }
  if (e.target.closest(".player-option-list")) {
    e.target
      .closest(".player")
      .querySelector(".player-option-list")
      .classList.add("active");
    e.target
      .closest(".player")
      .querySelector(".player-option-box")
      .classList.add("active");
    e.target
      .closest(".player")
      .querySelector(
        ".player-option-box"
      ).innerHTML = `<span>${e.target.value}</span>`;
    specialCase = parseInt(e.target.name);
    specialCasePlayer = parseInt(
      e.target.closest(".player").getAttribute("data-index")
    );
    if (specialCase === 3 || specialCase === 4) {
      console.log("ok");
      console.log(e.target);
      e.target
        .closest(".player-option-list")
        .querySelector(".player-picker-list")
        .classList.toggle("active");

      let renderNameArray = [];
      playerNameArray.forEach((name, index) => {
        if (index !== specialCasePlayer) {
          renderNameArray.push(name);
        }
      });

      e.target
        .closest(".player-option-list")
        .querySelector(".player-picker-list").innerHTML = `
          <input class="player-picker-item" type="button" value="${renderNameArray[0]}" name="1">
          <input class="player-picker-item" type="button" value="${renderNameArray[1]}" name="2">
          <input class="player-picker-item" type="button" value="${renderNameArray[2]}" name="3">
        `;
    } else {
      e.target
        .closest(".player")
        .querySelector(".player-option-list")
        .classList.remove("active");
    }
  }
}

document.addEventListener("click", function (e) {
  editName(e);
  playerOption(e);
  rankSelect(e);
  newBoard(e);
  showTable(e);
  toTopPage(e);
});

document.onscroll = function () {
  $(".scroll-top-btn").style.opacity = (window.scrollY - 62) / 100;
};
