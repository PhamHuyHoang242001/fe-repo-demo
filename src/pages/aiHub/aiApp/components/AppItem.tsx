import iconOpenAiApp from 'assets/icons/icon_open_ai_app.svg';
import iconLike from 'assets/icons/icon_like.svg';
import iconLiked from 'assets/icons/icon_liked.svg';
import iconUser from 'assets/icons/icon_user.svg';
import iconBookMark from 'assets/icons/icon_bookmark.svg';
import iconBookMarkSaved from 'assets/icons/icon_bookmark_saved.svg';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { formatNumberLike } from 'utils/helpers';
interface itemProp {
  image: string;
  document_id: string;
  name: string;
  total_like: string | null;
  total_quantity_used: string | null;
  short_description: string;
  id: number;
  is_save_bookmark: boolean | null;
  is_like: boolean | null;
  handleShowMore: (id: number) => void;
  handleLike: (document_id: string, is_like: boolean | null) => void;
  handleBookMark: (document_id: string, is_save_bookmark: boolean | null) => void;
}
const AppItem = ({
  image,
  name,
  short_description,
  document_id,
  handleLike,
  id,
  total_like,
  total_quantity_used,
  handleShowMore,
  handleBookMark,
  is_like,
  is_save_bookmark,
}: itemProp) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="shadow-item-last-viewed">
      <div className="flex flex-row justify-between">
        <img src={image} alt="icon-app" className="h-[54px] w-[54px]" />
        <img
          onClick={() => {
            navigate(`/home/ai-hub/app/all-app/${document_id}`);
          }}
          src={iconOpenAiApp}
          alt="icon-open-app"
          className="h-[32px] w-[32px] cursor-pointer"
        />
      </div>
      <div className=" flex flex-row justify-between pb-3" style={{ borderBottom: '1px solid #979797' }}>
        <div className="flex flex-col w-[224px]">
          <span className="text-[20px] text-black font-bold my-4">{name}</span>
          <div className=" text-[#87888C] text-sm font-normal h-[60px] ">{short_description}</div>
        </div>
        <div className="flex items-end justify-end">
          <span
            onClick={() => {
              handleShowMore(id);
            }}
            className="text-sm text-[#1238BF] font-normal cursor-pointer"
          >
            {t('ai_app.txt_more')}
          </span>
        </div>
      </div>
      <div className="flex flex-row justify-between mt-3">
        <div className="flex flex-row gap-2 items-center">
          <img
            src={is_like ? iconLiked : iconLike}
            alt="icon-like"
            onClick={() => {
              handleLike(document_id, is_like);
            }}
            className="cursor-pointer"
          />
          <div className="text-[#6A6A6A] text-[10px] font-medium w-15 mr-3 ">
            {formatNumberLike(Number(total_like))} likes
          </div>
          <img src={iconUser} alt="icon-user" className="cursor-not-allowed" />
          <div className="text-[#6A6A6A] text-[10px] font-medium w-15">
            {formatNumberLike(Number(total_quantity_used))} used
          </div>
        </div>
        <img
          src={is_save_bookmark ? iconBookMarkSaved : iconBookMark}
          alt="icon-bookmark"
          className="cursor-pointer"
          onClick={() => {
            handleBookMark(document_id, is_save_bookmark);
          }}
        />
      </div>
    </div>
  );
};
export default AppItem;
