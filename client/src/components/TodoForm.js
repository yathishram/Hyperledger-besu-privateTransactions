import React, { Component } from "react";

class TodoForm extends Component {
  state = {
    desc: "",
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.createTodo(this.state.desc);
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  render() {
    return (
      <div className="section center todoForm">
        <div className="row">
          <form className="col s12" onSubmit={this.handleSubmit}>
            <div className="input-field">
              <input
                placeholder="Enter your Todo"
                id="desc"
                type="text"
                className="validate"
                onChange={this.handleChange}
              />
            </div>
            <div className="input-field">
              <button className="btn">Add</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default TodoForm;
