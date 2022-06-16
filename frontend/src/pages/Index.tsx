import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { ICreateUser } from '../interfaces/I.CreateUser'
import '../styles/Auth.css';

function Index() {

    const [registerUser, setRegisterUser] = useState<ICreateUser>({
        name: '',
        email: '',
        password: ''
    });
    
    const [loginUser, setLoginUser] = useState<ICreateUser>({
        name: '',
        password: ''
    });

    const [message, setMessage] = useState<string>('');
    const [loginMessage, setLoginMessage] = useState<string>('');

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const emailRegex =  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const passwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;

    const update = (evt: ChangeEvent<HTMLInputElement>): void => {
        let register = registerUser;
        let login = loginUser;
        
        if(evt.target.name === 'registerName'){
            register.name = evt.target.value;

        } else if(evt.target.name === 'registerEmail'){
            register.email = evt.target.value.toLowerCase();
            setEmail(register.email);

        } else if(evt.target.name === 'registerPassword'){
            register.password = evt.target.value;
            setPassword(register.password);

        } else if(evt.target.name === 'loginName'){
            login.name = evt.target.value;
            
        } else if (evt.target.name === 'loginPassword'){
            login.password = evt.target.value;
        }

        checkIfEligible()
        setRegisterUser(register);
        setLoginUser(login);
    }

    const checkIfEligible = () => {
        if(!emailRegex.test(email) && email.length > 0){
            return setMessage('User email is not correct format')
        }
        if(!passwRegex.test(password) && password.length > 0){
            return setMessage(`User password is not correct, should contain: uppercase letter,  lowercase letter, special case letter, digits, and minimum length of 6`);
        }
        if(passwRegex.test(password) || emailRegex.test(email)){
            return setMessage('');
        }
    }

    /**
     * default localStorage needs
     */
    localStorage.setItem('loggedIn', 'false');
    localStorage.setItem('token', '');

    /**
     * 
     * @param evt preventDefault, sends a request to register new user
     */
    const register = async (evt:any) => {
        evt.preventDefault();

        if(
            registerUser.name.length > 0 &&
            (registerUser.email && registerUser.email.length > 0) &&
            (registerUser.password && registerUser.password.length > 5)
        ) {
            try {
                const resp = await axios.post('http://127.0.0.1:8000/api/auth/register', {
                    name: registerUser.name,
                    email: registerUser.email,
                    password: registerUser.password
                });

                if(resp) {
                    let firstSplit = JSON.stringify(resp.data).replace('}', '').split(':');
                    let token = firstSplit[1].split(',');
                    localStorage.setItem('token', token[0].replaceAll('"', ''));
                    localStorage.setItem('loggedIn', 'true');
                }

                window.location.replace("http://localhost:3000/chat");
            } catch(err) {
                setMessage('User already exists, or the given data for registration is invalid, email must be unique')
            }
        }
    }

    /**
     * 
     * @param evt preventDefault, sends a request to login with a user
     */
    const login = async (evt:any) => {
        evt.preventDefault();
        
        if(
            loginUser.name.length > 0 &&
            (loginUser.password && loginUser.password.length > 5)
        ) {
            try{
                const resp: any = await axios.post('http://127.0.0.1:8000/api/auth/login', {
                    name: loginUser.name,
                    password: loginUser.password
                });

                if(resp){
                    let firstSplit = JSON.stringify(resp.data).replace('}', '').split(':');
                    let token = firstSplit[1].split(',');
                    localStorage.setItem('token', token[0].replaceAll('"', ''));
                    localStorage.setItem('loggedIn', 'true');

                    window.location.replace("http://localhost:3000/chat");
                }
            } catch(err){
                setLoginMessage('Username or password is invalid');
            }
        }
    }

    return (
        <div className='authContainer'>
            <div className="register">
                <form onSubmit={(evt) => register(evt)}>
                    <h1>Register Account</h1>
                    <input 
                        type="text"
                        name='registerName'
                        placeholder='username'
                        onChange={(evt) => update(evt)} />
                    <input 
                        type="email"
                        name='registerEmail'
                        placeholder='email'
                        onChange={(evt) => update(evt)} />
                    <input 
                        type="password"
                        name='registerPassword'
                        placeholder='password'
                        minLength={6}
                        onChange={(evt) => update(evt)} />
                    <p style={{color: 'turquoise', fontSize: '125%', fontWeight: 'bold', marginBottom: '2%'}}>{message}</p>
                    <button>Register</button>
                </form>
            </div>
            <div className="login">
                <form onSubmit={(evt) => login(evt)}>
                    <h1>Login Account</h1>
                    <input 
                        type="text"
                        name='loginName'
                        placeholder='username'
                        onChange={(evt) => update(evt)} />
                    <input 
                        type="password"
                        name='loginPassword'
                        placeholder='password'
                        minLength={6}
                        onChange={(evt) => update(evt)}/>
                    <p style={{color: 'turquoise', fontSize: '125%', fontWeight: 'bold', marginBottom: '2%'}}>{loginMessage}</p>
                    <button>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Index