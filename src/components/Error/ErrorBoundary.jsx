import React from "react";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showError: false
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      showError: true
    });
  }

  renderErrorInfo() {
    return (
      <div>
        <nav className="navbar navigation">
          <NavbarBrand href="/">Collab Sketch</NavbarBrand>
        </nav>
        <div className="error-content">
          <h1>Oops something went wrong!</h1>
          <h2>Try again later</h2>
        </div>
      </div>
    )
  }

  render() {
    return this.state.showError ? this.renderErrorInfo() : this.props.children;
  }

}

export default ErrorBoundary;