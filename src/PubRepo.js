import { Query } from "react-apollo";
import gql from "graphql-tag";
import React, { Component } from "react";
import RepoPage from "./RepoPage";

export default class PubRepo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDefault: true,
      isSearch: false,
      searchText: "*",
      cursor: "$afterCursor",
      queryValue: "Search($afterCursor: String)",
      page: "after: ",
      owner: "",
      name: "",
      isPage: false
    };
  }
  searchButton() {
    this.setState(() => {
      return {
        isDefault: false,
        isSearch: true,
        searchText: document.getElementById("searchInput").value
      };
    });
  }
  nextPage(cursor) {
    let temp = cursor.toString();
    this.setState(() => {
      return {
        cursor: '"' + temp + '"',
        queryValue: "Search",
        page: "after: "
      };
    });
  }
  prevPage(cursor) {
    let temp = cursor.toString();
    this.setState(() => {
      return {
        cursor: '"' + temp + '"',
        queryValue: "Search",
        page: "before: "
      };
    });
  }
  toRepo(owner, name) {
    this.setState(() => {
      return {
        owner: owner,
        name: name,
        isPage: true
      };
    });
  }

  render() {
    const DEFAULT_QUERY = gql`
    query ${this.state.queryValue}{
      search(query: "is:public", type: REPOSITORY, ${
        this.state.page + this.state.cursor
      }, first: 10) {
    repositoryCount
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ... on Repository {
        id
        name
        owner {
          login
          avatarUrl(size: 10)
          url
        }
      }
    }
  }
}
  `;
    let queryText = this.state.searchText;
    const SEARCH_QUERY = gql`
    query ${this.state.queryValue}{
      search(query: "${queryText}", type: REPOSITORY, ${
      this.state.page + this.state.cursor
    }, first: 10) {
      repositoryCount
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
        ... on Repository {
        id
        name
        owner {
          login
          avatarUrl(size: 10)
          url
        }
      }
    }
  }
}
  `;
    return (
      <Query query={this.state.isDefault ? DEFAULT_QUERY : SEARCH_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <p align="center">Loading...</p>;
          if (error) return <p align="center">Error! {error.message}</p>;
          const prs = data.search;
          if (!this.state.isPage) {
            return (
              <div align="center">
                <br />
                <button onClick={() => this.searchButton()}>Поиск</button>
                <input id="searchInput" />
                <ul>
                  По данному запросу: {data.search.repositoryCount} результатов
                  {prs.nodes.map((data, key) => {
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
                        </a>{" "}
                        from {data.owner.login}
                        <img align="right" src={data.owner.avatarUrl} alt="" />
                      </li>
                    );
                  })}
                </ul>
                {prs.pageInfo.hasPreviousPage && (
                  <button
                    onClick={() => this.prevPage(prs.pageInfo.startCursor)}
                  >
                    Предыдущая
                  </button>
                )}
                <button onClick={() => this.nextPage(prs.pageInfo.endCursor)}>
                  Следущая
                </button>
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
