import Select from 'react-select'
import React, { useState, useEffect, JSX } from 'react';
import "../style/db_management.css"
import { basicURL } from '../App';

export default function DBManagement() {

    const [currentFile, setCurrentFile] = useState<{ label: string; value: any } | null>(null)
    const [currentFileSemester, setCurrentFileSemester] = useState<string | null>(null)
    const [currentFileExamType, setCurrentFileExamType] = useState<string | null>(null)
    const [currentFileSubject, setCurrentFileSubject] = useState<string | null>(null)
    const [currentFileVerified, setCurrentFileVerified] = useState("未驗證")
    const [fileData, setFileData] = useState<Array<any>>([])
    const [waterMarkText, setWaterMarkText] = useState("")
    const [pdfIframe, setpdfIframe] = useState<JSX.Element | null>(null)



    const [data_from_backend, setDataFromBackend] = useState({
        semester: [],
        course: [],
        exam_type: []
    });

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await getData();
            setDataFromBackend(fetchedData);
        };

        fetchData();
    }, []);


    async function getData() {
        return fetch(basicURL + 'api/filter/tags?tags=all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                console.error('Error:', res);
                return {
                    semester: [],
                    course: [],
                    exam_type: []
                };
            }
        })
            .then(data => {
                data.semester = data.semester.map((item: any) => ({ label: item, value: item }));
                data.subject = data.subject.map((item: any) => ({ label: item, value: item }));
                data.exam_type = data.exam_type.map((item: any) => ({ label: item, value: item }));
                return {
                    semester: data.semester,
                    course: data.subject,
                    exam_type: data.exam_type
                }
            })
            .catch(err => {
                console.error(err);
                return {
                    semester: [],
                    course: [],
                    exam_type: []
                };
            });

    }

    const [selectedSemester, setSelectedSemester] = useState<{ label: string, value: string }[] | null>(null)
    const [selectedCourse, setSelectedCourse] = useState<{ label: string, value: string }[] | null>(null)
    const [selectedYear, setSelectedYear] = useState<{ label: string, value: string }[] | null>(null)

    const [selectedVerify , setSelectedVerify] = useState<{ label: string, value: string }[] | null>(null)
    //0 : None , 1 : image , 2 : text
    const [waterMarkCategory, setWaterMarkCategory] = useState("不新增")

    async function getFileList(): Promise<Array<any>> {
        return await fetch(basicURL + 'api/filter/file-lists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                semester: [],
                subject: [],
                exam_type: [],
                verified: -1
            }),
            credentials: 'include'
        }).then(res => {
            if (res.status === 200) {
                return res.json()
            }
            else {
                console.error('Error:', res);
                return [];
            }
        })
            .catch(err => {
                console.error(err);
                return [];
            });
    }

    const selectStyle = {

        control: (provided: any, state: any) => ({
            ...provided,
            height: 'auto',
            boxShadow: "none",
            border: state.isFocused && "none"
        }),
        valueContainer: (provided: any, state: any) => ({
            ...provided,
            fontSize: '1.2rem'

        }),
        menu: (provided: any, state: any) => ({
            ...provided,
            border: "none",
            boxShadow: "none"
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused && "lightgray",
        })
    }
    async function setFileList_fetch() {

        async function ParseResult(result: Array<any>) {
            let data = []
            for (let i = 0; i < result.length; i++) {
                data[i] = {
                    label: result[i].semester + " " + result[i].subject + " " +
                        result[i].exam_type, value: result[i].id
                }
            }
            return data
        }
        const result = await getFileList()
        setFileData(result)
        const data = await ParseResult(result)
        return data
    }
    useEffect(() => {
        (async function () {
            const data = await setFileList_fetch();
            setFileList(data);
            setstoredFileList(data);
        }())
    },[]);

    const [FileList, setFileList] = useState<Array<{ label: string; value: any }>>([]);
    const [storedFileList , setstoredFileList] = useState<Array<{ label: string; value: any }>>([]);
    async function inspectFile(e: any) {

        async function getPdfFile(id: number) {
            return fetch(basicURL + 'api/view-file/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }).then(res => {
                if (res.status === 200) {
                    return res.blob();
                } else {
                    console.error('Error:', res.status);
                    return
                }
            })
                .catch(err => {
                    console.error(err);
                    return
                });
        }
        setCurrentFile(e)
        for (let i = 0; i < fileData.length; i++) {
            if (fileData[i].id === e.value) {
                setCurrentFileExamType(fileData[i].exam_type)
                setCurrentFileSubject(fileData[i].subject)
                setCurrentFileSemester(fileData[i].semester)
                setCurrentFileVerified(fileData[i].verified ? "已驗證" : "未驗證")
                try {
                    const pdf_file = await getPdfFile(fileData[i].id)
                    if (pdf_file instanceof Blob) {
                        const url = URL.createObjectURL(pdf_file)
                        setpdfIframe(<iframe src={url} title={fileData[i].id}></iframe>)
                    } else {
                        console.error("Failed to load PDF file.");
                    }
                    break
                } catch (err) {
                    console.error(err);
                    break
                }
            }
        }
    }

    async function sendAPI() {

        async function sendFetch() {
            if (currentFile === null) {
                return 'no file selected'
            }
            return fetch(basicURL + 'api/modify-file/modify-file-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "file_id": currentFile.value,
                    "subject": currentFileSubject, // can have it or not, string 0 < length < 100
                    "semester": currentFileSemester, // can have it or not, string 0 < length < 100
                    "exam_type": currentFileExamType, // can have it or not, string 0 < length < 100
                    "verified": (currentFileVerified === "已驗證" ? 1 : 0) // can have it or not, 0 or 1
                }),
                credentials: 'include'
            }).then(res => {
                if (res.status === 200) {
                    return res.json()
                }
                else {
                    return 'modify file failed'
                }
            })
                .catch(err => {
                    console.error(err);
                    return 'delete file failed';
                });
        }

        async function sendWaterMark() {
            if (currentFile === null) {
                return 'no file selected'
            }
            return fetch(basicURL + 'api/watermark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: (
                    waterMarkCategory === "新增文字浮水印" ?
                        JSON.stringify({
                            "file_id": currentFile.value,
                            "watermark_text": waterMarkText
                        }) :
                        JSON.stringify({
                            "file_id": currentFile.value,
                        })
                ),
                credentials: 'include'
            }).then(res => {
                if (res.status === 200) {
                    return res.json()
                }
                else {
                    return 'watermark failed'
                }
            })
                .catch(err => {
                    console.error(err);
                    return 'delete file failed';
                });
        }

        const watermarkResult = waterMarkCategory === "不新增" ? "None" : await sendWaterMark()
        const sendResult = await sendFetch()
        alert("檔案更動：" + sendResult.message + "\n浮水印更動：" + (watermarkResult))
        window.location.reload()
    }

    async function delFile() {

        async function delAPI() {
            if (currentFile === null) {
                return 'no file selected'
            }
            return await fetch(basicURL + 'api/modify-file/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "file_id": currentFile.value
                }),
                credentials: 'include'
            }).then(res => {
                if (res.status === 200) {
                    return '刪除成功'
                }
                else {
                    return '刪除失敗'
                }
            })
                .catch(err => {
                    console.error(err);
                    return 'delete file failed';
                });
        }
        const delResult = await delAPI()
        alert(delResult)
        window.location.reload()
    }

    async function searchResult() {
        //all the valid options.
        //you should return an array of objects, each object has a name.
        //all selected options contain in selectedSemester, selectedCourse, selectedYear

        const toFetchFilter = {
            semester: selectedSemester === null ? [] : selectedSemester.map(item => item.value),
            subject: selectedCourse === null ? [] : selectedCourse.map(item => item.value),
            exam_type: selectedYear === null ? [] : selectedYear.map(item => item.value),
            verified: -1
        }

        const verifiedList = {
            verifiedList: selectedVerify == null ? [] : selectedVerify.map(item => item.value)
        }

        if(verifiedList.verifiedList.includes("全部")) toFetchFilter.verified = -1
        else if(verifiedList.verifiedList.includes("已驗證") && verifiedList.verifiedList.includes("未驗證")) toFetchFilter.verified = -1
        else if(verifiedList.verifiedList.includes("已驗證")) toFetchFilter.verified = 1
        else if(verifiedList.verifiedList.includes("未驗證")) toFetchFilter.verified = 0

        return fetch(basicURL + 'api/filter/file-lists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(toFetchFilter),
            credentials: 'include'
        }).then(res => {
            if (res.status === 200) {
                return res.json()
            }
            else {
                console.error('Error:', res);
                return [];
            }
        })
            .catch(err => {
                console.error(err);
                return [];
            });
    }

    async function generateResult() {

        let result = await searchResult();
        const filterResult = result.map((item:any) => {
            return {
                value: item.id,
                label: item.semester + " " + item.subject + " " +
                item.exam_type
            }
        })
        setFileList(filterResult);
        
    }

    return (
        <div className="db-management">
            <div className='db-options-container'>
            <Select className='select-object'
                    options={data_from_backend.semester}
                    onChange={async (value) => {
                        setSelectedSemester(value as { label: string, value: string }[])
                    }}
                    value={selectedSemester}
                    placeholder="請選擇學期"
                    isMulti={true}
                    styles={selectStyle}
                />
                <Select className='select-object'
                    options={data_from_backend.course}
                    onChange={async (value) => {
                        setSelectedCourse(value as { label: string, value: string }[])
                    }}
                    value={selectedCourse}
                    placeholder="請選擇科目"
                    isMulti={true}
                    styles={selectStyle}
                />
                <Select className='select-object'
                    options={data_from_backend.exam_type}
                    onChange={async (value) => {
                        setSelectedYear(value as { label: string, value: string }[])
                    }}
                    value={selectedYear}
                    placeholder="請選擇考試種類"
                    isMulti={true}
                    styles={selectStyle}
                />
                <Select className='select-object'
                    options={[
                        { label: '全部', value: '全部' },
                        { label: '已驗證', value: '已驗證' },
                        { label: '未驗證', value: '未驗證' },
                    ]}
                    onChange={async (value) => {
                        setSelectedVerify(value as { label: string, value: string }[])
                    }}
                    value={selectedVerify}
                    placeholder="請選擇驗證狀態"
                    isMulti={true}
                    styles={selectStyle}
                />
                <button
                    style={
                        {
                            display: 'flex',
                            justifyContent: 'center',
                            width: '6rem',
                            height: '3rem',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            marginTop: '0',
                        }
                    }
                    onClick={generateResult}
                >
                    搜尋
                </button>
                <Select className='select-file'
                    options={FileList}
                    onChange={inspectFile}
                    value={currentFile}
                    placeholder="選擇檔案"
                    isMulti={false}
                    styles={selectStyle}
                />
                {
                    currentFile === null ?
                        <></> :
                        <ElementComponent id='semester'
                            label='學期'
                            defaultValue={currentFileSemester || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentFileSemester(e.target.value)}
                            button={false}
                        ></ElementComponent>
                }
                {
                    currentFile === null ?
                        <></> :
                        <ElementComponent id='subject'
                            label='科目'
                            defaultValue={currentFileSubject || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentFileSubject(e.target.value)}
                            button={false}
                        ></ElementComponent>
                }
                {
                    currentFile === null ?
                        <></> :
                        <ElementComponent id='exam-type'
                            label='考試類型'
                            defaultValue={currentFileExamType || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentFileExamType(e.target.value)}
                            button={false}
                        ></ElementComponent>
                }
                {
                    currentFile === null ?
                        <></> :
                        <ElementComponent id='verified'
                            label='驗證狀態'
                            defaultValue={currentFileVerified}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentFileVerified(currentFileVerified === "已驗證" ? "未驗證" : "已驗證")}
                            button={true}
                        ></ElementComponent>
                }
                {
                    currentFile === null ?
                        <></> :
                        <ElementComponent id='watermark-type'
                            label='增加浮水印'
                            defaultValue={waterMarkCategory}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>
                            ) => setWaterMarkCategory(waterMarkCategory === "不新增" ? (
                                "新增圖片浮水印") : (
                                waterMarkCategory === "新增圖片浮水印" ? (
                                    "新增文字浮水印"
                                ) : (
                                    "不新增"
                                )
                            )
                            )}
                            button={true}
                        ></ElementComponent>
                }
                {
                    waterMarkCategory === "新增文字浮水印" ?
                        <ElementComponent id='subject'
                            label='文字浮水印內容'
                            defaultValue={waterMarkText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaterMarkText(e.target.value)}
                            button={false}
                        ></ElementComponent> :
                        <></>
                }

                {
                    currentFile === null ?
                        <></> :
                        <button className='send' onClick={sendAPI}>送出</button>
                }
                {
                    currentFile === null ?
                        <></> :
                        <button className='delete' onClick={delFile}>刪除檔案</button>
                }
            </div>
            <div className='pdf-container'>
                {
                    pdfIframe === null ?
                        <></> : pdfIframe
                }
            </div>
        </div>
    )

}


interface ElementComponentProps {
    id: string;
    defaultValue: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    button: boolean;
}

const ElementComponent: React.FC<ElementComponentProps> = ({ id, defaultValue, onChange, label, button }) => {

    if (button) {
        return (
            <div className='element-container'>
                <div className='element-label'>{label}</div>
                <button id={id} onClick={() => onChange({ target: { value: defaultValue } } as React.ChangeEvent<HTMLInputElement>)}>{defaultValue}</button>
            </div>
        )
    }

    return (
        <div className='element-container'>
            <div className='element-label'>{label}</div>
            <input className='ele-input' type='text' id={id} value={defaultValue} onChange={onChange}></input>
        </div>
    )
}