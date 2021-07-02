import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Col } from "reactstrap";
import HeartIcon from "mdi-react/HeartIcon";
import HeartEmptyIcon from "mdi-react/HeartOffIcon";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import * as moment from "moment";
import "moment/locale/fr";
import Alert from "../../../handler/utils/Alert";
import { SET_KEYVALUE } from "../../../handler/mutations.local";
import { Link } from "react-router-dom";
class ProfileMain extends React.Component {
  static propTypes = {
    candidat: PropTypes.object,
    setKeyName: PropTypes.func,
    addFavorite: PropTypes.func,
    refetch: PropTypes.func,
    createdAt: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      modalShare: false,
      modalAssociate: false,
      loading: false,
      isFavoris:
        props.candidat &&
        props.candidat.entreprises &&
        props.candidat.entreprises.filter(
          entre => entre.id.toString() === localStorage.getItem("id")
        ).length > 0
          ? props.candidat.entreprises.filter(
              entre => entre.id.toString() === localStorage.getItem("id")
            )[0].isFavoris
          : false
    };

    this.toggleShare = this.toggleShare.bind(this);
    this.toggleAssociate = this.toggleAssociate.bind(this);
  }
  toggleShare() {
    this.setState({
      modalShare: !this.state.modalShare
    });
  }

  toggleAssociate() {
    this.setState({
      modalAssociate: !this.state.modalAssociate
    });
  }

  onResponse = cb => {
    this.setState(
      {
        loading: false
      },
      () => {
        cb();
      }
    );
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.candidat &&
      nextProps.candidat.entreprises &&
      nextProps.candidat.entreprises.filter(
        entre => entre.id.toString() === localStorage.getItem("id")
      ).length > 0
    )
      this.setState({
        isFavoris: nextProps.candidat.entreprises.filter(
          entre => entre.id.toString() === localStorage.getItem("id")
        )[0].isFavoris
      });
    else this.setState({ isFavoris: false });
  }

  handleSubmit = () => {
    if (!this.state.loading) {
      const isFavoris = !this.state.isFavoris;

      this.setState({ loading: true });
      this.props
        .addFavorite({
          variables: {
            id: this.props.candidat.id,
            isFavoris
          }
        })
        .then(() => {
          this.onResponse(() => {
            this.props.refetch();
            if (isFavoris)
              Alert.success(
                "Le candidat a été ajouté à vos favoris avec succès."
              );
            else Alert.success("Le candidat a été retiré de vos favoris.");
          });
        })
        .catch(e => {
          this.onResponse(() => {
            if (e && e.graphQLErrors) console.log(e);
          });
        });
    }
  };

  render() {
    const { candidat, createdAt } = this.props;
    const { isFavoris } = this.state;
    return (
      <Col md={12} lg={12} xl={12}>
        <Card>
          <CardBody
            className="profile__card"
            style={
              isFavoris
                ? {
                    border: "1px solid #295ebe",
                    boxShadow: "2px 2px 10px #e6e6e6"
                  }
                : {
                    border: "1px solid rgb(247, 201, 62)",
                    boxShadow: "2px 2px 10px #e6e6e6"
                  }
            }>
            <div className="profile__information">
              <div className="profile__avatar">
                {candidat && candidat.profile_pic_url ? (
                  <img src={candidat.profile_pic_url} alt="avatar" />
                ) : (
                  <div className={"Candidat-letters-div"}>
                    <div className="Candidat-letters">
                      {candidat &&
                        `${`${candidat.first_name.charAt(
                          0
                        )}${candidat.last_name.charAt(0)}`}`.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
              <div className="profile__data">
                <p className="profile__name">
                  {candidat && (
                    <Link to={`/candidat/${candidat.num}`}>
                      <span style={{textTransform:"uppercase"}}>{candidat.first_name + " " + candidat.last_name}</span>
                    </Link>
                  )}
                  {candidat && candidat.profile.is_blocked && (
                    <span className="blocked">Bloqué</span>
                  )}
                  {isFavoris ? (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={this.handleSubmit}>
                      <HeartIcon
                        style={{
                          color: "#295ebe",
                          marginLeft: 10,
                          position: "absolute",
                          right: 15
                        }}
                      />
                    </span>
                  ) : (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={this.handleSubmit}>
                      <HeartEmptyIcon
                        style={{
                          color: "rgb(247, 201, 62)",
                          marginLeft: 10,
                          position: "absolute",
                          right: 15
                        }}
                      />
                    </span>
                  )}
                </p>

                <p className="profile__contact">
                  {candidat && candidat.profile && candidat.profile.email
                    ? candidat.profile.email
                    : ""}
                </p>
                <p className="profile__work">
                  Ajouté le{" "}
                  {moment(createdAt && createdAt).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

const FAVORIS_CANDIDAT_BY_ENTREPRISE = gql`
  mutation updateCandidatFavorisStatus($id: ID!, $isFavoris: Boolean!) {
    updateCandidatFavorisStatus(id: $id, isFavoris: $isFavoris) {
      first_name
      last_name
    }
  }
`;

export default compose(
  graphql(FAVORIS_CANDIDAT_BY_ENTREPRISE, {
    name: "addFavorite"
  }),
  graphql(SET_KEYVALUE, {
    name: "setKeyName"
  })
)(ProfileMain);
