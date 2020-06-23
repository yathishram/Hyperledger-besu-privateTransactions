const fs = require("fs");
const path = require("path");

const Web3 = require("web3");
const EEAClient = require("web3-eea");
const EventEmitterAbi = require("./client/build/TodoContract.json");

const { orion, besu } = require("./utils/keys.js");

const binary = fs.readFileSync(path.join(__dirname, "./client/build/TodoContract.bin"));

const web3 = new EEAClient(new Web3(besu.node1.url), 2018);
// eslint-disable-next-line no-new
new web3.eth.Contract(EventEmitterAbi);

const createPrivateEmitterContract = () => {
  const functionAbi = EventEmitterAbi.find((e) => {
    return e.type === "constructor";
  });

  //const constructorArgs = web3.eth.abi.encodeParameters(functionAbi.inputs, ["Hello"]).slice(2);

  const contractOptions = {
    data: `0x${binary}`,
    privateFrom: orion.node1.publicKey,
    privateFor: [orion.node2.publicKey],
    privateKey: besu.node1.privateKey,
  };
  return web3.eea.sendRawTransaction(contractOptions);
};

const getPrivateContractAddress = (transactionHash) => {
  console.log("Transaction Hash ", transactionHash);
  return web3.priv.getTransactionReceipt(transactionHash, orion.node1.publicKey).then((privateTransactionReceipt) => {
    console.log("Private Transaction Receipt\n", privateTransactionReceipt);
    return privateTransactionReceipt.contractAddress;
  });
};

const addTodoTx = (contractAddress, value) => {
  const functionAbi = EventEmitterAbi.find((e) => {
    return e.name === "addTodo";
  });
  const functionArgs = web3.eth.abi.encodeParameters(functionAbi.inputs, [value]).slice(2);

  const functionCall = {
    to: contractAddress,
    data: functionAbi.signature + functionArgs,
    privateFrom: orion.node1.publicKey,
    privateFor: [orion.node2.publicKey],
    privateKey: besu.node1.privateKey,
  };
  return web3.eea.sendRawTransaction(functionCall);
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

const getPrivateTransactionReceipt = (transactionHash) => {
  return web3.priv.getTransactionReceipt(transactionHash, orion.node1.publicKey).then((result) => {
    console.log("Transaction Hash:", transactionHash);
    return result;
  });
};

createPrivateEmitterContract()
  .then(getPrivateContractAddress)
  .then((contractAddress) => {
    return addTodoTx(contractAddress, "Testing")
      .then((transactionHash) => {
        return getPrivateTransactionReceipt(transactionHash);
      })
      .then(() => {
        return getTodoCount(contractAddress);
      })
      .then(() => {
        return addTodoTx(contractAddress, "Testing 2");
      })
      .then((transactionHash) => {
        return getPrivateTransactionReceipt(transactionHash);
      })
      .then(() => {
        return getTodoCount(contractAddress);
      });
  })
  .catch(console.log);
