import Select from 'react-select'
import "../style/management.css"
import React, { useState, useEffect } from 'react';
import { basicURL } from './Home';

export default function Management(){

    return(
        <div className="management-container">
            <UserManagement></UserManagement>
            <DBManagement></DBManagement>
        </div>
    )

}



const DBManagement = (props) =>{

    return(
        <div className="db-management">
            <h1>考古題檔案管理</h1>
        </div>
    )
}

function ban_time_translator(ban_time_id){
    // return ISO time string
    let now_time = new Date()
    switch(ban_time_id){
        case '1':
            now_time.setDate(now_time.getDate() + 1);
            return now_time.toISOString();
        case '2':
            now_time.setDate(now_time.getDate() + 3);
            return now_time.toISOString();
        case '3':
            now_time.setDate(now_time.getDate() + 7);
            return now_time.toISOString();
        case '4':
            now_time.setDate(now_time.getDate() + 14);
            return now_time.toISOString();
        case '5':
            now_time.setDate(now_time.getDate() + 28);
            return now_time.toISOString();
        case '6':
            now_time.setMonth(now_time.getMonth() + 3);
            return now_time.toISOString();
        case '7':
            now_time.setFullYear(now_time.getFullYear() + 1);
            return now_time.toISOString();
        case '8':
            now_time.setFullYear(now_time.getFullYear() + 10);
            return now_time.toISOString();
        default:
            now_time.setDate(now_time.getDate() + 1) // default 1 day
            return now_time.toISOString()
    }
}

const UserManagement = (props) =>{
    const [bannedList, setBannedList] = useState([]);
    const [normalList, setNormalList] = useState([]);
    useEffect(() => {
        async function getUserList() {
            const [banned, normal] = await fetchUserList();
            setBannedList(banned);
            setNormalList(normal);
        }
        getUserList();
    }, []);
    async function fetchUserList(){
        //TODO: fetch userList to setup bannedList and normalList
        //bannedList = users that is banned right now
        //normalList = users that is not banned right now
        //fetch user list
        const allList = await fetch(basicURL + 'api/admin/user-list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
                credentials: 'include'
            }).then(res => res.json())
            .then(data => {
                return data
            })
            .catch(err => {
                console.error(err);
                return [[],[]]
            });
        const normalList = allList.filter(user => user.ban_until === null).map(user => ({label: user.school_id , value: user.school_id}))
        const bannedList = allList.filter(user => user.ban_until !== null).map(user => ({label: `${user.school_id} (${new Date(user.ban_until).toISOString().split("T")[0]})`, value: user.school_id}))
        return [bannedList , normalList]
    }

    async function confirmBanned(){
        //TODO: confirm banned user
        //update bannedList and normalList to backend
        //the list that is going to be banned = selectedNormalUser
        const ban_time = await fetch(basicURL + 'api/admin/ban', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            credentials: 'include',
            body: JSON.stringify({
                school_id: selectedNormalUser.map(user => user.value),
                ban_until: ban_time_translator(bannedTime.value)
            })
        }).then(res => {
            if(res.status === 200){
                alert("封禁成功")
                window.location.reload()
            }else{
                console.error(res)
                alert("封禁失敗")
            }
        })
    }

    function confirmUnbanned(){
        //TODO: confirm unbanned user
        //update bannedList and normalList to backend
        //the list that is going to be unbanned = selectedBannedUser

        const unban = fetch(basicURL + 'api/admin/unban', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            credentials: 'include',
            body: JSON.stringify({
                school_id: selectedBannedUser.map(user => user.value)
            })
        }).then(res => {
            if(res.status === 200){
                alert("解封成功")
                window.location.reload()
            }else{
                console.error(res)
                alert("解封失敗")
            }
        })
    }

    const bannedTimeList = [
        {label : "1 day",value : "1"},
        {label : "3 days",value : "2"},
        {label : "7 days",value : "3"},
        {label : "14 days",value : "4"},
        {label : "28 days",value : "5"},
        {label : "3 months",value : "6"},
        {label : "1 year",value : "7"},
        {label : "10 years",value : "8"},
    ]

    const [selectedBannedUser , setSelectedBannedUser] = useState([])
    const [selectedNormalUser , setSelectedNormalUser] = useState([])
    const [bannedTime , setBannedTime] = useState("1")
    
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
        <div className='user-management-container'>
            <h1>使用者管理</h1>
            <container>
                <containerchild>
                    <h2>封禁使用者</h2>
                    <Select className='select-object'
                        options={normalList}
                        onChange={(value)=>setSelectedNormalUser(value)}
                        value={selectedNormalUser}
                        placeholder="選擇封禁使用者"
                        isMulti={true}
                        styles={selectStyle}
                    />
                    <Select className='select-object'
                        options={bannedTimeList}
                        onChange={(value)=>setBannedTime(value)}
                        value={bannedTime}
                        placeholder="選擇封禁時長"
                        isMulti={false}
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
                                margin: 0,
                                marginBottom: '1rem',
                            }
                        }
                        onClick={confirmBanned}
                        >
                        送出
                    </button>
                </containerchild>
                <containerchild>
                    <h2 style={{color: 'white',}}>解封使用者</h2>
                    <Select className='select-object'
                        options={bannedList}
                        onChange={(value)=>setSelectedBannedUser(value)}
                        value={selectedBannedUser}
                        placeholder="選擇解封使用者"
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
                                margin: 0,
                                marginBottom: '1rem',
                            }
                        }
                        onClick={confirmUnbanned}
                        >
                        送出
                    </button>
                </containerchild>
            </container>
            <hr size="1" align="center" noshade width="90%" color="white"></hr>
        </div>
    )

}