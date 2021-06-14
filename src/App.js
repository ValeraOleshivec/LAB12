import React, { Component } from "react";
import "./styles.css";
import PubRepo from "./PubRepo";
import UserRepo from "./UserRepo";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRepos: false,
      isUser: true
    };
  }
  render() {
    return (
      <div>
        <br />
        <div align="center">
          <button
            onClick={() => {
              this.setState(() => {
                return { isRepos: true, isUser: false };
              });
            }}
          >
            Публичные репозитории
          </button>
          <button
            onClick={() => {
              this.setState(() => {
                return { isRepos: false, isUser: true };
              });
            }}
          >
            Ваши репозитории
          </button>
        </div>
        {this.state.isRepos && <PubRepo />}
        {this.state.isUser && <UserRepo />}
      </div>
    );
  }
}

export default App;
