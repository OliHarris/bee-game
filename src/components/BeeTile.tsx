import tileHexagonImage from "../assets/images/icons/svg/hexagon-single.svg";

interface BeeTileInterface {
  details: {
    id: string;
    title: string;
    life: string;
  };
}

const BeeTile = ({ details }: BeeTileInterface) => {
  return (
    <>
      <img className="svg-inject" src={tileHexagonImage} alt="Hexagon single" />
      <span>{details.title} Bee</span>
      <div className="counter">
        <span>{details.life}</span>
        <span>/{details.life}</span>
      </div>
    </>
  );
};
export default BeeTile;
