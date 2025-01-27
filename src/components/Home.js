import Select from 'react-select'
import "../style/home.css"
import React, { useState } from 'react';
export default function Home(){

    //ToDo connect to backend and get all data
    const data_from_backend = getData()


    function getData(){
        
        return {

            //this is the format you should follow 
            //(parse to this format after you get the data from backend)
    
            semester:[
                {label : "上學期",value : "上學期"},
                {label : "下學期",value : "下學期"},
                {label : "暑假", value : "暑假"}
            ],
    
            course:[
                {label : "資料結構",value : "資料結構"},
                {label : "程式設計",value : "程式設計"},
                {label : "資料庫", value : "資料庫"},
                {label : "網頁程式設計", value : "網頁程式設計"},
                {label : "計算機網路", value : "計算機網路"},
                {label : "數位電路", value : "數位電路"},
                {label : "資料結構實驗", value : "資料結構實驗"},
                {label : "程式設計實驗", value : "程式設計實驗"},
                {label : "資料庫實驗", value : "資料庫實驗"}
            ],
    
            year:[
                {label : "107",value : "107"},
                {label : "108",value : "108"},
                {label : "109", value : "109"},
                {label : "110", value : "110"},
                {label : "111", value : "111"}
            ]
            
        }
    }

    const [selectedSemester, setSelectedSemester] = useState()
    const [selectedCourse, setSelectedCourse] = useState()
    const [selectedYear, setSelectedYear] = useState()


    function searchResult(){
        //ToDo : you should connect this function to backend and get a result list of 
        //all the valid options.
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

    return(
        <div className='home-container'>
            <div className='home-select-container'>
                <Select className='select-object'
                    options={data_from_backend.semester}
                    onChange={(value)=>setSelectedSemester(value)}
                    value={selectedSemester}
                    placeholder="請選擇學期"
                    isMulti={true}
                    styles={selectStyle}
                />
                <Select className='select-object'
                    options={data_from_backend.course}
                    onChange={(value)=>setSelectedCourse(value)}
                    value={selectedCourse}
                    placeholder="請選擇科目"
                    isMulti={true}
                    styles={selectStyle}
                />
                <Select className='select-object'
                    options={data_from_backend.year}
                    onChange={(value)=>setSelectedYear(value)}
                    value={selectedYear}
                    placeholder="請選擇年份"
                    isMulti={true}
                    styles={selectStyle}
                />
                <button
                style={
                    {
                        marginTop: '.5rem',
                        width: '6rem',
                        height: '3rem',
                        borderRadius: '5px',
                        fontSize: '1rem',
                    }
                }
                onClick={searchResult}
                >
                搜尋
                </button>
            </div>
        </div>
    )

}

