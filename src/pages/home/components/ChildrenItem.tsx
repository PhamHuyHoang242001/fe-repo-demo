import iconRight from 'assets/icons/icon_right_black.svg';
import { useNavigate } from 'react-router';

interface ChildrenItemProps {
  name: string;
  url: string;
  isShow?: boolean;
}
const ChildrenItem = ({ name, url, isShow }: ChildrenItemProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-row mt-3 h-10 px-3 py-2 rounded-lg justify-between  "
      style={{
        boxShadow: '0px 0px 1px 0px #0C1A4B3D',
        cursor: isShow ? 'pointer' : 'not-allowed',
      }}
      onClick={() => {
        if (isShow) {
          navigate(url);
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (isShow) {
            navigate(url);
          }
        }
      }}
    >
      <div className="text-[#212121] text-[16px] font-medium">{name}</div>
      <img src={iconRight} alt="icon" width={'24px'} height={'24px'} />
    </div>
  );
};
export default ChildrenItem;
