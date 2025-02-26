import Resource from "./Resource.js";
import ResourceRequest from "./ResourceRequest.js";

// ✅ Define relationships only after both models are loaded
Resource.hasMany(ResourceRequest, { foreignKey: "resource_id", onDelete: "CASCADE" });
ResourceRequest.belongsTo(Resource, { foreignKey: "resource_id" });

export default function setupAssociations() {
  console.log("✅ Associations have been set up");
}
