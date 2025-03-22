import { CssBaseline, theme, ThemeProvider } from "@localComponents";
import { createRoot } from "react-dom/client";
import { LoaderPage } from "./loaderPage";
import { FetchProvider, SnackbarProvider } from "./provider";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const role = [
  { name: "main", isMain: true },
  { name: "addQuiz" },
  { name: "run" },
  { name: "showChart" },
];

const root = createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <SnackbarProvider>
      <CssBaseline />
      <FetchProvider>
        <LoaderPage role={role} />
      </FetchProvider>
    </SnackbarProvider>
  </ThemeProvider>
);
