import React from "react";
import { Button } from "@blueprintjs/core";
import { compose, withHandlers } from "recompose";
import { withRouter } from "react-router";

const LinkButton = ({ iconName, className, handleClick }) => (
  <Button iconName={iconName} onClick={handleClick} className={className} />
);

const enhance = compose(
  withRouter,
  withHandlers({
    handleClick: ({ to, history }) => () => history.push(to)
  })
);

export default enhance(LinkButton);
