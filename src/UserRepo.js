import { Query } from "react-apollo";
import gql from "graphql-tag";
import React, { Component } from "react";
import RepoPage from "./RepoPage";
const QUERY = gql`
  query {
    viewer {
      id
      login
      repositories(first: 10) {
        nodes {
          name
          url
          owner {
            login
          }
        }
      }
    }
  }
`;

export default class UserRepo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: "",
      name: "",
      isPage: false
    };
  }
  render() {
    return (
      <Query query={QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <p align="center">Loading...</p>;
          if (error) return <p align="center">Error! {error.message}</p>;
          const prs = data.viewer.repositories.nodes;
          if (!this.state.isPage) {
            return (
              <div align="center">
                <ul>
                  Репозитории пользователя: {data.viewer.login}
                  {prs.map((data, key) => {
                    return (
                      <li
                        align="left"
                        className="el"
                        key={key}
                        onClick={() => {
                          this.setState(() => {
                            return {
                              owner: data.owner.login,
                              name: data.name,
                              isPage: true
                            };
                          });
                        }}
                      >
                        <a align="left" className="pubEL" href="#">
                          {data.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          } else
            return (
              <div align="center">
                <br />
                <button
                  onClick={() => {
                    this.setState(() => {
                      return {
                        isPage: false
                      };
                    });
                  }}
                >
                  Назад
                </button>
                <RepoPage name={this.state.name} owner={this.state.owner} />
              </div>
            );
        }}
      </Query>
    );
  }
}
