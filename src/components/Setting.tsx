import React, { useRef } from 'react'
import '../style/setting.css'
import { basicURL } from '../App'

async function passwordReset(oldPassword: React.RefObject<HTMLInputElement | null>, newPassword: React.RefObject<HTMLInputElement | null>) {
    if (!oldPassword.current || !newPassword.current) {
        alert('需填入舊密碼與新密碼！');
        return;
    }
    return fetch(basicURL + 'api/auth/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            old_password: oldPassword.current.value,
            new_password: newPassword.current.value
        }),
        credentials: 'include'
    })
        .then(res => {
            if (res.status === 200) {
                alert("修改密碼成功！");
                return res.status
            } else if (res.status === 400) {
                alert('需填入舊密碼與新密碼！');
                console.error('Error', res);
            } else {
                console.error(res)
                alert('密碼修改失敗(舊密碼失敗或其他原因)');
                throw new Error('密碼修改失敗(舊密碼失敗或其他原因)');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export default function Setting() {

    const resetPassword = async (oldPassword: React.RefObject<HTMLInputElement | null>, newPassword: React.RefObject<HTMLInputElement | null>) => {
        await passwordReset(oldPassword, newPassword);
    }
    return (
        <div className="setting-container">
            <ResetPassword resetFn={resetPassword} />
        </div>
    )

}

interface ResetPasswordProps {
    resetFn: (oldPassword: React.RefObject<HTMLInputElement | null>, newPassword: React.RefObject<HTMLInputElement | null>) => Promise<void>;
}

const ResetPassword = (props: ResetPasswordProps) => {

    const oldPassword = useRef<HTMLInputElement>(null);
    const newPassword = useRef<HTMLInputElement>(null);
    const confirmPassword = useRef<HTMLInputElement>(null);

    async function onClickFunction(e: React.MouseEvent<HTMLButtonElement>) {
        if (!oldPassword.current || !newPassword.current || !confirmPassword.current) {
            alert('需填入舊密碼與新密碼！');
            return;
        }
        if (oldPassword.current.value.length < 6 || newPassword.current.value.length < 6) {
            alert('密碼長度不得低於 6 個字元');
            return;
        }
        if (newPassword.current.value !== confirmPassword.current.value) {
            alert('新密碼與確認密碼不符');
            return;
        }

        await props.resetFn(oldPassword, newPassword);
        oldPassword.current.value = '';
        newPassword.current.value = '';
        confirmPassword.current.value = '';

    }


    return (
        <div className="resetPassword-container">
            <h2 className='resetPassword-title'>重設密碼 :</h2>
            <input placeholder='Old Password' type="password" ref={oldPassword}></input>
            <input placeholder='New Password' type="password" ref={newPassword}></input>
            <input placeholder='Confirm Password' type="password" ref={confirmPassword}></input>
            <button onClick={onClickFunction}>送出</button>
        </div>
    );
};