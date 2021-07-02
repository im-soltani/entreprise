import React from "react";
import PropTypes from "prop-types";
import LegalComponent from "./components/LegalComponent";
import { Container, Row } from "reactstrap";
import { GET_SETTINGS } from "../../handler/queries";
import GraphQLResult from "../../shared/components/GraphQLResult";
import { graphql } from "react-apollo";

class Legal extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    refetch: PropTypes.func,
    error: PropTypes.object,
    getSettings: PropTypes.object
  };

  static defaultProps = {
    loading: false,
    error: null,
    getSettings: {}
  };
  render() {
    const { loading, error, getSettings } = this.props;
    return (
      <Container className="dashboard">
        <GraphQLResult
          error={error}
          loading={loading}
          emptyResult={!loading && !getSettings}
        >
          <Row>
            <LegalComponent legal={getSettings && getSettings.legal} />
          </Row>
        </GraphQLResult>
      </Container>
    );
  }
}

export default graphql(GET_SETTINGS, {
  options: () => ({
    fetchPolicy: "cache-and-network"
  }),
  props: ({ data: { loading, error, getSettings } }) => ({
    loading,
    error,
    getSettings
  })
})(Legal);
