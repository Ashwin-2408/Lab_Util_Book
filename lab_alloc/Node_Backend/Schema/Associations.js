import Resource from "./Resource.js";
import ResourceRequest from "./ResourceRequest.js";
import Lab from "./Lab.js";

// ✅ Define relationships only after both models are loaded
Resource.hasMany(ResourceRequest, {
  foreignKey: "resource_id",
  onDelete: "CASCADE",
});
ResourceRequest.belongsTo(Resource, { foreignKey: "resource_id" });
Lab.hasMany(Resource, { foreignKey: "lab_id", as: "resources" });
Resource.belongsTo(Lab, { foreignKey: "lab_id", as: "lab" });

export default function setupAssociations() {
  console.log("✅ Associations have been set up");
}
