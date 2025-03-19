import React, { useState } from "react";
import ResourceAllocation from "./Resource_allocation";
import NavBar from "./navbar";

const ResourceAllocationInterface = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <NavBar style={{ position: "relative", zIndex: 10 }} />
      <main
        style={{
          flex: 1,
          marginTop: "60px", // Add space below the NavBar
          position: "relative",
        }}
      >
        <ResourceAllocation />
      </main>
    </div>
  );
};

export default ResourceAllocationInterface;
