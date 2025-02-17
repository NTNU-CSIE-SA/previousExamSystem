import Select from 'react-select'
import "../style/management.css"
import React, { useState } from 'react';

export default function Management(){

    return(
        <div className="management-container">
            <UserManagement></UserManagement>
            <DBManagement></DBManagement>
        </div>
    )

}

function fetchUserList(){
    //ToDo: fetch userList to setup bannedList and normalList
    //bannedList = users that is banned right now
    //normalList = users that is not banned right now
    //fetch user list

    const normalList = [{label : "user1", value : "user1"},
                {label : "user2", value : "user2"},
                {label : "user3", value : "user3"}]

    const bannedList = [{label : "user4", value : "user4"},
                {label : "user5", value : "user5"},
                {label : "user6", value : "user6"}]
    
    return [bannedList , normalList]

}


const DBManagement = (props) =>{

    return(
        <div className="db-management">
            <h1>考古題檔案管理</h1>
        </div>
    )
}



const UserManagement = (props) =>{

    function confirmBanned(){
        //ToDo: confirm banned user
        //update bannedList and normalList to backend
        //the list that is going to be banned = selectedNormalUser

    }

    function confirmUnbanned(){
        //ToDo: confirm unbanned user
        //update bannedList and normalList to backend
        //the list that is going to be unbanned = selectedBannedUser
    }

    const userListData = fetchUserList()

    const [bannedList , setBannedList] = useState(userListData[0])
    const [normalList , setNormalList] = useState(userListData[1])

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