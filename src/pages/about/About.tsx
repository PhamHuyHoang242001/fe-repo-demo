import CTO_IMG from 'assets/images/CTO_IMG.png';
const About = () => {
  return (
    <div className="flex flex-row w-full py-8 2xl:py-10">
      <div className="flex flex-col w-1/2 px-10 2xl:px-14">
        <div className="text-6xl font-medium color-primary 2xl:text-[80px] xl:text-7xl ">
          Leading the Future with Data and AI
        </div>
        <div className="text-[#212121] text-[16px] font-normal mt-6 2xl:text-xl xl:text-[18px]">
          In June 2023, VPBank established the Enterprise Data and Analytics Division (EDA) to enhance AI applications
          and boost business value. EDA combines the Business Intelligence Competency Center (BICC) with centralized
          data governance, reporting compliance, and IT data architecture units. The division aims to make VPBank a
          leading bank in data management and application, driving competitive advantage in the digital era. EDA's new
          structure includes six units: Data Platform, Data Governance, BI Reporting, Data Science (AI), Data Strategy &
          Innovation, and Ecosystem Data. Our mission is to optimize operations, develop tailored products, and
          continuously improve services through advanced data analysis and customer feedback integration. EDA is
          committed to leveraging AI and ML, supporting cloud-based data transformation, and extending its impact across
          the VPBank ecosystem.
        </div>
        <div className="text-4xl font-medium color-primary mt-12  xl:mt-20 2xl:mt-24 2xl:text-6xl xl:text-5xl">
          Johnson Poh
        </div>
        <div className="text-xl font-medium color-primary 2xl:text-3xl xl:text-2xl">
          Head of Enterprise Data and Analytics Division
        </div>
      </div>
      <div className="flex w-1/2 justify-center pt-10">
        <img src={CTO_IMG} alt="img-cto" />
      </div>
    </div>
  );
};
export default About;
