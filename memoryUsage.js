const numeral = require("numeral");
// npm install numeral

const memoryUsage = () => {
  setInterval(() => {
    const { rss, heapTotal } = process.memoryUsage();
    console.log(
      "rss",
      numeral(rss).format("0.0 ib"),
      "heapTotal",
      numeral(heapTotal).format("0.0 ib")
    );
  }, 10000);
};

//export the memoryUsage to the main file

module.exports = { memoryUsage };
