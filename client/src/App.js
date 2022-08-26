import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  state = {
    commits: [],
    searchData: ''
  }

  handleChange = event => {
    this.setState({ searchData: event.target.value });
  }

  getSearchedData = () => {
    if (this.state.searchData) {
      axios.post('/search', { 'message': this.state.searchData })
        .then(res => {
          this.setState({ commits: res.data })
        })
    }
  }

  removeSearch = () => {
    axios.get('/commits')
      .then(res => {
        this.setState({ commits: res.data })
      })
  }

  componentDidMount() {
    fetch('/commits')
      .then(res => res.json())
      .then(commits => this.setState({ commits }));
  }

  render() {
    return (
      <div>
        <div className="d-flex justify-content-center">
          <div>
            <input type="search" className="form-control m-2" name="searchData" onChange={this.handleChange} />
          </div>
          <button type="button" className="btn btn-light btn-sm m-2 " onClick={this.getSearchedData}>Search
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <button type="button" className="btn btn-danger btn-sm m-2" onClick={this.removeSearch}>Reset</button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Autor</th>
              <th scope="col">Message</th>
              <th scope="col">Url</th>
            </tr>
          </thead>
          <tbody>
            {this.state.commits.map(commit =>
              <tr key={commit.id}>
                <td>{commit.autor}</td>
                <td>{commit.message}</td>
                <td>
                  <a href={commit.url}>{commit.url}</a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;