import { useState, useImperativeHandle, forwardRef } from "react";
import { Button } from "@mui/material";

const Togglable = forwardRef(function Togglable(props, ref) {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return { toggleVisibility };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button
          onClick={toggleVisibility}
          variant="contained"
          sx={{ marginBottom: 2 }}
        >
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          onClick={toggleVisibility}
          variant="contained"
          sx={{ marginBottom: 2 }}
        >
          cancel
        </Button>
      </div>
    </div>
  );
});

export default Togglable;
