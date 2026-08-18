import { createContext, useContext, useState } from "react";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [deviceProvider, setSelectedDeviceProvider] = useState(null);

  return (
    <DeviceContext.Provider
      value={{
        deviceProvider,
        setSelectedDeviceProvider,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDeviceContext = () => {
  return useContext(DeviceContext);
};