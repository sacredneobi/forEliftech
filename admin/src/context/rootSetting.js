import { createContext, useContext, useMemo } from "react";

class RootSettingStore {
  constructor() {
    console.log("[SYSTEM]", "init root");
  }
}

const context = createContext(null);

/**
 * @returns {RootSettingStore}
 */
const useRootSetting = () => useContext(context);

const Context = (props) => {
  const contextStore = useMemo(() => new RootSettingStore(), []);

  return <context.Provider value={contextStore} {...props} />;
};

export { Context as RootSettingContext, useRootSetting };
