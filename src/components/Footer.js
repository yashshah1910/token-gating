import * as React from "react";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Made With ♥ By "}
      <Link
        color="inherit"
        href="https://www.linkedin.com/in/yash2001/"
        target={"_blank"}
      >
        Yash Shah
      </Link>
      {""}
    </Typography>
  );
}

function Footer() {
  return (
    <>
      <React.Fragment>
        <Container
          maxWidth="md"
          component="footer"
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            mt: 8,
            py: [3, 6],
          }}
        >
          <Copyright sx={{ mt: 5 }} />
        </Container>
        {/* End footer */}
      </React.Fragment>
    </>
  );
}

export default Footer;
