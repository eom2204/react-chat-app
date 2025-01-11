import { useState } from 'react'
import {FaReact} from 'react-icons/fa6'
import '../style.css'
import _ from 'lodash'

const UserLogin = ({setUser}) => {
    const [userName, setUserName] = useState('');
    const [userSurname, setUserSurname] = useState('');
    const handleUser = () => {
        if(!userName && !userSurname) return;
        localStorage.setItem('userName', userName);
        localStorage.setItem('userSurname', userSurname);
        setUser(`${userName} ${userSurname}`);
        localStorage.setItem('avatar', `https://picsum.photos/id/${_.random(1,1000)}/200/300`)
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