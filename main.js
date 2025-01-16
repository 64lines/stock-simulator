/**
  Stock Simulator 
*/

let money = 1000;
let invested = 0;
let userStocks = [];
let stocks = [];

const getRandomArbitrary = (min, max) => Math.ceil(Math.random() * (max - min) + min);

function formatStocks(stocks) {
  if (!stocks.length) {
    return "No stocks available.";
  }
  return stocks.map(stock => 
    `- ${stock.code}: ${stock.value}${stock.price ? ", price: " + stock.price : ""}`)
      .join("\n");
}

function showStockInfo(money, invested, userStocks, stocks) {
  const stockInfo = "Money: " + money + "\n"
    + "Invested: " + invested+ "\n\n"
    + "Owned stocks: \n" + formatStocks(userStocks) + "\n\n"
    + "Stocks: \n" + formatStocks(stocks); 

  document.querySelector("#user-info").innerHTML = stockInfo;
}

function runStockMarket() {
  let nextSeconds = 0;
  let animationId;
  const increaseVariation = 30;

  function step() {
    const seconds = new Date().getSeconds();

    if (seconds !== nextSeconds) {
      nextSeconds = seconds;

      for (let i = 0; i < stocks.length; i++) {
        const selectedStock = stocks[i];
        const increase = getRandomArbitrary(-increaseVariation, increaseVariation);
        const selectedUserStock = userStocks
          .find(userStock => userStock.code === selectedStock.code);

        if (selectedUserStock) {
          selectedUserStock.value += increase;
        }

        invested = money + userStocks.reduce((acc, current) => acc + current.value, 0);
        stocks[i].value += increase;
        showStockInfo(money, invested, userStocks, stocks);
      }
    }
    animationId = window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);
}

function generateStocks(stocks) {
  const alphabeth = 'abcdefghijklmnopqrstuvwxyz';

  const stockNumber = 20;
  for (let i = 0; i < stockNumber; i++) {
    const code = Array.from({ length: 4 }).map(_ => {
      return alphabeth[getRandomArbitrary(0, alphabeth.length - 1)]
    }).join("");
    stocks.push({ code: code.toUpperCase(), value: getRandomArbitrary(25, 100) })
  }
}

function addEvents() {
  // Buy stocks
  document.querySelector("#buy-stock-button").addEventListener("click", () => {
    const stockCode = document.querySelector("#stock-code").value;
    const stock = stocks.find(stock => stock.code === stockCode);
    const existingStockCodes = userStocks.map(st => st.code);

    if (!existingStockCodes.includes(stock.code)) {
      money -= stock.value;
      userStocks.push({
        ...stock,
        price: stock.value
      });
    }
    showStockInfo(money, invested, userStocks, stocks);
  });

  // Sell stocks
  document.querySelector("#sell-stock-button").addEventListener("click", () => {
    const stockCode = document.querySelector("#stock-code").value;
    const stock = stocks.find(stock => stock.code === stockCode);
    money += stock.value;
    userStocks = userStocks.filter(stockUser => stockUser.code !== stock.code);
    showStockInfo(money, invested, userStocks, stocks);
  });
}

function main() {
  generateStocks(stocks);
  showStockInfo(money, invested, userStocks, stocks);
  addEvents();
  runStockMarket(userStocks, stocks);
}

main();
