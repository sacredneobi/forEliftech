import {
  useQuestionGetById,
  useQuestionRunPost,
  useQuestionRunUpdate,
} from "@api";
import {
  Box,
  Button,
  Divider,
  getDuration,
  getNewObj,
  getPage,
  Loading,
  Text,
} from "@localComponents";
import { useEffect, useState } from "react";
import { Answers } from "./answers";
import { Item } from "./item";

const name = "run";

const Timer = (props) => {
  const { caption, oldTime, id, stop } = props;

  const [time, setTime] = useState(oldTime || 0);
  const [update] = useQuestionRunUpdate();

  useEffect(() => {
    update({ id, time }, () => {});
  }, [time, update, id]);

  useEffect(() => {
    if (!stop) {
      const t = setInterval(() => {
        setTime((p) => p + 1);
      }, 1000);

      return () => clearInterval(t);
    }
  }, [stop]);

  return (
    <Text
      caption={`Quiz ${caption}\nTime has passed: ${getDuration(time)}`}
      marker
      sx={{ whiteSpace: "pre" }}
    />
  );
};

const Default = (props) => {
  const { uriParams } = props;
  const { id } = uriParams ?? {};

  const [get, loading] = useQuestionGetById();
  const [post, loadingAnswer] = useQuestionRunPost();
  const [update, loadingUpdate] = useQuestionRunUpdate();

  const [data, setData] = useState(null);
  const [active, setActive] = useState(0);
  const [reload, setReload] = useState(false);
  const [option, setOption] = useState({});
  const [answers, setAnswers] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    get(
      { id, run: true, current: localStorage.getItem(id), reload },
      (data) => {
        if (data.runId) {
          localStorage.setItem(id, data.runId?.id);
          if (data.runId.time > 0) {
            setActive(-1);
          }
        }
        setData(data);
        setAnswers(data.runId?.options ?? null);
      }
    );
  }, [get, id, reload]);

  if (loading || !data) {
    return (
      <Box flex grow center>
        <Loading />
      </Box>
    );
  }

  if (active === -1) {
    return (
      <Box flex grow center>
        <Button
          caption="Reset"
          onClick={() => {
            localStorage.removeItem(id);
            setReload((p) => !p);
            setActive(0);
            setOption({});
            setAnswers(null);
          }}
        />
        <Button
          caption="Continue"
          onClick={() => {
            setActive(data?.activeStep);
          }}
        />
      </Box>
    );
  }

  const findQuestion = data?.questionLinks[active];
  const checkAnswer = Object.keys(option ?? {}).length === 0;

  return (
    <>
      <Divider flexItem>
        <Timer
          caption={data.caption}
          oldTime={data.runId?.time}
          id={data.runId?.id}
          stop={!findQuestion}
        />
      </Divider>
      {findQuestion ? (
        <Item item={findQuestion} setOption={setOption} option={option} />
      ) : (
        <Answers answers={answers} />
      )}
      <Divider />
      <Box flex jc="flex-end" row>
        <Button
          caption={done ? "Run again" : checkAnswer ? "Check Answer" : "Next"}
          disabled={loadingAnswer || loadingUpdate}
          onClick={() => {
            if (done) {
              localStorage.removeItem(id);
              setAnswers(null);
              setActive(0);
              setDone(false);
              setReload((p) => !p);
              return;
            }

            if (!checkAnswer) {
              update({ option, id: data.runId?.id }, () => {
                setAnswers((p) => {
                  p ??= [];
                  p.push(getNewObj(option));
                  return [...p];
                });
                setOption({});
                setActive((p) => {
                  if (p + 1 <= data?.questionLinks?.length) {
                    return p + 1;
                  }
                  return 0;
                });
              });
              return;
            }

            update({ option, id: data.runId?.id }, () => {
              post({ id: data?.runId?.id, answers }, (data) => {
                setAnswers(data);
                setDone(true);
                localStorage.removeItem(id);
              });
            });
          }}
        />
      </Box>
    </>
  );
};

export default getPage(Default, name);
