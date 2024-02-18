import React, {useState} from 'react'
import styles from './style/Admin.module.css'

function Admin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (username === 'admin' && password === 'admin') {
          window.location.href = '/Admindashboard'; 
        } else {
          setError('Invalid username or password');
        }
      };
  return (
    <div>
        <header className={styles.header}>
            <div className={styles.line}></div>
                <h1 className={styles.title}> TECHNOAID </h1>
        </header>

        <div className={styles.container}>
            <div className={styles.box}>
                <h1 className={styles.text}> Admin </h1>
                    <p className={styles.text1}> Email: 
                        <input type="text" className={styles.textbox}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}/> </p>
                    <p className={styles.text1}> Password: 
                        <input type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}className={styles.textbox}/> </p>
                    <div className={styles.error}>
                        <p>{error}</p>
                    </div>
                <button className={styles.button} onClick={handleLogin}> Login </button>
            </div>
        </div>
    </div>
  )
}

export default Admin
