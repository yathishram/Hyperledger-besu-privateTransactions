const Web3 = require("web3");
const EEAClient = require("web3-eea");
const ContractAbi = require("./client/build/TodoContract.json");
const ContractAddress = require("./client/address/address.json").contractAddress;
const { orion, besu } = require("./utils/keys");
let resultData;

// const web3 = new EEAClient(new Web3(besu.node1.url), 2018);
// new web3.eth.Contract(ContractAbi);

//To get the TodoCount
const getTodoCount = async (contractAddress, url, privateFrom, privateFor, privateKey) => {
  const web3 = new EEAClient(new Web3(url), 2018);
  const Contract = new web3.eth.Contract(ContractAbi);
  const functionAbi = Contract._jsonInterface.find((e) => {
    return e.name === "todoCount";
  });

  const functionCall = {
    to: contractAddress,
    data: functionAbi.signature,
    privateFrom,
    privateFor,
    privateKey,
  };

  const transactionHash = await web3.eea.sendRawTransaction(functionCall);

  const result = await web3.priv.getTransactionReceipt(transactionHash, privateFrom);
  //console.log("Todo Count:", web3.eth.abi.decodeParameters(functionAbi.outputs, result.output));
  return web3.eth.abi.decodeParameters(functionAbi.outputs, result.output);
};

//To Add Todo function
const addTodoTx = async (contractAddress, value, url, privateFrom, privateFor, privateKey) => {
  const web3 = new EEAClient(new Web3(url), 2018);
  const Contract = new web3.eth.Contract(ContractAbi);

  const functionAbi = Contract._jsonInterface.find((e) => {
    return e.name === "addTodo";
  });
  const functionArgs = web3.eth.abi.encodeParameters(functionAbi.inputs, [value]).slice(2);

  const functionCall = {
    to: contractAddress,
    data: functionAbi.signature + functionArgs,
    privateFrom,
    privateFor,
    privateKey,
  };
  const transactionHash = await web3.eea.sendRawTransaction(functionCall);
  console.log("Transaction Hash for adding Todo", transactionHash);
  return transactionHash;
};

//To get Todo Content from mapping
const getTodoContent = async (contractAddress, value, url, privateFrom, privateFor, privateKey) => {
  const web3 = new EEAClient(new Web3(url), 2018);
  const Contract = new web3.eth.Contract(ContractAbi);

  const functionAbi = Contract._jsonInterface.find((e) => {
    return e.name === "tasks";
  });
  const functionArgs = web3.eth.abi.encodeParameters(functionAbi.inputs, [value]).slice(2);

  const functionCall = {
    to: contractAddress,
    data: functionAbi.signature + functionArgs,
    privateFrom,
    privateFor,
    privateKey,
  };

  const transactionHash = await web3.eea.sendRawTransaction(functionCall);
  console.log("Transaction Hash for todo Content", transactionHash);
  const result = await web3.priv.getTransactionReceipt(transactionHash, orion.node1.publicKey);
  console.log("Get Content:", web3.eth.abi.decodeParameters(functionAbi.outputs, result.output));
  return result.output;
};

//toggling Todo content
const toggleTodoTx = async (contractAddress, value, url, privateFrom, privateFor, privateKey) => {
  const web3 = new EEAClient(new Web3(url), 2018);
  const Contract = new web3.eth.Contract(ContractAbi);

  const functionAbi = Contract._jsonInterface.find((e) => {
    return e.name === "toggleTaskStatus";
  });
  const functionArgs = web3.eth.abi.encodeParameters(functionAbi.inputs, [value]).slice(2);

  const functionCall = {
    to: contractAddress,
    data: functionAbi.signature + functionArgs,
    privateFrom,
    privateFor,
    privateKey,
  };
  const transactionHash = await web3.eea.sendRawTransaction(functionCall);
  console.log("Transaction Hash for Toggle Todo", transactionHash);
  return transactionHash;
};

//Transaction Recepit
const getPrivateTransactionReceipt = (transactionHash) => {
  return web3.priv.getTransactionReceipt(transactionHash, orion.node1.publicKey).then((result) => {
    console.log("Transaction Hash:", transactionHash);
    console.log("Result of Add todo:", result.output);
    return result;
  });
};

// getTodoCount(
//   ContractAddress,
//   besu.node1.url,
//   orion.node1.publicKey,
//   [orion.node2.publicKey],
//   besu.node1.privateKey
// ).then((result) => console.log(result));

// addTodoTx(
//   ContractAddress,
//   "Final",
//   besu.node1.url,
//   orion.node1.publicKey,
//   [orion.node2.publicKey],
//   besu.node1.privateKey
// );

// getTodoContent(
//   ContractAddress,
//   2,
//   besu.node1.url,
//   orion.node1.publicKey,
//   [orion.node2.publicKey],
//   besu.node1.privateKey
// );

//toggleTodoTx(ContractAddress, 2, besu.node1.url, orion.node1.publicKey, [orion.node2.publicKey], besu.node1.privateKey);

//Getting the To

module.exports = {
  getTodoCount,
  addTodoTx,
  getTodoContent,
  toggleTodoTx,
};
