import React from "react";
import { ScaleLoader } from "react-spinners";
import { Card } from "reactstrap";


const logo = `${process.env.PUBLIC_URL}/img/images/logo.png`;
const Fallback = () => (
  <div className="fallback-spinner">
    <Card className="text-center fallback-spinner-card">
    <img className="logo__img_2" src={logo} />
      <div className="p-sm-3">
        <ScaleLoader color="rgb(247, 201, 62)" size={100} width={5} />
      </div>
    </Card>
  </div>
);

export default Fallback;
