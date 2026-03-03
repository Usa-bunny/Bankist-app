"use strict";

// Data
const accounts = [
  {
    owner: "Haruto Sato", // Japan
    movements: [30000, -5000, 120000, -20000, 8000, -3000],
    interestRate: 1,
    pin: 1111,
    movementsDates: [
      "2025-11-01T13:15:33.035Z",
      "2025-11-25T06:04:23.907Z",
      "2026-01-25T14:18:46.235Z",
      "2026-03-02T09:30:10.120Z",
      "2026-06-10T18:49:59.371Z",
      "2026-08-26T12:01:20.894Z",
    ],
    currency: "JPY",
    locale: "ja-JP",
  },

  {
    owner: "Budi Santoso", // Indonesia
    movements: [5000000, -750000, 1200000, -300000, 250000, -100000, 900000],
    interestRate: 0.7,
    pin: 2222,
    movementsDates: [
      "2025-09-18T21:31:17.178Z",
      "2025-12-23T07:42:02.383Z",
      "2026-01-15T18:49:59.371Z",
      "2026-02-01T10:17:24.185Z",
      "2026-03-08T14:11:59.604Z",
      "2026-05-27T17:01:17.194Z",
      "2026-07-11T23:36:17.929Z",
    ],
    currency: "IDR",
    locale: "id-ID",
  },

  {
    owner: "Michael Johnson", // USA
    movements: [5200, -300, -1200, 8500, -500],
    interestRate: 1.5,
    pin: 3333,
    movementsDates: [
      "2025-10-01T13:15:33.035Z",
      "2025-11-15T09:48:16.867Z",
      "2025-12-20T06:04:23.907Z",
      "2026-02-05T16:33:06.386Z",
      "2026-04-10T14:43:26.374Z",
    ],
    currency: "USD",
    locale: "en-US",
  },

  {
    owner: "João Silva", // Portugal
    movements: [450, -120, 3000, -450, 120, -60, 980, 150, -90],
    interestRate: 1.2,
    pin: 4444,
    movementsDates: [
      "2025-11-18T21:31:17.178Z",
      "2025-12-01T10:12:44.201Z",
      "2026-01-05T09:45:10.904Z",
      "2026-02-01T10:17:24.185Z",
      "2026-02-04T14:11:59.604Z",
      "2026-02-08T17:01:17.194Z",
      "2026-02-10T17:01:17.929Z",
      "2026-02-11T10:51:36.790Z",
      "2026-03-01T08:20:10.111Z",
    ],
    currency: "EUR",
    locale: "pt-PT",
  },

  {
    owner: "Mohammed Al-Fahad", // Saudi Arabia
    movements: [15000, -2500, 8000, -1200, -600, 4200],
    interestRate: 1.1,
    pin: 5555,
    movementsDates: [
      "2025-10-10T11:25:00.000Z",
      "2025-11-05T09:40:12.222Z",
      "2025-12-19T15:10:45.333Z",
      "2026-01-22T13:55:30.444Z",
      "2026-03-14T18:20:05.555Z",
      "2026-06-01T10:05:50.666Z",
    ],
    currency: "SAR",
    locale: "ar-SA",
  },
];

const exchangeRates = {
  USD: {
    USD: 1,
    EUR: 0.92,
    JPY: 150,
    IDR: 15500,
    SAR: 3.75,
  },

  EUR: {
    USD: 1.087,
    EUR: 1,
    JPY: 163,
    IDR: 16850,
    SAR: 4.08,
  },

  JPY: {
    USD: 0.0067,
    EUR: 0.0061,
    JPY: 1,
    IDR: 103,
    SAR: 0.025,
  },

  IDR: {
    USD: 0.0000645,
    EUR: 0.000059,
    JPY: 0.0097,
    IDR: 1,
    SAR: 0.00024,
  },

  SAR: {
    USD: 0.267,
    EUR: 0.245,
    JPY: 40,
    IDR: 4130,
    SAR: 1,
  },
};

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const body = document.querySelector("body");

const containerNav = document.querySelector(".login");
const containerform = document.querySelector(".login-form");
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

let currentAccount, timer;
let sorted = false;

function createUsername(accounts) {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
}
createUsername(accounts); //use for create new username from initial of account.owner

function updateUI(account) {
  displayMovements(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
}

function startLogOutTimer(timeInMinute) {
  function tick() {
    const minute = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const second = `${time % 60}`.padStart(2, 0);
    labelTimer.textContent = `${minute}:${second}`;
    if (time === 0) {
      clearInterval(timer);
      body.classList.add("page");
      containerApp.style.display = "none";
      containerNav.classList.add("login-page");
      containerform.classList.add("login-form-page");
      btnLogin.classList.add("login__btn-page");
      labelWelcome.textContent = "Log in to get started";
    }
    time--;
  }
  let time = Number(timeInMinute) * 60;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

function formatMovementDate(date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const DaysPassed = calcDaysPassed(new Date(), date);
  if (DaysPassed === 0) return "Today";
  if (DaysPassed === 1) return "Yesterday";
  if (DaysPassed <= 7) return `${DaysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
}

function formatCurrency(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
}

function convert(amount, from, to) {
  return amount * exchangeRates[from][to];
}

function displayMovements(account, sort = false) {
  containerMovements.innerHTML = ""; //make sure the movements container is empty
  const movementSort = sort
    ? account.movements.slice().sort((a, b) => a - b) //using .slice() for make copy data of movements
    : account.movements;

  movementSort.forEach((movement, i) => {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMovementDate(date, account.locale);
    const formattedMovement = formatCurrency(
      movement,
      account.locale,
      account.currency,
    );
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date"> ${displayDate}</div>
        <div class="movements__value">${formattedMovement}</div>
      </div> 
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html); //insert the html to the movements container
  });
}

function calcDisplayBalance(account) {
  account.balance = account.movements.reduce(
    (acc, movement) => acc + movement,
    0,
  );
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency,
  );
}

function calcDisplaySummary(account) {
  const income = account.movements
    .filter((movement) => movement > 0) //calc the deposit
    .reduce((acc, movement) => acc + movement, 0);
  labelSumIn.textContent = formatCurrency(
    income,
    account.locale,
    account.currency,
  );

  const out = account.movements
    .filter((movement) => movement < 0) //calc the withdrawal
    .reduce((acc, movement) => acc + movement, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    account.locale,
    account.currency,
  );

  const interest = account.movements
    .filter((movement) => movement > 0) //calc the deposit
    .map((deposit) => (deposit * account.interestRate) / 100) //calc the interest deposit by 1.2 interest rate
    .filter((interest) => interest >= 1) //eliminate interest lest than 1€, if the bank dont pay interest less than 1€
    .reduce((acc, interest) => acc + interest, 0); //calc sum of the interest
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency,
  );
}

btnLogin.addEventListener("click", function (e) {
  e.preventDefault(); //prevent form to submitting
  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value,
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(" ")[0]}`;
    body.classList.remove("page");
    containerApp.style.display = "grid";
    containerNav.classList.remove("login-page");
    containerform.classList.remove("login-form-page");
    btnLogin.classList.remove("login__btn-page");

    const now = new Date();
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      weekday: "long",
    };
    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options,
    ).format(now);
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginUsername.blur();
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogOutTimer(10);
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (account) => account.username === inputTransferTo.value,
  );
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(
      convert(amount, currentAccount.currency, receiverAccount.currency),
    );
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  inputTransferTo.value = inputTransferAmount.value = "";

  clearInterval(timer);
  timer = startLogOutTimer(10);
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((movement) => movement >= amount / 10)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer(10);
    }, 2000);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (account) => account.username === currentAccount.username,
    );
    accounts.splice(index, 1); //find the index and delete data array from index until index + 1
    body.classList.add("page");
    containerApp.style.display = "none";
    containerNav.classList.add("login-page");
    containerform.classList.add("login-form-page");
    btnLogin.classList.add("login__btn-page");
    labelWelcome.textContent = "Log in to get started";
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
