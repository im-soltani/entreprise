import React from "react";
import PropTypes from "prop-types";
import { Row } from "reactstrap";
import ReactPlayer from "react-player/youtube"
import Parser from "html-react-parser";
class ProfilLetter extends React.PureComponent {
  static propTypes = {
    description: PropTypes.string,
    youtubeLink: PropTypes.string
  };

  render() {
    const { description,youtubeLink } = this.props;
    return (
      <div style={{ marginTop: "2rem" }}>
        <Row className="EntrepriseDetail-letter__row">
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {description && Parser(description)}
						<div style={{paddingTop:"5rem",marginLeft:"15%"}}>{youtubeLink && <ReactPlayer
								url={youtubeLink}
							/>}</div>
          </div>
        </Row>
      </div>
    );
  }
}

export default ProfilLetter;
