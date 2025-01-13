import { useState } from 'react'
import {FaReact} from 'react-icons/fa6'
import '../style.css'


const UserLogin = ({setUser}) => {
    const [userName, setUserName] = useState('');
    const [userSurname, setUserSurname] = useState('');

    const handleUser = () => {
        const user = `${userName} ${userSurname}`;

        if(!user) return;
        localStorage.setItem('userName', userName);
        localStorage.setItem('userSurname', userSurname);
        setUser(user);
        localStorage.setItem('avatar', `https://ui-avatars.com/api/?name=${encodeURIComponent(user)}&background=random`)
    }
  return (
    <div className='login_container'>
        <div className='login_title'>
            <FaReact className='login_icon'/>
            <h1>Chat App</h1>
        </div>
        <div className='login_form'>
            <input type="text" placeholder='Enter your name' required={true}
                   onChange={(e) => setUserName(e.target.value)}/>
            <input type="text" placeholder='Enter your last name' required={true}
                   onChange={(e) => setUserSurname(e.target.value)}/>
            <button onClick={handleUser}>Login</button>
        </div>
    </div>
  )
}

export default UserLogin