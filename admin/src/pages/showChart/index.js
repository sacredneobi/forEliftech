import { useStatsGetAll } from "@api";
import {
  Box,
  Divider,
  getDuration,
  getPage,
  Loading,
  Text,
} from "@localComponents";
import { styled } from "@mui/material";
import { LineChart, PieChart, useDrawingArea } from "@mui/x-charts";
import { useEffect, useState } from "react";

const name = "showChart";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

const Default = (props) => {
  const { uriParams } = props;
  const { id } = uriParams ?? {};

  const [get, loading] = useStatsGetAll();
  const [data, setData] = useState(null);
  const [width, setWidth] = useState(null);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    get({ id }, setData);
  }, [get, id]);

  useEffect(() => {
    if (ref) {
      setWidth(ref?.getBoundingClientRect?.()?.width - 50);
    }
  }, [ref]);

  if (loading || !data) {
    return (
      <Box flex grow center>
        <Loading />
      </Box>
    );
  }

  if (id) {
    return (
      <Box flex ai>
        {data?.data
          ?.filter?.((i) => !!i.caption)
          ?.map?.((i) => (
            <PieChart
              key={i.question}
              series={[
                {
                  data: i.variants?.map?.((i) => ({
                    value: i.count,
                    label: i.id,
                  })),
                  innerRadius: 80,
                },
              ]}
              width={400}
              height={200}
            >
              <PieCenterLabel>{i.caption}</PieCenterLabel>
            </PieChart>
          ))}
      </Box>
    );
  }

  return (
    <>
      <Divider flexItem>
        <Text caption="Quiz statics" marker />
      </Divider>
      <Box
        flex
        ai
        grow
        gap
        ref={(ref) => setRef(ref)}
        sx={{ overflow: "auto", p: 2, height: 2 }}
        className="hideScroll"
      >
        <Text caption="Average completion time" marker />
        <Text caption={getDuration(data.avg ?? 0)} />

        <Text caption="Completions per day" marker />
        <Box flex sx={{ width, minHeight: 300, overflow: "auto" }}>
          <LineChart
            width={width}
            height={300}
            series={[{ data: data?.day?.map?.((i) => i.count) }]}
            xAxis={[
              {
                scaleType: "point",
                data: data?.day?.map?.((i) => `day ${i.label}`),
              },
            ]}
          />
        </Box>
        <Text caption="Completions per week" marker />
        <Box flex sx={{ width, minHeight: 300, overflow: "auto" }}>
          <LineChart
            width={width}
            height={300}
            series={[{ data: data?.week?.map?.((i) => i.count) }]}
            xAxis={[
              {
                scaleType: "point",
                data: data?.week?.map?.((i) => `week ${i.label}`),
              },
            ]}
          />
        </Box>
        <Text caption="Completions per month" marker />
        <Box flex sx={{ width, minHeight: 300, overflow: "auto" }}>
          <LineChart
            width={width}
            height={300}
            series={[{ data: data?.month?.map?.((i) => i.count) }]}
            xAxis={[
              {
                scaleType: "point",
                data: data?.month?.map?.(
                  (i) => `${months[parseInt(i.label) - 1]}`
                ),
              },
            ]}
          />
        </Box>
      </Box>
    </>
  );
};

export default getPage(Default, name);
