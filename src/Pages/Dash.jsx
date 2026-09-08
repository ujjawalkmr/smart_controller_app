import { useState } from "react";

import DeviceList from "../Component/DeviceList";
import DeviceControl from "../Component/DeviceControl";

function Dash() {

  const [selectedDevice, setSelectedDevice] =
    useState(null);

  return (
    <div>

      <h1>Smart Home Dashboard</h1>

      <DeviceList
        onSelectDevice={setSelectedDevice}
      />

      <hr />

      <DeviceControl
        device={selectedDevice}
      />

    </div>
  );
}

export default Dash;