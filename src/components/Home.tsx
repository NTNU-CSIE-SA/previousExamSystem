import Select from 'react-select'
import "../style/home.css"
import React, { useState, useEffect } from 'react';
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
            credentials: 'include'
        }).then(res => res.json())
            .then(data => {
                data.semester = data.semester.map((item: any) => ({ label: item, value: item }));
                data.subject = data.subject.map((item: any) => ({ label: item, value: item }));
                data.exam_type = data.exam_type.map((item: any) => ({ label: item, value: item }));
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

    const [selectedSemester, setSelectedSemester] = useState<{ label: string, value: string }[] | null>(null)
    const [selectedCourse, setSelectedCourse] = useState<{ label: string, value: string }[] | null>(null)
    const [selectedYear, setSelectedYear] = useState<{ label: string, value: string }[] | null>(null)


    async function searchResult() {
        //all the valid options.
        //you should return an array of objects, each object has a name.
        //all selected options contain in selectedSemester, selectedCourse, selectedYear

        const toFetchFilter = {
            semester: selectedSemester === null ? [] : selectedSemester.map(item => item.value),
            subject: selectedCourse === null ? [] : selectedCourse.map(item => item.value),
            exam_type: selectedYear === null ? [] : selectedYear.map(item => item.value),
            verified: 1
        }

        return fetch(basicURL + 'api/filter/file-lists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(toFetchFilter),
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



        const getFile = async (e: React.MouseEvent<HTMLDivElement>) => {

            async function getFile() {
                return fetch(basicURL + 'api/view-file/' + (e.target as HTMLDivElement).id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
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
            if (fileSelected instanceof Blob) {
                const fileUrl = URL.createObjectURL(fileSelected);
                const newWindow = window.open(fileUrl);
                if (newWindow) {
                    newWindow.focus();
                }
            } else {
                console.error('Expected fileSelected to be a Blob, but got:', fileSelected);
            }
        }

        let result = await searchResult();
        const resultList = result.map((item: any, i: number) => {
            item = result[i].semester + ' ' + result[i].exam_type + ' ' + result[i].subject;
            return (
                <div className={"result-item r_" + item} id={result[i].id} onClick={getFile}>{item}</div>
            )
        });
        setResultLabels(resultList)
    }


    const selectStyle = {

        control: (provided: any, state: any) => ({
            ...provided,
            height: '2.85rem',
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

    return (
        <div className='home-container'>
            <div className='home-select-container'>
                <Select className='select-object'
                    options={data_from_backend.semester}
                    onChange={(value) => setSelectedSemester(value as { label: string, value: string }[])}
                    value={selectedSemester}
                    placeholder="請選擇學期"
                    isMulti={true}
                    styles={selectStyle}
                />
                <Select className='select-object'
                    options={data_from_backend.course}
                    onChange={(value) => setSelectedCourse(value as { label: string, value: string }[])}
                    value={selectedCourse}
                    placeholder="請選擇科目"
                    isMulti={true}
                    styles={selectStyle}
                />
                <Select className='select-object'
                    options={data_from_backend.year}
                    onChange={(value) => setSelectedYear(value as { label: string, value: string }[])}
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

