const Web3 = require("web3");
const EEAClient = require("web3-eea");
const ContractAbi = require("./client/build/TodoContract.json");
const ContractAddress = require("./client/address/address.json").contractAddress;
const { orion, besu } = require("./utils/keys");
console.log(ContractAddress);

const getTodoCount = (address) => {
  const web3 = new EEAClient(new Web3(besu.node1.url), 2018);
  const contract = new web3.eth.Contract(ContractAbi);

  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "todoCount";
  });

  const functionCall = {
    to: address,
    data: functionAbi.signature,
    privateFrom: orion.node1.publicKey,
    privateFor: [orion.node2.publicKey],
    privateKey: besu.node1.privateKey,
  };

  return web3.eea
    .sendRawTransaction(functionCall)
    .then((transactionHash) => {
      return web3.priv.getTransactionReceipt(transactionHash, orion.node1.publicKey);
    })
    .then((result) => {
      console.log(`Get Value:`, result.output);
      return result;
    });
};

const getTodoNum = (address) => {
  return getTodoCount(address);
};

module.exports = {
  getTodoCount,
};

if (require.main === module) {
  getTodoCount(ContractAddress)
    .then((result) => console.log(result))
    .catch(console.log);
}
