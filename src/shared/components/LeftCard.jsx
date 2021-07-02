import React from "react";
import { Card, Button } from "reactstrap";
import PropTypes from "prop-types";

class LeftCard extends React.Component {
  static propTypes = {
    handleChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      button: 0
    };
  }

  onClick = button => {
    this.setState({ button });
    this.props.handleChange(button === 1 ? true : false);
  };
  render() {
    const { button } = this.state;
    return (
      <Card body outline color="secondary" >
        <Button
          onClick={() => this.onClick(2)}
          className={
            button === 2 ? "Email-card__button_active" : "Email-card__button"
          }>
          Actions sur les offres
          <span className="MyCV-chevron">
            <i className="fa fa-chevron-right" />
          </span>
        </Button>
        <Button
          onClick={() => this.onClick(1)}
          className={
            button === 1 ? "Email-card__button_active" : "Email-card__button"
          }
          style={{ marginBottom: 5 }}>
          Modèles de message
          <span className="MyCV-chevron">
            <i className="fa fa-chevron-right" />
          </span>
        </Button>
      </Card>
    );
  }
}

export default LeftCard;
