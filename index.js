import React, { Component } from "react";
import "./App.css";
import PropTypes from "prop-types";

// fetch options
const connection = {
  url: "https://uinames.com/api/?amount=25",
  headers: {}
};

// Stateless Component To List Out Response
const List = ({ data }) => {
  return (
    <ul>
      {Boolean(data) &&
        data.map((datum, i) => {
          return <li key={i}> {`${datum.surname} ${datum.name}`} </li>;
        })}
    </ul>
  );
};

// Renders Component Based On API Request Response
const View = ({ fetchingState, errorMessage = "", data, fetch_from_api }) => {
  switch (fetchingState) {
    case "error":
      return <p>Failed To Fetch: {errorMessage} </p>;

    case "loading":
      return <p>Fetching Requests</p>;

    case "loaded":
      return <List data={data} />;

    default:
      return <button onClick={fetch_from_api}> Click Me To Fetch</button>;
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      hasError: false,
      errorMessage: "",
      fetchingState: "not-started"
    };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, errorMessage: info });
  }

  fetch_from_api = async () => {
    const { url, headers } = connection;
    this.setState({ fetchingState: "loading" });

    try {
      let response = await fetch(url, { headers });
      const data = await response.json();

      if (!response.ok) {
        this.setState({
          fetchingState: "error",
          errorMessage: "Error from API, " + response.statusText
        });
      }

      if (Boolean(data) && Array.isArray(data)) {
        this.setState({ data, fetchingState: "loaded" });
      } else {
        this.setState({
          fetchingState: "error",
          errorMessage: "The response is not iterable i.e. Not An Array"
        });
      }
    } catch (error) {
      this.setState({
        fetchingState: "error",
        errorMessage: error.message
      });
    }
  };

  render() {
    const { hasError, errorMessage } = this.state;

    switch (hasError) {
      case true:
        return (
          <div>
            Sorry, something went wrong. <p>{errorMessage}</p>
          </div>
        );

      default:
        return (
          <div className="App">
            <h1>Test Component</h1>
            <View {...this.state} fetch_from_api={this.fetch_from_api} />
          </div>
        );
    }
  }
}

List.propTypes = {
  data: PropTypes.array.isRequired
};

View.propTypes = {
  fetchingState: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  data: PropTypes.array.isRequired,
  fetch_from_api: PropTypes.func.isRequired
};

export default App;
