import Select from 'react-select'
import React, { useState, useEffect } from 'react';
import "../style/db_management.css"
import { basicURL } from '../App';

export default function DBManagement(props){

    const [currentFile , setCurrentFile] = useState(null)
    const [currentFileSemester, setCurrentFileSemester] = useState(null)
    const [currentFileExamType, setCurrentFileExamType] = useState(null)
    const [currentFileSubject, setCurrentFileSubject] = useState(null)
    const [currentFileVerified, setCurrentFileVerified] = useState("未驗證")
    const [fileData , setFileData] = useState([])
    const [waterMarkText, setWaterMarkText] = useState("")
    const [pdfIframe , setpdfIframe] = useState(null)

    //0 : None , 1 : image , 2 : text
    const [waterMarkCategory , setWaterMarkCategory] = useState("不新增")

    async function getFileList(){
        return fetch(basicURL + 'api/filter/file-lists', {
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
            withCredentials: true,
            credentials: 'include'
        }).then(response => {
            
            return response.json()
            
        })
            .catch(err => {
                console.error(err);
                return [];
            });
    }

    const selectStyle = {

        control: (provided, state) => ({
            ...provided,
            height: '2.85rem',
            boxShadow: "none",
            border: state.isFocused && "none"
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            fontSize: '1.2rem'

        }),
        menu: (provided, state) => ({
            ...provided,
            border: "none",
            boxShadow: "none"
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused && "lightgray",

        })

    }

    async function setFileList_fetch(){

        async function ParseResult(result){
            let data = []
            for(let i = 0; i < result.length; i++){
                data[i] = {label : result[i].semester + " " + result[i].subject + " " +
                result[i].exam_type  , value : result[i].id}
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
        }())
     }, []); 
    
    const [FileList , setFileList] = useState();

    async function inspectFile(e){

        async function getPdfFile(id){
            return fetch(basicURL + 'api/view-file/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
                credentials: 'include'
            }).then(response => {
                return response.blob()
            })
                .catch(err => {
                    console.error(err);
                    return [];
                });
        }

        setCurrentFile(e)
        //console.log(e.value)
        for(let i=0;i<fileData.length;i++){
            if(fileData[i].id == e.value){
                setCurrentFileExamType(fileData[i].exam_type)
                setCurrentFileSubject(fileData[i].subject)
                setCurrentFileSemester(fileData[i].semester)
                setCurrentFileVerified(fileData[i].verified ? "已驗證" : "未驗證")
                const pdf_file = await getPdfFile(fileData[i].id)
                const url = URL.createObjectURL(pdf_file)   
                setpdfIframe(<iframe src={url}></iframe>)
                break
            }
        }
    }                                                                                                                                                                                                                                                 

    return(
        <div className="db-management">
            <div className='db-options-container'>
                <Select className='select-file'
                        options={FileList}
                        onChange={inspectFile}
                        value={currentFile}
                        placeholder="選擇檔案"
                        isMulti={false}
                        styles={selectStyle}
                    />
                {
                    currentFile == null ? 
                    <></> : 
                    <ElementComponent id='semester'
                    label='學期'
                    defaultValue={currentFileSemester}
                    onChange={(e) => setCurrentFileSemester(e.target.value)}
                    ></ElementComponent>
                }
                {
                    currentFile == null ?
                    <></> :
                    <ElementComponent id='subject'
                    label='科目'
                    defaultValue={currentFileSubject}
                    onChange={(e) => setCurrentFileSubject(e.target.value)}
                    ></ElementComponent>
                }
                {
                    currentFile == null ?
                    <></> :
                    <ElementComponent id='exam-type'
                    label='考試類型'
                    defaultValue={currentFileExamType}
                    onChange={(e) => setCurrentFileExamType(e.target.value)}
                    ></ElementComponent>
                }
                {
                    currentFile == null ?
                    <></> :
                    <ElementComponent id='verified'
                    label='驗證狀態'
                    defaultValue={currentFileVerified}
                    onChange={(e) => setCurrentFileVerified(currentFileVerified == "未驗證" ? "已驗證" : "未驗證")}
                    button={true}></ElementComponent>
                }
                {
                    currentFile == null ?
                    <></> :
                    <ElementComponent id='watermark-type'
                    label='增加浮水印'
                    defaultValue={waterMarkCategory}
                    onChange={(e) => setWaterMarkCategory(waterMarkCategory == "不新增" ? (
                        "新增圖片浮水印") : (
                            waterMarkCategory == "新增圖片浮水印" ? (
                                "新增文字浮水印"
                            ) : (
                                "不新增"
                            )
                        )
                    )}
                    button={true}></ElementComponent>
                }
                {
                    waterMarkCategory == "新增文字浮水印" ?
                    <ElementComponent id='subject'
                    label='文字浮水印內容'
                    defaultValue={waterMarkText}
                    onChange={(e) => setWaterMarkText(e.target.value)}
                    ></ElementComponent> :
                    <></>
                }
                
                {
                    currentFile == null ?
                    <></> :
                    <button className='send'>送出</button>
                }
                {
                    currentFile == null ?
                    <></> :
                    <button className='delete'>刪除檔案</button>
                }
            </div>
            <div className='pdf-container'>
                {
                    pdfIframe == null ? 
                    <></> : pdfIframe
                }
            </div>
        </div>
    )

}


const ElementComponent = ({id , defaultValue , onChange , label , button}) => {
    
    if(button){
        return(
            <div className='element-container'>
                <div className='element-label'>{label}</div>
                <button id={id} defaultValue={defaultValue} onClick={onChange}>{defaultValue}</button>
            </div>
        )
    }

    return(
        <div className='element-container'>
            <div className='element-label'>{label}</div>
            <input className='ele-input' type='text' id={id} defaultValue={defaultValue} onChange={onChange}></input>
        </div>
    )
}