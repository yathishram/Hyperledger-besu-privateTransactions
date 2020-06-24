const { getTodoCount, addTodoTx, getTodoContent, toggleTodoTx } = require("./transactionMethods");
const ContractAddress = require("./client/address/address.json").contractAddress;
const { orion, besu } = require("./utils/keys");
//let resultData;

const transaction = async () => {
  await addTodoTx(
    ContractAddress,
    "Todo Content To be added 1",
    besu.node1.url,
    orion.node1.publicKey,
    [orion.node2.publicKey],
    besu.node1.privateKey
  );

  const result = await getTodoCount(
    ContractAddress,
    besu.node1.url,
    orion.node1.publicKey,
    [orion.node2.publicKey],
    besu.node1.privateKey
  );
  console.log("Total Todo Counts", result[0]);

  await toggleTodoTx(
    ContractAddress,
    8,
    besu.node1.url,
    orion.node1.publicKey,
    [orion.node2.publicKey],
    besu.node1.privateKey
  );

  await getTodoContent(
    ContractAddress,
    7,
    besu.node1.url,
    orion.node1.publicKey,
    [orion.node2.publicKey],
    besu.node1.privateKey
  );
};

transaction();
