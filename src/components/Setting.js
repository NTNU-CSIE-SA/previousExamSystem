import React , {useRef} from 'react'
import '../style/setting.css'
export default function Setting(){

    //ToDo : fetch this function with backend to modify the password
    function resetPassword(oldPassword , newPassword){
        //this function is to trigger the reset password function
        //while user click the reset password function, the function will be triggered
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