import Select from 'react-select'
import "../style/home.css"
import React, { useState, useEffect } from 'react';
import { data } from 'react-router-dom';
import { basicURL } from '../App';
export default function Home() {
    const [data_from_backend, setDataFromBackend] = useState({
        semester: [],
        course: [],
        year: []
    });

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await getData();
            setDataFromBackend(fetchedData);
        };

        fetchData();
    }, []);


    async function getData() {
        return fetch(basicURL + 'api/filter/tags', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            credentials: 'include'
        }).then(res => res.json())
            .then(data => {

                data.semester = data.semester.map(item => ({ label: item, value: item }));
                data.subject = data.subject.map(item => ({ label: item, value: item }));
                data.exam_type = data.exam_type.map(item => ({ label: item, value: item }));
                return {
                    semester: data.semester,
                    course: data.subject,
                    year: data.exam_type
                }

            })
            .catch(err => {
                console.error(err);
                return {
                    semester: [],
                    course: [],
                    year: []
                };
            });

    }

    const [selectedSemester, setSelectedSemester] = useState()
    const [selectedCourse, setSelectedCourse] = useState()
    const [selectedYear, setSelectedYear] = useState()


    async function searchResult() {
        //all the valid options.
        //you should return an array of objects, each object has a name.
        //all selected options contain in selectedSemester, selectedCourse, selectedYear

        const toFetchFilter = {
            semester: selectedSemester === undefined ? [] : selectedSemester.map(item => item.value),
            subject: selectedCourse === undefined ? [] : selectedCourse.map(item => item.value),
            exam_type: selectedYear === undefined ? [] : selectedYear.map(item => item.value),
            verified: 1
        }

        return fetch(basicURL + 'api/filter/file-lists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(toFetchFilter),
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

    const [resultLabels, setResultLabels] = useState(<></>)

    async function generateResult() {

        

        const getFile = async (e) =>{

            async function getFile() {
                return fetch(basicURL + 'api/view-file/' + e.target.id, {
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

            const fileSelected = await getFile();
            const fileUrl = URL.createObjectURL(fileSelected);
            window.open(fileUrl).focus();
        }

        let result = await searchResult();  
        const resultList = result.map((item, i) => {
            item = result[i].semester + ' ' + result[i].exam_type + ' ' + result[i].subject;
            return (
                <div className={"result-item r_"+item} id={result[i].id} onClick={getFile} value={0}>{item}</div>
            )
        });
        setResultLabels(resultList)
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

    return (
        <div className='home-container'>
            <div className='home-select-container'>
                <Select className='select-object'
                    options={data_from_backend.semester}
                    onChange={(value) => setSelectedSemester(value)}
                    value={selectedSemester}
                    placeholder="請選擇學期"
                    isMulti={true}
                    styles={selectStyle}
                />
                <Select className='select-object'
                    options={data_from_backend.course}
                    onChange={(value) => setSelectedCourse(value)}
                    value={selectedCourse}
                    placeholder="請選擇科目"
                    isMulti={true}
                    styles={selectStyle}
                />
                <Select className='select-object'
                    options={data_from_backend.year}
                    onChange={(value) => setSelectedYear(value)}
                    value={selectedYear}
                    placeholder="請選擇年份"
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
                        }
                    }
                    onClick={generateResult}
                >
                    搜尋
                </button>
            </div>
            <div className='result-container'>
                {resultLabels}
            </div>
        </div>
    )

}

