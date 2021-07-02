import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Button } from "reactstrap";
import PdfPreview from "../../../shared/components/PdfPreview";
import "moment/locale/fr";
import axios from "axios";

class ProfilCV extends React.PureComponent {
  static propTypes = {
    file: PropTypes.string,

    is_blocked: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired
  };

  download = () => {
    const { file } = this.props;
    axios({
      url: file,
      method: "GET",
      responseType: "blob" // important
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", this.props.name + "-cv.pdf");
      document.body.appendChild(link);
      link.click();
    });
  };

  render() {
    const { file, is_blocked } = this.props;
    return (
      <div>
        <Row className="Candidat-info__row-header">
          <Col>
            {!is_blocked && file && file.substr(file.length - 3) === "pdf" && (
              <Button onClick={this.download} className="Candidat-download">
                Télécharger le CV
              </Button>
            )}
          </Col>
        </Row>
        <Row className="Candidat-info__row">
          <Col
            xs={12}
            md={12}
            lg={12}
            xl={12}
            className="Candidat-cv__col"
            style={{ marginBottom: 30 }}
          >
            <PdfPreview file={file} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ProfilCV;
