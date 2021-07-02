import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Col } from "reactstrap";
import HeartIcon from "mdi-react/HeartIcon";
import HeartEmptyIcon from "mdi-react/HeartOffIcon";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import * as moment from "moment";
import "moment/locale/fr";
import ShareCandidat from "./ShareCandidat";
import AssociateCandidat from "./AssociateCandidat";
import Alert from "../../../handler/utils/Alert";
import { SET_KEYVALUE } from "../../../handler/mutations.local";
import { GET_CANDIDAT_BY_NUM } from "../../../handler/queries";

class ProfileMain extends React.Component {
  static propTypes = {
    profile_pic_url: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    is_blocked: PropTypes.bool.isRequired,
    is_blocked_by_admin: PropTypes.bool.isRequired,
    sharedcv: PropTypes.bool.isRequired,
    sharedby: PropTypes.string,
    entreprises: PropTypes.array,
    addFavorite: PropTypes.func,
    setKeyName: PropTypes.func,
    refetch: PropTypes.func,
    num: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      modalShare: false,
      modalAssociate: false,
      loading: false,
      isFavoris:
        props.entreprises &&
          props.entreprises.filter(
            entre => entre.id.toString() === localStorage.getItem("id")
          ).length > 0
          ? props.entreprises.filter(
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
      nextProps.entreprises &&
      nextProps.entreprises.filter(
        entre => entre.id.toString() === localStorage.getItem("id")
      ).length > 0
    )
      this.setState({
        isFavoris: nextProps.entreprises.filter(
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
            id: this.props.id,
            isFavoris
          },
          refetchQueries: [
            {
              query: GET_CANDIDAT_BY_NUM,
              variables: {
                num: this.props.num
              }
            }
          ]
        })
        .then(() => {
          this.onResponse(() => {
            this.setState({ isFavoris });
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
    const {
      profile_pic_url,
      last_name,
      first_name,
      sharedcv,
      email,
      id,
      createdAt,
      is_blocked,
      is_blocked_by_admin,
      sharedby,
    } = this.props;
    const { modalShare, isFavoris, modalAssociate } = this.state;
    first_name &&
      last_name &&
      this.props
        .setKeyName({
          variables: {
            KeyValue: first_name + " " + last_name
          }
        })
        .then(() => { });
    return (
      <Col md={12} lg={12} xl={12}>
        <ShareCandidat modal={modalShare} toggle={this.toggleShare} id={id} />
        <AssociateCandidat
          modal={modalAssociate}
          toggle={this.toggleAssociate}
          id={id}
        />
        <Card>
          <CardBody
            className="profile__card"
            style={
              isFavoris
                ? {
                  border: "1px solid #295ebe"
                }
                : { border: "1px solid rgb(247, 201, 62)" }
            }>
            <div className="profile__information">
              <div className="profile__avatar">
                {profile_pic_url ? (
                  <img src={profile_pic_url} alt="avatar" />
                ) : (
                    <div className={"Candidat-letters-div"}>
                      <div className="Candidat-letters">
                        {`${`${first_name.charAt(0)}${last_name.charAt(
                          0
                        )}`}`.toUpperCase()}
                      </div>
                    </div>
                  )}
              </div>
              <div className="profile__data">
                <p className="profile__name">
                  <span style={{ textTransform: "uppercase" }}>{first_name + " " + last_name}{" "}</span>
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

                <p className="profile__contact"> {email}</p>
                <p className="profile__work">
                  Ajouté le {moment(createdAt).format("DD/MM/YYYY")}
                </p>
                {sharedcv && (
                  <p className="profile__shared2">
                    {sharedby === "Diffusés par l'équipe DL"
                      ? "Diffusé par DL"
                      : sharedby === "Partagés par les adhérents"
                        ? "Partagé par les adhérents"
                        : "Candidature spontanée"}
                  </p>
                )}
                {is_blocked && <span className="blocked" style={{ marginLeft: 0 }}>Pas à l'écoute du marché</span>}
                {is_blocked_by_admin && <span className="blocked" style={{ marginLeft: 0 }}>Suspendu par DL</span>}
              </div>
            </div>

            {(!is_blocked && !sharedcv && !is_blocked_by_admin) && (
              <p
                className="profile__shared"
                style={{ width: "90%", marginLeft: "5%", cursor: "pointer" }}
                onClick={this.toggleShare}>
                Partager
              </p>
            )}
            {(!is_blocked && !is_blocked_by_admin) && (
              <p
                className="profile__shared"
                style={{ width: "90%", marginLeft: "5%", cursor: "pointer" }}
                onClick={this.toggleAssociate}>
                Associer à une offre
              </p>)}
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
