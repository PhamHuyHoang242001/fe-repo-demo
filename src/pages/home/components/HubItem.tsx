interface HubItemProps {
  name: string;
  icon: string;
}
const HubItem = ({ name, icon }: HubItemProps) => {
  return (
    <div className="w-[300px] h-[252px] rounded-[20px] bg-white flex flex-col justify-center items-center">
      <img src={icon} alt="icon" width={'120px'} height={'120px'} />
      <div className="color-primary text-[28px] mt-7 font-semibold">{name}</div>
    </div>
  );
};
export default HubItem;
