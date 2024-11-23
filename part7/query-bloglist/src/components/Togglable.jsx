/**
 * Taken with permission from:
 * https://github.com/fullstack-hy2020/part2-notes-frontend/blob/part5-4/src/components/Togglable.jsx
 */

import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { Box, Button } from "@mui/material";

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <div style={hideWhenVisible}>
        <Button variant="contained" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button variant="contained" sx={{ mt: 1 }} onClick={toggleVisibility}>
          cancel
        </Button>
      </div>
    </Box>
  );
});

Togglable.displayName = "Togglable";

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
