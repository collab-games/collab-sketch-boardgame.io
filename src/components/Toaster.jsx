import React from "react";
import {Toast} from "react-bootstrap";
import './Toaster.css';

class Toaster extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: true
    }
  }

  render() {
    const { message } = this.props;
    return (
      <div className="toaster">
        <Toast onClose={() => this.setState({show: false})} show={this.state.show} delay={10000} autohide>
          <Toast.Body className="toaster-body">
              {message}
          </Toast.Body>
        </Toast>
      </div>
    );
  }
}

export default Toaster;