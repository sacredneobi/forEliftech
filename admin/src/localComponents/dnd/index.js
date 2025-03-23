import { Divider } from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Box } from "../box";
import { Icon } from "../icon";
import { Text } from "../text";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Render = (props) => {
  const {
    innerRef,
    draggableProps,
    dragHandleProps,
    onRender,
    item,
    index,
    isLast,
  } = props;

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      style={{ ...draggableProps?.style, marginBottom: 4 }}
    >
      <Box flex row ai gap border sx={{ p: 1 }}>
        <Icon
          name="drag"
          {...dragHandleProps}
          sx={{ color: "text.secondary" }}
        />
        <Divider flexItem orientation="vertical" />
        {typeof onRender === "function" && onRender(item, index, isLast)}
        {!onRender && item.caption}
      </Box>
    </div>
  );
};

const DraggableItem = (props) => {
  const { item, index, onRender, isLast } = props;

  return (
    <Draggable draggableId={String(item.id)} index={index}>
      {(props) => (
        <Render
          {...props}
          onRender={onRender}
          item={item}
          index={index}
          isLast={isLast}
        />
      )}
    </Draggable>
  );
};

/**
 * @typedef {Object} MyProps
 * @property {array} [items]
 * @property {function} [onChange]
 * @property {boolean} [onRender]
 * @property {JSX.Element | String} [emptyCaption]
 *
 */

/**
 * @param {MyProps} props
 * @returns {JSX.Element}
 */

const Default = (props) => {
  const { onChange, items, onRender, emptyCaption } = props;

  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    onChange?.(
      reorder(items ?? [], result.source.index, result.destination.index)
    );
  };

  if (!(items?.length > 0)) {
    return (
      <Box flex center sx={{ height: 1 }}>
        {typeof emptyCaption === typeof "" ? (
          <Text caption={emptyCaption} />
        ) : (
          emptyCaption
        )}
      </Box>
    );
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items?.map?.((i, index, arr) => (
              <DraggableItem
                item={i}
                index={index}
                key={i.id}
                onRender={onRender}
                isLast={arr.length - 1 === index}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export { Default as Dnd };
