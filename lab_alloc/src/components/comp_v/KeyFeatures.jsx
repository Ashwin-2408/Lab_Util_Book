import { Beaker, PackageOpen, Bell, User } from "lucide-react";

const features = [
  {
    title: "Lab Allocation",
    description: "Manage lab bookings, scheduling, and approval processes.",
    icon: <Beaker size={28} />,
  },
  {
    title: "Resource Allocation",
    description: "Request and manage resources for your projects and classes.",
    icon: <PackageOpen size={28} />,
  },
  {
    title: "Notifications",
    description:
      "Stay updated on your booking status and resource availability.",
    icon: <Bell size={28} />,
  },
  {
    title: "User Profile",
    description: "Manage your account details and preferences.",
    icon: <User size={28} />,
  },
];

export default function KeyFeatures(props) {
  const array = ["LabAlloc", "resourceAlloc", "notification", "userProfile"];
  function handleRedirect(index) {
    props.setPageState(array[index]);
  }
  return (
    <section className="key-features">
      <h2 className="section-title">Key Features</h2>
      <p className="section-subtitle">
        Explore the main modules of our lab utilization system.
      </p>
      <div className="feature-grid">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card"
            onClick={() => handleRedirect(index)}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
            <a href="#" className="learn-more">
              Learn more →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
