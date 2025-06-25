import Select from 'react-select'
import "../style/user_management.css"
import React, { useState, useEffect } from 'react';
import { basicURL } from '../App';

export default function UserManagement() {

    return (
        <div className="management-container">
            <UserManagementObj></UserManagementObj>
        </div>
    )

}

function ban_time_translator(ban_time_id: string) {
    // return ISO time string
    let now_time = new Date()
    switch (ban_time_id) {
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

const UserManagementObj = () => {
    const [bannedList, setBannedList] = useState<{ label: string; value: string }[]>([]);
    const [normalList, setNormalList] = useState<{ label: string; value: string }[]>([]);
    useEffect(() => {
        async function getUserList() {
            const [banned, normal] = await fetchUserList();
            setBannedList(banned);
            setNormalList(normal);
        }
        getUserList();
    },[]);
    interface Users {
        school_id: string;
        name: string | null;
        ban_until: string | null;
    }
    async function fetchUserList() {
        //TODO: fetch userList to setup bannedList and normalList
        //bannedList = users that is banned right now
        //normalList = users that is not banned right now
        //fetch user list
        try {
            const allList: Users[]
                = await fetch(basicURL + 'api/admin/user-list', {
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
                        return []
                    }
                })
                    .then(data => {
                        return data
                    })
                    .catch(err => {
                        console.error(err);
                        return []
                    });
            if (allList.length === 0) {
                return [[], []]
            }
            const normalList: { label: string, value: string }[] = allList.filter(
                (user: Users) =>
                    user.ban_until === null).map((user: Users) =>
                        ({ label: user.school_id, value: user.school_id }))
            const bannedList: { label: string, value: string }[] = allList.filter(
                (user: Users) =>
                    user.ban_until !== null).map((user: Users) =>
                        ({ label: `${user.school_id} (${user.ban_until ? new Date(user.ban_until).toISOString().split("T")[0] : 'N/A'})`, value: user.school_id }))
            return [bannedList, normalList]
        } catch (err) {
            console.error(err)
            return [[], []]
        }
    }

    async function confirmBanned() {
        //TODO: confirm banned user
        //update bannedList and normalList to backend
        //the list that is going to be banned = selectedNormalUser
        try {
            await fetch(basicURL + 'api/admin/ban', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    school_id: selectedNormalUser.map(user => user.value),
                    ban_until: ban_time_translator(bannedTime.value)
                })
            }).then(res => {
                if (res.status === 200) {
                    alert("封禁成功")
                    window.location.reload()
                } else {
                    console.error(res)
                    alert("封禁失敗")
                }
            })
        } catch (err) {
            console.error(err)
            alert("封禁失敗")
        }
    }

    function confirmUnbanned() {
        //TODO: confirm unbanned user
        //update bannedList and normalList to backend
        //the list that is going to be unbanned = selectedBannedUser
        try {
            fetch(basicURL + 'api/admin/unban', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    school_id: selectedBannedUser.map(user => user.value)
                })
            }).then(res => {
                if (res.status === 200) {
                    alert("解封成功")
                    window.location.reload()
                } else {
                    console.error(res)
                    alert("解封失敗")
                }
            })
        } catch (err) {
            console.error(err)
            alert("解封失敗")
        }
    }

    const bannedTimeList = [
        { label: "1 day", value: "1" },
        { label: "3 days", value: "2" },
        { label: "7 days", value: "3" },
        { label: "14 days", value: "4" },
        { label: "28 days", value: "5" },
        { label: "3 months", value: "6" },
        { label: "1 year", value: "7" },
        { label: "10 years", value: "8" },
    ];

    const [selectedBannedUser, setSelectedBannedUser] = useState<{ label: string, value: string }[]>([])
    const [selectedNormalUser, setSelectedNormalUser] = useState<{ label: string, value: string }[]>([])
    const [bannedTime, setBannedTime] = useState<{ label: string, value: string }>(bannedTimeList[0])

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
        <div className='user-management-container'>
            <h1>使用者管理</h1>
            <div className='container'>
                <div className='containerchild'>
                    <h2>封禁使用者</h2>
                    <Select className='select-object'
                        options={normalList}
                        onChange={(value) => setSelectedNormalUser(value as { label: string; value: string }[])}
                        value={selectedNormalUser}
                        placeholder="選擇封禁使用者"
                        isMulti={true}
                        styles={selectStyle}
                    />
                    <Select className='select-object'
                        options={bannedTimeList}
                        onChange={(value) => setBannedTime(value as { label: string; value: string })}
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
                </div>
                <div className='containerchild'>
                    <h2 style={{ color: 'white', }}>解封使用者</h2>
                    <Select className='select-object'
                        options={bannedList}
                        onChange={(value) => setSelectedBannedUser(value as { label: string; value: string }[])}
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
                </div>
            </div>
        </div>
    )

}