import BeeTile from "./BeeTile";

interface BeeTileInterface {
  details: {
    id: string;
    title: string;
    life: string;
  };
}

const BeeTileList = ({ details }: BeeTileInterface) => {
  const tileArray: string[] = [
    "queen",
    "worker",
    "worker",
    "worker",
    "worker",
    "worker",
    "drone",
    "drone",
    "drone",
    "drone",
    "drone",
    "drone",
    "drone",
    "drone",
  ];

  return (
    <ul className="inline-list">
      {tileArray.map((item, index) =>
        item === details.id ? (
          <li key={index} className={`${details.id}-bee tile-instance`}>
            <BeeTile details={details} />
          </li>
        ) : null
      )}
    </ul>
  );
};
export default BeeTileList;
