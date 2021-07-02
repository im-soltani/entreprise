import React from "react";
import { Card, CardBody, Col, Label, Input, Row } from "reactstrap";
import AddNewCV from "./AddNewCV";
import FileDrop from "react-file-drop";
import CreateNewOffer from "./CreateNewOffer";
class CreateCandidat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      file: null
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
      file: null
    });
  }
  onFileChange = event => {
    if (event.target.files[0])
      this.setState({
        file: event.target.files[0],
        modal: true
      });
  };

  handleDrop = files => {
    this.setState({
      file: files[0],
      modal: true
    });
  };
  render() {
    const { modal, file } = this.state;
    return (
      <Col xs={12} md={12} lg={12} xl={12}>
        <Row className="create-offer">
          <Col xs={12} md={6} lg={6} xl={6}>
            <CreateNewOffer />
            <AddNewCV modal={modal} file={file} toggle={this.toggle} />
          </Col>
          <Col xs={12} md={6} lg={6} xl={6}>
            <Card>
              <FileDrop
                onDrop={this.handleDrop}
                draggingOverFrameClassName="dashed-upload"
              >
                <CardBody className="dashed-container">
                  <span className="title">PARTAGEZ VOS CV</span>
                  <span className="sub-title">glisser / déposer</span>
                  <Input
                    style={{ visibility: "hidden" }}
                    id="cv"
                    name="cv"
                    type="file"
                    accept="application/pdf"
                    onChange={this.onFileChange}
                  />
                  <Label
                    htmlFor="cv"
                    className="btn btn-warning btn-lg round medium-padding text-white upload"
                    style={{ width: 300, maxWidth: "250px" }}
                  >
                    Déposer le CV
                  </Label>
                </CardBody>
              </FileDrop>
            </Card>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default CreateCandidat;
