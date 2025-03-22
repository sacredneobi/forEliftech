import { useQuestionDel } from "@api";
import {
  Box,
  Button,
  dispatch,
  Icon,
  Loading,
  setHashValue,
  Text,
} from "@localComponents";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";

const MyMenu = (props) => {
  return (
    <MenuItem
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
        borderRadius: 2,
        pl: 0.5,
      }}
      {...props}
    />
  );
};

const Item = (props) => {
  const { loading, icon, caption, onClick, ...other } = props;

  return (
    <MyMenu
      {...other}
      onClick={(e) => {
        if (!loading) {
          onClick?.(e);
        }
      }}
    >
      {loading ? (
        <Loading size={30} />
      ) : (
        <Box flex center sx={{ minWidth: 30, minHeight: 30 }}>
          <Icon name={icon} />
        </Box>
      )}
      <Text caption={caption} sx={loading && { color: "text.secondary" }} />
    </MyMenu>
  );
};

const Default = (props) => {
  const { id } = props;

  const [del, loading] = useQuestionDel();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button name="action" onClick={(e) => setAnchorEl(e.currentTarget)} />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          backdrop: {
            sx: { backdropFilter: "blur(4px)", backgroundColor: "#33333355" },
          },
          list: { sx: { p: 1 } },
        }}
      >
        <Item
          icon="edit"
          caption="Edit"
          onClick={() => setHashValue("addQuiz", { id })}
        />

        <Item
          icon="chart"
          caption="Show statistic"
          onClick={() => setHashValue("showChart", { id })}
        />
        <Item
          loading={loading}
          icon="delete"
          caption="Delete"
          onClick={() => del({ id }, () => dispatch("reload"))}
        />
      </Menu>
    </>
  );
};

const Sort = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClick = (by, direction) => () => {
    handleClose();
    dispatch("sort", { by, direction });
  };

  return (
    <>
      <Button name="sort" onClick={(e) => setAnchorEl(e.currentTarget)} />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          backdrop: {
            sx: { backdropFilter: "blur(4px)", backgroundColor: "#33333355" },
          },
          list: { sx: { p: 1 } },
        }}
      >
        <Text
          caption="Sort by name"
          marker
          secondary
          sx={{ textAlign: "center", mb: 1 }}
        />
        <Item
          icon="asc"
          caption="Ascending"
          onClick={onClick("name", "desc")}
        />
        <Item
          icon="desc"
          caption="Descending"
          onClick={onClick("name", "asc")}
        />
        <Text
          caption="Sort by question count"
          marker
          secondary
          sx={{ textAlign: "center", my: 1, minWidth: 200 }}
        />
        <Item
          icon="asc"
          caption="Ascending"
          onClick={onClick("questions", "desc")}
        />
        <Item
          icon="desc"
          caption="Descending"
          onClick={onClick("questions", "asc")}
        />
        <Text
          caption="Sort by question completion"
          marker
          secondary
          sx={{ textAlign: "center", my: 1, minWidth: 200 }}
        />
        <Item
          icon="asc"
          caption="Ascending"
          onClick={onClick("completions", "desc")}
        />
        <Item
          icon="desc"
          caption="Descending"
          onClick={onClick("completions", "asc")}
        />
      </Menu>
    </>
  );
};

export { Default as Menu, Sort };
