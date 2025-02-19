import React , {useRef} from 'react'
import '../style/setting.css'
import { basicURL } from '../App'

async function passwordReset(oldPassword , newPassword){
    return fetch(basicURL + 'api/auth/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            old_password : oldPassword.current.value,
            new_password : newPassword.current.value
        }),
        withCredntials: true,
        credentials: 'include'
    })
        .then(response => {
            if (response.status === 200) {
                alert("修改密碼成功！");
                return response.status
            } else if (response.status === 400) {
                alert('需填入舊密碼與新密碼！');
                console.error('Error', response);
            } else {
                console.error(response)
                alert('密碼修改失敗(舊密碼失敗或其他原因)');
                throw new Error('密碼修改失敗(舊密碼失敗或其他原因)');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export default function Setting(){

    const resetPassword = async (oldPassword , newPassword) => {
        const response = await passwordReset(oldPassword , newPassword);
        // TODO: frontend should handle the response and show the message to user
    }
    return(
        <div className="setting-container">
            <ResetPassword resetFn={resetPassword}/>
        </div>
    )

}

const ResetPassword = (props) => {

    const oldPassword = useRef('');
    const newPassword = useRef('');

    async function onClickFunction(e){

        if(oldPassword.current.value.length < 6 || newPassword.current.value.length < 6){
            alert('密碼長度不得低於 6 個字元');
            return;
        }

        await props.resetFn(oldPassword , newPassword);
        oldPassword.current.value = '';
        newPassword.current.value = '';

    }


    return (    
      <div className="resetPassword-container">
            <h2 className='resetPassword-title'>重設密碼 :</h2>
            <input placeholder='Old Password' ref={oldPassword}></input>
            <input placeholder='New Password' ref={newPassword}></input>
            <button onClick={onClickFunction}>送出</button>
      </div>
    );
  };