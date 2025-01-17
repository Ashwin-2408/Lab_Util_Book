export default function CustomSelect(props) {
  const labs = props.labs.map((lab, index) => {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    return (
      <option key={index} value={lab.lab_name}>
        {capitalize(lab.lab_name)}
      </option>
    );
  });

  return (
    <div>
      <select name="labs" className="lab-select" aria-placeholder="Lab">
        {labs}
      </select>
    </div>
  );
}
