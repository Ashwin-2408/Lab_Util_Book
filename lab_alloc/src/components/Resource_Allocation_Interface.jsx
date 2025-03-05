import NavBar from "./navbar";
import React, { useState } from "react";
import LabResourceRequest from "./resource_search";
import UserRequests from "./User_Requests";

const ResourceAllocationInterface = () => {
  return (
    <div>
      <NavBar></NavBar>
      <LabResourceRequest></LabResourceRequest>
      <UserRequests></UserRequests>
    </div>
  );
};

export default ResourceAllocationInterface;