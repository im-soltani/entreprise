import React from "react";
import { Card, CardBody, Button } from "reactstrap";
import { Link } from "react-router-dom";

/* import Icon from "../../../shared/components/Icon";
 */
class CreateNewOffer extends React.PureComponent {
  render() {
    return (
      <Card>
        <div className="file-drop">
          <div className="file-drop-target">
            <CardBody className="dashed-container">
              <span className="title">AJOUTEZ DES OFFRES</span>
              <span className="sub-title">créer / ajouter</span>
              <Link
                to={{
                  pathname: "/creation-une-offre",
                  state: { add: true }
                }}>
                <span style={{ height: 13, display: "block" }}></span>
                <Button
                  className="round font-size-medium mt-sm-3 "
                  style={{
                    borderRadius: 24,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    width: 300,
                    padding: "12px 25px",
                    fontSize: "14px",
                    lineHeight: "28px",
                    marginBottom: 0,
                    marginTop: "30px !important",
                    maxWidth: "250px"
                  }}
                  color="primary"
                  block>
                  Créer
                </Button>
              </Link>

              {/*  <div className="icon-container d-flex justify-content-center align-items-center">
            <Icon className="medium-photo fill-primary" name="create-offer" />
          </div> */}
            </CardBody>
          </div>
        </div>
      </Card>
    );
  }
}

export default CreateNewOffer;
