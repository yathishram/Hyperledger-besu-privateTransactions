import React, { Component } from "react";
import ContractAbi from "./build/TodoContract.json";
import { contractAddress } from "./address/address.json";
import Web3 from "web3";
import EEAClient from "web3-eea";
import { orion, besu } from "./keys";
import { getTodoCount, addTodoTx, getTodoContent, toggleTodoTx } from "./api";
import TodoForm from "./components/TodoForm";

class App extends Component {
  state = {
    account: "",
    todoCount: 0,
    todos: [],
  };

  componentDidMount = async () => {
    const web3 = new EEAClient(new Web3(besu.node1.url), 2018);
    const todoCount = await getTodoCount(
      contractAddress,
      besu.node1.url,
      orion.node1.publicKey,
      [orion.node2.publicKey],
      besu.node1.privateKey
    );
    this.setState({ todoCount });
    console.log(this.state.todoCount[0]);
    for (let i = 1; i <= this.state.todoCount[0] * 1; i++) {
      let todos = await getTodoContent(
        contractAddress,
        i,
        besu.node1.url,
        orion.node1.publicKey,
        [orion.node2.publicKey],
        besu.node1.privateKey
      );
      this.setState({ todos: [...this.state.todos, todos] });
    }
    console.log(this.state.todos);
  };

  createTodo = async (desc) => {
    await addTodoTx(
      contractAddress,
      desc,
      besu.node1.url,
      orion.node1.publicKey,
      [orion.node2.publicKey],
      besu.node1.privateKey
    );
  };

  render() {
    console.log(contractAddress);
    return (
      <div className="App">
        <h3>Todo Testing</h3>
        <h4>Total number of todos : {this.state.todoCount[0]}</h4>

        <TodoForm createTodo={this.createTodo} />
        <ul>
          {this.state.todos.map((todo) => {
            return <li key={todo.id}>{todo.description}</li>;
          })}
        </ul>
      </div>
    );
  }
}

export default App;
