import fakeAwardImg from 'assets/images/fake_award_img.png';
interface AwardItemProps {
  url: string;
  topic: string;
  name: string;
  owner: string;
  bu: string;
}
const AwardItem = ({ topic, name, owner, bu, url }: AwardItemProps) => {
  return (
    <div
      className="py-6 flex flex-row gap-6 "
      style={{
        borderBottom: '1px solid #E5E7EB',
      }}
    >
      <img
        src={url || fakeAwardImg}
        alt="img"
        className="rounded-xl border border-solid border-[#E5E7EB]"
        width={'300px'}
        height={'135px'}
      />
      <div className="flex flex-col">
        <div className="text-[#6B7280] text-sm font-normal">{topic}</div>
        <div className="text-xl text-[#374151 font-medium">{name}</div>
        <div className="text-[#6B7280] text-sm font-normal mt-auto flex flex-col">
          <div>{owner}</div>
          <div>{bu}</div>
        </div>
      </div>
    </div>
  );
};
export default AwardItem;
