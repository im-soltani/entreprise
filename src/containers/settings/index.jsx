import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Container, Row, Col } from "reactstrap";
import GraphQlResult from "../../shared/components/GraphQLResult";
import ListeEmails from "./components/ListeEmails";
import LeftCard from "../../shared/components/LeftCard";
import OffersActions from "./components/OffersActions";
import { withRouter } from "react-router-dom";

class Settings extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    refetch: PropTypes.func,
    error: PropTypes.object,
    getEmails: PropTypes.array,
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object
  };

  static defaultProps = {
    loading: false,
    error: null,
    getEmails: null
  };
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      emailView: props.match.params.id === "1" ? true : false
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.state.id)
      this.setState({
        id: nextProps.match.params.id,
        emailView: nextProps.match.params.id === "1" ? true : false
      });
  }
  handleChange = value => this.setState({ emailView: value });
  render() {
    const { loading, error, getEmails } = this.props;
    const { emailView, id } = this.state;
    return (
      <Container className="dashboard">
        <GraphQlResult
          error={error}
          loading={loading}
          emptyResult={!loading && !getEmails}
        >
          <Row>
            <Col
              xs={12}
              md={12}
              lg={12}
              xl={3}
              style={{ marginBottom: "2rem" }}
            >
              <LeftCard handleChange={this.handleChange} id={id} />
            </Col>
            {emailView ? (
              <Col xs={12} md={12} lg={12} xl={9}>
                {getEmails && <ListeEmails emails={getEmails} />}
              </Col>
            ) : (
              <Col xs={12} md={12} lg={12} xl={9}>
                <OffersActions />
              </Col>
            )}
          </Row>
        </GraphQlResult>
      </Container>
    );
  }
}
const GET_EMAILS = gql`
  query getEmails {
    getEmails {
      id
      name
      template
      subject
    }
  }
`;

export default withRouter(
  graphql(GET_EMAILS, {
    options: () => ({
      fetchPolicy: "cache-and-network"
    }),
    props: ({ data: { loading, error, getEmails, refetch } }) => ({
      loading,
      error,
      getEmails,
      refetch
    })
  })(Settings)
);
