const dispatch = (name, data, obj = document) => {
  const event = new CustomEvent(name, {
    bubbles: true,
    detail: data,
  });
  obj.dispatchEvent(event);
};

/**
 *
 * @param {string} [name]
 * @param {function(object)} [event]
 * @param {array} [filter]
 * @param {document} [obj]
 */

const addEvent = (name, event, filter, obj = document, ...args) => {
  const localEvent = ({ detail }) => {
    if (typeof event === "function") {
      if (Array.isArray(filter)) {
        if (filter.includes(detail.name)) {
          event(detail);
        }
      } else {
        event(detail);
      }
    }
  };

  obj.addEventListener(name, localEvent, ...args);
  return () => {
    obj.removeEventListener(name, localEvent);
  };
};

export { dispatch, addEvent };
