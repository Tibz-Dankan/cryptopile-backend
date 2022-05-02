const randomNumber = () => {
  const randomNum = Math.floor(Math.random() * 1000000);
  return randomNum;
};
module.exports = { randomNumber };
