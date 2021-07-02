import React from "react";
import PropTypes from "prop-types";
import { Document, Page } from "react-pdf";

import Icon from "./Icon";
class PdfPreview extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    file: PropTypes.any,
    fromPC: PropTypes.bool
  };
  static defaultProps = {
    className: "",
    file: null,
    fromPC: false
  };
  constructor(props) {
    super(props);
    this.state = {
      file: props.file,
      numPages: 0,
      pageNumber: 1
    };
  }
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.file !== this.props.file)
      this.setState({ file: nextProps.file });
  }

  nextPage = () => {
    const currentPageNumber = this.state.pageNumber;
    let nextPageNumber;
    if (currentPageNumber + 1 > this.state.numPages) {
      nextPageNumber = 1;
    } else {
      nextPageNumber = currentPageNumber + 1;
    }
    this.setState({
      pageNumber: nextPageNumber
    });
  };

  precPage = () => {
    const currentPageNumber = this.state.pageNumber;
    let nextPageNumber;
    if (
      currentPageNumber - 1 < 1 ||
      currentPageNumber - 1 > this.state.pageNumber
    ) {
      nextPageNumber = 1;
    } else {
      nextPageNumber = currentPageNumber - 1;
    }
    this.setState({
      pageNumber: nextPageNumber
    });
  };

  render() {
    const { file, numPages, pageNumber } = this.state;

    return (
      <div>
        {numPages > 1 && (
          <div className="pdf-center">
            <button
              title="Page précédente"
              className="MyCV-btn__middle"
              onClick={this.precPage}>
              <Icon className="pdf-center-icon" name="arr-right" />
            </button>
            <span style={{ width: 10 }}></span>
            <button
              title="Page suivante"
              className="MyCV-btn__middle"
              onClick={this.nextPage}>
              <Icon className="pdf-center-icon" name="arr-left" />
            </button>
          </div>
        )}
        <Document
          file={file}
          onLoadSuccess={this.onDocumentLoadSuccess}
          renderMode="svg"
          error={<h4>Choisir un cv pdf valide ...</h4>}
          noData={
            <div className="pfd-no">
              <img src={`${process.env.PUBLIC_URL}/img/images/error.png`} />
              <br />
              <span>Document non encore communiqué</span>
            </div>
          }
          loading={<h4>En cours de traitement ...</h4>}>
          <Page pageNumber={pageNumber} />
        </Document>
        {file ? (
          <p>
            Page n° {pageNumber} de {numPages}
          </p>
        ) : null}
      </div>
    );
  }
}

export default PdfPreview;
