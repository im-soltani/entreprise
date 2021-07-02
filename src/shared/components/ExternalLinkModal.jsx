import React, { Fragment } from "react"
import { Modal } from "reactstrap";
import PropTypes from "prop-types";

class ExternalLinkModal extends React.Component {
  static propTypes = {
    lien: PropTypes.string.isRequired,
    modal: PropTypes.bool
  };

  static defaultProps = {

  };

  constructor(props) {
    super(props);

    this.state = {
      modal: props.modal
    };
  }

  render() {
    return (
        <Fragment>
            <Modal isOpen={this.state.isOpen}>
                <iframe src={this.props.lien} />
            </Modal>
        </Fragment>
      )
  }
}

export default ExternalLinkModal;
