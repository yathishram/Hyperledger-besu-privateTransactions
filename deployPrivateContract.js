const fs = require("fs-extra");
const path = require("path");
const Web3 = require("web3");
const EEAClient = require("web3-eea");
//Get the ABI
const EventEmitterAbi = require("./client/src/build/TodoContract.json");
//Keys
const { orion, besu } = require("./utils/keys.js");
//Get the bytecode
const binary = fs.readFileSync(path.resolve(__dirname, "./client/src/build/TodoContract.bin"));
//Setting the web3 connection
const web3 = new EEAClient(new Web3(besu.node1.url), 2018);
//creating instance of contract
new web3.eth.Contract(EventEmitterAbi);

const addressPath = path.resolve(__dirname, "client", "src", "address");
fs.removeSync(addressPath);

//Creating a contract object to deploy
const createPrivateContract = () => {
  //Step 1: Check for the constructor if available
  const functionAbi = EventEmitterAbi.find((e) => {
    return e.type === "constructor";
  });

  //Create the transaction object
  const contractOptions = {
    data: `0x${binary}`,
    privateFrom: orion.node1.publicKey,
    privateFor: [orion.node2.publicKey],
    privateKey: besu.node1.privateKey,
  };
  return web3.eea.sendRawTransaction(contractOptions);
};

//Getting the contract address
const getPrivateContractAddress = async (transactionHash) => {
  console.log("Transaction Hash:", transactionHash);
  const transactionRecepit = await web3.priv.getTransactionReceipt(transactionHash, orion.node1.publicKey);
  console.log("Private transaction recepit", transactionRecepit);
  console.log("Private transaction Contract Address", transactionRecepit.contractAddress);
  fs.ensureDirSync(addressPath);
  fs.writeFile(path.resolve(addressPath, "address" + ".json"), JSON.stringify(transactionRecepit), (err) => {
    console.log(`Writing address logs to: ${path.resolve(addressPath, "address" + ".json")}`);
    if (err) throw err;
  });
  return transactionRecepit.contractAddress;
};

const getTodoCount = (contractAddress) => {
  const functionAbi = EventEmitterAbi.find((e) => {
    return e.name === "todoCount";
  });

  const functionCall = {
    to: contractAddress,
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
      console.log("Get Message:", web3.eth.abi.decodeParameters(functionAbi.outputs, result.output));
      return result.output;
    });
};

module.exports = async () => {
  const transactionHash = await createPrivateContract();
  getPrivateContractAddress(transactionHash).then((contractAddress) => {
    return getTodoCount(contractAddress);
  });
};

if (require.main === module) {
  module.exports();
}
