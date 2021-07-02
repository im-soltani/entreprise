import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody, Collapse } from "reactstrap";
import { Query } from "react-apollo";
import DownIcon from "mdi-react/ChevronDownIcon";
import RightIcon from "mdi-react/ChevronRightIcon";
import { GET_ANNOTATION } from "../../../handler/queries";
import AddAnnotationModal from "./AddAnnotationModal";
import AnnotationCard from "./AnnotationCard";
class CondidatureNotes extends React.PureComponent {
  static propTypes = {
    candidat_id: PropTypes.string.isRequired,
    entreprise: PropTypes.object.isRequired,
    getAnnotation: PropTypes.func,
  };
  static defaultProps = {
    candidat_id: "",
    entreprise: {},
  };
  state = {
    modal: false,
    collapse: false,
  };
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };
  toggleCollapse = () => {
    this.setState({ collapse: !this.state.collapse });
  };
  render() {
    const { modal, collapse } = this.state;
    const { entreprise, candidat_id } = this.props;
    return (
      <React.Fragment>
        <AddAnnotationModal
          modal={modal}
          toggleModal={this.toggle}
          candidat_id={candidat_id}
        />
        <Col md={12} lg={12} xl={12}>
          <Card>
            <CardBody
              className="profile__card--calendar"
              style={{
                boxShadow: "2px 2px 10px #e6e6e6",
                overflowY: "scroll",
                maxHeight: "30rem",
              }}>
              <Row>
                <Col
                  md={12}
                  lg={6}
                  xl={6}
                  className="Candidat-competences__row-header">
                  <div
                    style={{ cursor: "pointer", textTransform: "uppercase" }}
                    onClick={this.toggleCollapse}>
                    Annotations{" "}
                    {collapse == false ? <RightIcon /> : <DownIcon />}
                  </div>
                </Col>
                <Col md={12} lg={6} xl={6}>
                  <div
                    className="OfferItem-sticky "
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#f7c93d",
                      color: "#fff",
                    }}
                    onClick={() => this.setState({ modal: true })}>
                    Ajouter
                  </div>
                </Col>
              </Row>
              <Collapse isOpen={collapse} className="collapse__content">
                <Query
                  query={GET_ANNOTATION}
                  variables={{
                    entreprise_id: entreprise.id,
                    candidate_id: candidat_id,
                  }}
                  fetchPolicy="cache-and-network">
                  {({ data, loading, error }) => {
                    if (loading) return <div />;
                    else if (error) return <p>ERROR</p>;
                    return (
                      <React.Fragment
                        style={{ overflowY: "scroll", maxHeight: "30rem" }}>
                        {data.getAnnotation &&
                        data.getAnnotation.AnnotationResult &&
                        data.getAnnotation.totalCount > 0 ? (
                          data.getAnnotation.AnnotationResult.map(
                            (Annotation, index) => {
                              return (
                                <AnnotationCard
                                  Annotation={Annotation}
                                  key={index.toString()}
                                />
                              );
                            }
                          )
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              textAlign: "center",
                              alignSelf: "center",
                              alignItems: "center",
                            }}>
                            <span>
                              Aucune annotation trouvée .<br />
                            </span>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  }}
                </Query>
              </Collapse>
            </CardBody>
          </Card>
        </Col>
      </React.Fragment>
    );
  }
}
export default CondidatureNotes;
