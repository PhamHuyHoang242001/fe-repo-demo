import { Input } from 'antd';
import './styles/_header.scss';
import search from 'assets/images/search.svg';
import iconRight from 'assets/icons/icon_right_gray.svg';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import HttpService from 'utils/http';
import {
  listPageDisableSearch,
  listPageDetailDisableSearch,
  listUrlName,
  listApiGetNameById,
} from '../utils/constants';
import debounce from 'lodash.debounce';

const Header = () => {
  const location = useLocation();
  const { document_id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamValue = searchParams.get('search')?.toString() || '';

  const [listUrlFullName, setListUrlFullName] = useState<Array<string>>([]);
  const navigate = useNavigate();
  const [listUrl, setListUrl] = useState<Array<string>>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isShowSearch, setIsShowSearch] = useState<boolean>(true);
  const pathName = location.pathname.split('?').filter(Boolean)[0];

  const getNameFromSlug = async (slug: string, nameApi?: string) => {
    if (nameApi) {
      const found: any = listApiGetNameById.find((item) => Object.keys(item)[0] === nameApi);
      try {
        const res = await HttpService.get(found[nameApi] + slug);
        return res?.data?.name || slug;
      } catch (err) {
        console.log(err);
        return slug;
      }
    } else {
      const found: any = listUrlName.find((item) => Object.keys(item)[0] === slug);
      return found ? found[slug] : slug;
    }
  };
  function joinWithSlash(arr: Array<string>, id: number) {
    return arr
      .slice(0, id + 1)
      .map((str) => `/${str}`)
      .join('');
  }
  const handelNavigation = (id: number) => {
    navigate(joinWithSlash(listUrl, id));
  };

  useEffect(() => {
    const pathnames = pathName.split('/').filter(Boolean);
    setListUrl(pathnames);
    setSearchValue('');
    const fetchData = async () => {
      const newListUrl = await Promise.all(
        pathnames.map((slug, index) =>
          document_id === slug ? getNameFromSlug(slug, pathnames[index - 1]) : getNameFromSlug(slug),
        ),
      );

      setListUrlFullName(newListUrl);
    };
    if (
      (pathnames[pathnames.length - 1] === document_id &&
        listPageDetailDisableSearch?.includes(pathnames[pathnames.length - 2])) ||
      listPageDisableSearch?.includes(pathnames[pathnames.length - 1])
    ) {
      setIsShowSearch(false);
    } else {
      setIsShowSearch(true);
    }

    fetchData();
  }, [pathName]);

  useEffect(() => {
    if (searchParamValue) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('search');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, []);

  const updateSearchValue = useCallback(
    debounce((event: string) => {
      const params = { search: event };
      navigate({
        pathname: window.location.pathname,
        search: createSearchParams(params).toString(),
      });
    }, 500),
    [],
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    updateSearchValue(e.target.value);
  };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     setSearchParams(createSearchParams({ search: searchValue }));
  //   }
  // };

  return (
    <>
      {location.pathname === '/home' ? (
        <header className=" flex justify-center  h-[92px] w-full pt-[38px] pb-[18px] ">
          <div className="border-search-home flex flex-row gap-2 items-center px-4">
            <img src={search} alt="search-icon" width={'24px'} height={'24px'} />
            <Input
              placeholder="Enter the keyword you are looking for..."
              className="border-none shadow-none  focus:shadow-none  "
            />
          </div>
        </header>
      ) : (
        <header className=" flex flex-row justify-between  pt-[38px] pb-[18px]  h-[92px] w-full ">
          {/* <ButtonBackPage />
           */}
          <div className="ml-32 flex items-center gap-1">
            {listUrlFullName.map((url, index) => (
              <div key={index} className="flex items-center">
                <span
                  style={{
                    color: index < listUrlFullName.length - 1 ? '#8F8F8F' : '#212121',
                    cursor: index < listUrlFullName.length - 1 && index !== 1 ? 'pointer' : 'not-allowed',
                  }}
                  className="text-[16px] font-normal"
                  onClick={() => {
                    if (index < listUrlFullName.length - 1 && index !== 1) handelNavigation(index);
                  }}
                >
                  {url}
                </span>
                {index < listUrlFullName.length - 1 && (
                  <img src={iconRight} alt="icon" width={'16px'} height={'16px'} className="ml-1 mt-1" />
                )}
              </div>
            ))}
          </div>
          {/* <div className="shadow-back ml-4 h-11 flex items-center px-2 bg-white ">
            <img src={iconBack} alt="icon_back" />
            <span className="text-[16px] text-[#1D4289] font-medium ml-2">{t('common.btn_back')}</span>
          </div> */}
          {isShowSearch && (
            <div className="border-search flex flex-row gap-2 items-center px-4">
              <img src={search} alt="search-icon" width={'24px'} height={'24px'} />
              <Input
                placeholder="Enter the keyword you are looking for..."
                className="border-none shadow-none  focus:shadow-none  "
                value={searchValue}
                onChange={handleInputChange}
                // onKeyDown={handleKeyDown}
              />
            </div>
          )}
        </header>
      )}
    </>
  );
};

export default Header;
