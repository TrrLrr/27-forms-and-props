'use strict';

import './style/main.scss';
import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';



class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subForm: '',
      numForm: '',
    };
    this.handleNumChange = this.handleNumChange.bind(this);
    this.handleSubChange = this.handleSubChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNumChange(e) {
    this.setState({
      numForm: e.target.value,
    });
  }
  
  handleSubChange(e) {
    this.setState({
      subForm: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.lastSearch(this.state.subForm, this.state.numForm);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Subreddit</label>
        <input
          type='text'
          name='subForm'
          placeholder='Search for a Subreddit'
          value={this.state.subForm}
          onChange={this.handleSubChange} />
        <label>Number of Posts</label>
        <input
          type='number'
          min='0'
          max='100'
          name='numberOfResults'
          placeholder='Posts per search'
          value={this.state.numForm}
          onChange={this.handleNumChange} />

        <button type="submit">Search</button>
      </form>
    );
  }
}

class SearchResultList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.topics ? 
          <section>
            <ul>
              {this.props.topics.data.children.map((item, i) => {
                return (
                  <li key={i}>
                    <a href={item.data.url} target="_blank">{item.data.title}</a>
                    <p>{item.data.ups} upvotes</p>
                  </li>
                );
              })}
            </ul>
          </section>
          :
          undefined
        }
        {this.props.error ?
          
          <section>
            <h2>No Subreddit found, try again :(</h2>
          </section>
          :
          undefined
        }
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: null,
      error: null,
    };
    this.updateState = this.updateState.bind(this);
    this.searchReddit = this.searchReddit.bind(this);
  }

  updateState(subSearch, postLimit) {
    this.searchReddit(subSearch, postLimit)
      .then(res => {
        this.setState({
          topics: res.body,
          error: null,
        });
      })
      .catch(err => {
        this.setState({
          topics: null,
          error: err,
        });
      });
  }

  searchReddit(subSearch, postLimit) {
    return superagent.get(`http://www.reddit.com/r/${subSearch}.json?limit=${postLimit}`);
  }

  render() {
    return (
      <section>
        <h1>Subreddit Search</h1>
        <SearchForm lastSearch={this.updateState}/>
        <SearchResultList topics={this.state.topics} error={this.state.error}/>
      </section>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
                
                