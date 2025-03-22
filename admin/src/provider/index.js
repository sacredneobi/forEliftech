import { dispatch, Grow } from "@localComponents";
import { SnackbarProvider } from "notistack";
import { Provider } from "use-http";

const FetchProvider = (props) => {
  const { ...other } = props;

  return (
    <Provider
      options={{
        cachePolicy: "no-cache",
        interceptors: {
          request: ({ options }) => {
            options.headers["x-client"] = process.env.REACT_APP_VERSION;
            options.headers["x-platform"] = sessionStorage.getItem("platform");

            return options;
          },
          response: ({ response }) => {
            dispatch("changeVersion", {
              version: response.headers.get("x-server"),
            });
            return response;
          },
        },
      }}
      {...other}
    />
  );
};

const Snackbar = (props) => {
  return (
    <SnackbarProvider
      maxSnack={4}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      hideIconVariant
      TransitionComponent={Grow}
      {...props}
    />
  );
};

export { FetchProvider, Snackbar as SnackbarProvider };
