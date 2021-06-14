import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

export default class RepoPage extends Component {
  render() {
    console.log(this.props);
    const QUERY = gql`
      query {
        repository(name: "${this.props.name}", owner: "${this.props.owner}") {
          createdAt
          updatedAt
          issues {
            totalCount
          }
          languages(first: 10) {
            totalCount
            edges {
              size
              node {
                color
                name
              }
            }
          }
          forkCount
        }
      }
    `;
    return (
      <div>
        <Query query={QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <p align="center">Loading...</p>;
            if (error) return <p align="center">Error! {error.message}</p>;
            return (
              <div align="center">
                <br />
                <div>Создан: {data.repository.createdAt}</div>
                <div>Изменён: {data.repository.updatedAt}</div>
                <div>Issues count: {data.repository.issues.totalCount}</div>
                <div>Количество форков: {data.repository.forkCount}</div>
                <div>
                  Используемые языки:
                  <ul>
                    {data.repository.languages.edges.map((data, key) => {
                      return (
                        <li
                          align="left"
                          key={key}
                          style={{
                            border: "1px solid black",
                            borderRadius: "5px"
                          }}
                        >
                          <div style={{ color: data.node.color }}>
                            {data.node.name}
                          </div>{" "}
                          Количество строк кода: {data.size}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}
