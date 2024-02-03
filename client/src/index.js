import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import Quiz from "./components/Quiz";
import List from "./components/List";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "ADD",
    };
  }

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { activeTab } = this.state;

    return (
      <React.Fragment>
        <h1 className="text-center">Quiz Point List</h1>
        <div className="tab-menu text-center mb-2">
          <button
            className="mt-2 mr-3 border p-1 rounded w-24"
            onClick={() => this.handleTabChange("ADD")}
          >
            ADD
          </button>
          <button
            className="mt-2 border p-1 rounded w-24"
            onClick={() => this.handleTabChange("LIST")}
          >
            LIST
          </button>
        </div>
        {activeTab === "ADD" && <Quiz />}
        {activeTab === "LIST" && <List />}
      </React.Fragment>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
