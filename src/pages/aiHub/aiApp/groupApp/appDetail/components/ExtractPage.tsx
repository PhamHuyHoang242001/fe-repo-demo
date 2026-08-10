import React, { useState, useRef, useEffect } from 'react';
import { Table, Input, Form, Button, notification, Tooltip } from 'antd';
import { Resizable } from 'react-resizable';
import ExcelJS from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import 'antd/dist/reset.css';
import 'react-resizable/css/styles.css';
import iconShape from 'assets/icons/icon_shape.svg';
import iconReset from 'assets/icons/icon_reset.svg';
import iconEdit from 'assets/icons/icon_edit.svg';
import iconHighline from 'assets/icons/icon_highline.svg';
import iconDownload from 'assets/icons/icon_download.svg';
import { twMerge } from 'tailwind-merge';
import { APP_CONFIG } from 'utils/env';
import { useTranslation } from 'react-i18next';

// Định nghĩa kiểu cho các cột
interface Column {
  title: string;
  dataIndex: string;
  width: number;
  editable?: boolean;
  sorter?: (a: any, b: any) => number;
}

interface ResizableTitleProps {
  onResize: (e: React.MouseEvent<HTMLElement>, data: { size: { width: number; height: number } }) => void;
  width: number;
}

// Định nghĩa kiểu cho EditableCell
interface EditableCellProps {
  title: string;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: any;
  record: any;
  handleSave: (row: any) => void;
}

const ResizableTitle: React.FC<ResizableTitleProps> = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={<span className="react-resizable-handle" onClick={(e) => e.stopPropagation()} />}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

interface ExtractPageProp {
  generatedData: any;
  showModal: () => void;
}
const ExtractPage = ({ generatedData, showModal }: ExtractPageProp) => {
  const { t } = useTranslation();
  const numberFormatter = new Intl.NumberFormat('de-DE');
  const [listTable, setListTable] = useState<string[]>([]);
  const [currentTable, setCurrentTable] = useState<string>('');
  const [columns, setColumns] = useState<Column[]>([]);
  const [dataSource, setDataSource] = useState<any>(null);

  useEffect(() => {
    const tablesArray = [];
    for (const table in generatedData?.tables_extracted) {
      tablesArray.push(table);
    }
    setListTable(tablesArray);
    setCurrentTable(tablesArray[0]);
    setDataSource(generatedData);
  }, [generatedData]);
  useEffect(() => {
    if (currentTable) {
      const x = generatedData?.tables_extracted[currentTable]?.column_names?.map((item: any, index: number) => ({
        title: item.title,
        dataIndex: item.title === '' ? '_emptyColumn' : item.title,
        width: index === 0 ? 200 : 150,
        editable: true,
        render: (text: any) => (index === 0 ? text : numberFormatter.format(text)),
      }));
      setColumns(x);
    }
  }, [currentTable, generatedData]);

  const [highlightMode, setHighlightMode] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState<boolean>(false);
    const inputRef = useRef<Input>(null);
    const [form] = Form.useForm();

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable && editMode) {
      childNode = editing ? (
        <Form form={form} component={false}>
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          </Form.Item>
        </Form>
      ) : (
        <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const handleSave = (row: any) => {
    const newData = [...dataSource?.tables_extracted[currentTable]?.data_rows];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];

    let isValid = true;
    const keys = Object.keys(row);
    for (let i = 1; i < keys.length - 3; i++) {
      const value = String(row[keys[i]]);
      if (!/^\d+$/.test(value)) {
        isValid = false;
        break;
      }
    }
    if (!isValid) {
      notification.error({
        message: 'Try again',
        description: 'Invalid data type!',
      });
    }
    const updatedRow = isValid ? row : { ...item };

    newData.splice(index, 1, { ...item, ...updatedRow });

    const x = JSON.parse(JSON.stringify(dataSource));
    if (x?.tables_extracted && x?.tables_extracted[currentTable]) {
      x.tables_extracted[currentTable].data_rows = newData;
      setDataSource(x);
    }
  };

  const handleResize =
    (index: number) =>
    (e: React.MouseEvent<HTMLElement>, { size }: { size: { width: number; height: number } }) => {
      const nextColumns = [...columns];
      nextColumns[index] = { ...nextColumns[index], width: size.width };
      setColumns(nextColumns);
    };

  const handleRowClick = (record: any) => {
    if (highlightMode) {
      const newData = dataSource?.tables_extracted[currentTable]?.data_rows?.map((item: any) =>
        item.key === record.key ? { ...item, row_color: item.row_color === '#ffffff' ? '#F9D57B' : '#ffffff' } : item,
      );
      const x = JSON.parse(JSON.stringify(dataSource));
      if (x?.tables_extracted && x.tables_extracted[currentTable]) {
        x.tables_extracted[currentTable].data_rows = newData;
        setDataSource(x);
      }
    }
  };

  const handleEditMode = () => {
    if (editMode) {
      setEditMode(false);
    } else {
      setEditMode(true);
    }
    setHighlightMode(false);
  };

  const handleHighlightMode = () => {
    if (highlightMode) {
      setHighlightMode(false);
    } else {
      setHighlightMode(true);
    }
    setEditMode(false);
  };

  const components = {
    header: {
      cell: ResizableTitle,
    },
    body: {
      cell: EditableCell,
    },
  };

  const columnsWithResize = columns?.map((col, index) => ({
    ...col,
    onHeaderCell: (column: Column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
    onCell: (record: any) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave: handleSave,
    }),
  }));
  const downloadExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(currentTable);

    worksheet.columns = columns?.map((col: any, index: number) => ({
      header: col.title,
      key: col.dataIndex,
      width: col.width / 10,
    }));
    worksheet.getRow(1).font = { bold: true };
    dataSource?.tables_extracted[currentTable]?.data_rows?.forEach((data: any) => {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== 'key' && key !== 'row_color'),
      );

      const row = worksheet.addRow({
        ...filteredData,
      });

      row.eachCell({ includeEmpty: true }, (cell: any, colNumber: number) => {
        if (colNumber <= columns.length) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: data?.row_color.replace('#', '') },
          };
          if (colNumber > 0 && cell.value != null) {
            const numericValue = Number(cell.value);
            if (!isNaN(numericValue)) {
              cell.value = numericValue;
            }
          }
        }
      });
    });

    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${currentTable}.xlsx`);
    });
  };

  return (
    <div className="flex flex-col ">
      <div className="flex justify-start  items-center ml-5">
        <div
          className=" bg-[#FAFAFA] h-9 w-24 flex flex-row justify-center items-center gap-[10px] rounded-lg cursor-pointer"
          style={{
            border: '3px solid #01bae2',
          }}
          onClick={showModal}
        >
          <img src={iconShape} alt="shape" width={'20px'} height={'20px'} />
          <span className="text-[16px] color-primary font-medium ">{t('ai_app.btn_new')}</span>
        </div>
      </div>
      <div className="bg-[#EFEFEF] mx-5 mb-5 mt-3">
        <div
          className="flex flex-row py-3 px-6 "
          style={{
            borderBottom: '1px solid #979797',
          }}
        >
          <div className="w-1/2 flex items-center">
            <div className="   flex flex-row text-black  justify-start">
              <div className=" h-full gradient-border-left px-3 flex flex-col justify-center ">
                <div className="text-sm font-bold">
                  {Number(
                    generatedData?.elapse_tables_detect +
                      generatedData?.elapse_tables_recog +
                      generatedData?.elapse_texts_detect +
                      generatedData?.elapse_texts_recog,
                  ).toFixed(2)}{' '}
                  s
                </div>
                <div className="text-xs font-light mt-1">{t('ai_app.txt_total_time')}</div>
              </div>
              <div className=" h-full gradient-border-left px-3 flex flex-col justify-center ">
                <div className="text-sm font-bold">
                  {generatedData?.num_pages} {t('ai_app.txt_pages')}
                </div>
                <div className="text-xs font-light mt-1">{t('ai_app.txt_number_page')}</div>
              </div>
              <div className=" h-full gradient-border-left px-3 flex flex-col justify-center">
                <div className="text-sm font-bold">
                  {listTable?.length} {t('ai_app.txt_tables')}
                </div>
                <div className="text-xs font-light mt-1">{t('ai_app.txt_number_table')}</div>
              </div>
            </div>
          </div>
          <div className=" w-1/2 flex items-center">
            <div className="flex flex-row w-full">
              {listTable?.map((nameTable: string, index: number) => (
                <div
                  key={index}
                  style={{
                    borderRight: listTable?.length - 1 > index ? '1px solid black' : 'none',
                  }}
                  onClick={() => {
                    setCurrentTable(nameTable);
                  }}
                >
                  <div
                    className={twMerge(
                      'mx-3 p-2 rounded-lg cursor-pointer hover:bg-[#CACCCF]',
                      nameTable === currentTable ? 'bg-[#D9D9D9]' : 'bg-[#EFEFEF]',
                    )}
                  >
                    {nameTable}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row px-6 mt-4 mb-7">
          <div className=" rounded-2xl  w-[38%] h-[calc(100vh-200px)] bg-white shadow-lg mr-[2%] overflow-x-auto overflow-y-auto">
            <div className="text-sm text-[#1C1C1C] font-semibold sticky top-0 bg-white z-10 h-[62px] p-4">
              {t('ai_app.txt_image')}
            </div>
            {generatedData?.tables_image[currentTable]?.map((url: string, index: number) => (
              <img
                key={index}
                src={APP_CONFIG.imageMediaUrl + url}
                alt="img detect"
                width={'100%'}
                height={'auto'}
                className="px-4"
              />
            ))}
          </div>
          <div className=" rounded-2xl  w-[60%] h-[calc(100vh-200px)] bg-white shadow-lg overflow-x-auto overflow-y-auto">
            <div className="p-4 flex flex-row justify-between sticky top-0 bg-white z-10">
              <div className="text-sm text-[#1C1C1C] font-semibold">{t('ai_app.txt_extracted_table')}</div>
              <div className="flex flex-row gap-2">
                <Tooltip
                  title="Reset"
                  placement="top"
                  overlayInnerStyle={{ backgroundColor: '#000000', color: '#ffffff' }}
                  arrow={true}
                >
                  {' '}
                  <div
                    onClick={() => {
                      setDataSource(generatedData);
                      setCurrentTable(listTable[0]);
                    }}
                    className="h-[30px] w-11 flex justify-center items-center bg-[#FAFAFA] rounded-lg cursor-pointer"
                  >
                    <img src={iconReset} alt="reset" />
                  </div>
                </Tooltip>
                <Tooltip
                  placement="top"
                  title="Edit"
                  overlayInnerStyle={{ backgroundColor: '#000000', color: '#ffffff' }}
                  arrow={true}
                >
                  <div
                    onClick={handleEditMode}
                    className={twMerge(
                      'h-[30px] w-11 flex justify-center items-center  rounded-lg cursor-pointer',
                      editMode ? 'bg-[#D9D9D9]' : 'bg-[#FAFAFA]',
                    )}
                  >
                    <img src={iconEdit} alt="edit" />
                  </div>
                </Tooltip>
                <Tooltip
                  placement="top"
                  title="Highline"
                  overlayInnerStyle={{ backgroundColor: '#000000', color: '#ffffff' }}
                  arrow={true}
                >
                  <div
                    onClick={handleHighlightMode}
                    className={twMerge(
                      'h-[30px] w-11 flex justify-center items-center  rounded-lg cursor-pointer',
                      highlightMode ? 'bg-[#D9D9D9]' : 'bg-[#FAFAFA]',
                    )}
                  >
                    <img src={iconHighline} alt="highline" />
                  </div>
                </Tooltip>
                <Tooltip
                  placement="top"
                  title="Download"
                  overlayInnerStyle={{ backgroundColor: '#000000', color: '#ffffff' }}
                  arrow={true}
                >
                  <div
                    onClick={downloadExcel}
                    className="h-[30px] w-11 flex justify-center items-center bg-[#FAFAFA] rounded-lg cursor-pointer"
                  >
                    <img src={iconDownload} alt="download" />
                  </div>
                </Tooltip>
              </div>
            </div>
            <div style={{ minWidth: `${columns?.length * 150 + 50}px`, height: '100%' }}>
              <Table
                components={components}
                borderedlistTable
                dataSource={dataSource?.tables_extracted[currentTable]?.data_rows}
                columns={columnsWithResize}
                pagination={false}
                rowClassName={(record) => (record.row_color === '#ffffff' ? 'table-row-light' : 'table-row-dark')}
                onRow={(record) => ({
                  onClick: () => handleRowClick(record),
                })}
              />
            </div>
          </div>
        </div>

        <div className="text-black text-xs font-medium py-4 px-7">Contact us: tritm13@vpbank.com.vn</div>
      </div>
    </div>
  );
};

export default ExtractPage;
