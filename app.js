const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let playerNameArray = [];
let rankTextArray = [];
let resultTextArray = [0, 0, 0, 0];
let boardNumber = 0;

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
    if (rankNumber === "-") {
      e.target.closest(".rank").querySelector(".rank-list").innerHTML = `
        <div class="rank-item">1</div>
        <div class="rank-item">2</div>
        <div class="rank-item">3</div>
        <div class="rank-item">4</div>`;
    }
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

function newBoard(e) {
  const typeMoney = parseInt($("#money-picker").value);
  const rankMoney = [
    0,
    2 * typeMoney,
    1 * typeMoney,
    -1 * typeMoney,
    -2 * typeMoney,
  ];
  if (checkNewBoard()) {
    if (e.target.closest("#new-board")) {
      $(".table-empty").classList.add("disabled");
      boardNumber++;
      let lengthTable = $$(".result-table tr").length;
      lengthTable++;
      rankText.forEach((rank, index) => {
        resultTextArray[index] += rankMoney[parseInt(rank.innerText)];
      });
      resultText.forEach((result, index) => {
        if (resultTextArray[index] === 0) {
          result.innerHTML = `0`;
        } else {
          result.innerHTML = `${resultTextArray[index] > 0 ? "+" : ""}${
            resultTextArray[index]
          }.000`;
        }
      });

      $(".result-table tbody").innerHTML += `
        <tr>
          <td>${boardNumber}</td>
          <td>${rankMoney[rankTextArray[0]] > 0 ? "+" : ""}${
        rankMoney[rankTextArray[0]]
      }.000</td>
          <td>${rankMoney[rankTextArray[1]] > 0 ? "+" : ""}${
        rankMoney[rankTextArray[1]]
      }.000</td>
          <td>${rankMoney[rankTextArray[2]] > 0 ? "+" : ""}${
        rankMoney[rankTextArray[2]]
      }.000</td>
          <td>${rankMoney[rankTextArray[3]] > 0 ? "+" : ""}${
        rankMoney[rankTextArray[3]]
      }.000</td>
        </tr>
      `;
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
  if (e.target.closest(".player")) {
    console.log("ok");
  }
}

document.onclick = function (e) {
  editName(e);
  playerOption(e);
  rankSelect(e);
  newBoard(e);
  showTable(e);
  toTopPage(e);
};

document.onscroll = function () {
  $(".scroll-top-btn").style.opacity = (window.scrollY - 62) / 100;
};
