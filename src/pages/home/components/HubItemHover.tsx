import ChildrenItem from './ChildrenItem';
interface ChildrenProps {
  name: string;
  url: string;
  isShow?: boolean;
}
interface HubItemHoverProps {
  name: string;
  icon: string;
  childrens: Array<ChildrenProps>;
}

const HubItemHover = ({ name, icon, childrens }: HubItemHoverProps) => {
  return (
    <div className="w-[300px] h-[252px] rounded-[20px] bg-white flex flex-col p-4">
      <div className="flex flex-row gap-2 items-center mb-1">
        <img src={icon} alt="icon" width={'60px'} height={'60px'} />
        <div className="color-primary text-[24px]  font-semibold my-auto">{name}</div>
      </div>
      <div>
        {childrens?.map((Children: ChildrenProps) => (
          <ChildrenItem
            key={Children.name}
            name={Children.name}
            url={Children.url}
            isShow={Children?.isShow ? true : false}
          />
        ))}
      </div>
    </div>
  );
};
export default HubItemHover;
