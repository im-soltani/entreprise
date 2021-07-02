import React from "react";
import { Row } from "reactstrap";
import PropTypes from "prop-types";
import moment from "moment";
class AnnotationCard extends React.PureComponent {
  static propTypes = {
    Annotation: PropTypes.object.isRequired,
  };

  static defaultProps = {
    Annotation:{},
  };

  render() {
    const {Annotation}= this.props;
    const now = moment(new Date());
    const duration = moment.duration(now.diff(Annotation.createdAt));
    return (
      <div style={{padding:"1rem"}}>
        <Row style={{ fontSize: "0.9rem", fontWeight: 800 }}>
          { duration.asDays()>1 ? `le ${moment(Annotation.createdAt).format("DD/MM/YYYY")}` : Annotation.created}{", "} 
          {Annotation.user.name ? (Annotation.user.prenom +" "+ Annotation.user.name): Annotation.entreprise.name}
        </Row>
        <Row style={{textAlign:"justify",fontSize: "1rem",color:"#646777" }}>
          {Annotation.commentaire}{" "}
        </Row>
      </div>
    );
  }
}

export default AnnotationCard;
