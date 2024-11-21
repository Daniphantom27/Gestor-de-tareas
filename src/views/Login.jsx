import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para manejar el envío del formulario
        //     console.log(isLogin ? 'Iniciando sesión...' : 'Registrando...');
        //     console.log({ username, email, password });
        if (isLogin) {

            axios.get('http://localhost/backend/public/api/usuarios')
                .then((respuesta) => {
                    console.log(respuesta.data);
                    let aux = false;
                    (respuesta.data).map(user => {
                        if (user.Email === email && user.Contraseña === password) {
                            const datos = { id: user.IdUsuario, email: email, nombre: user.Nombre };
                            localStorage.setItem("session", JSON.stringify(datos))
                            aux = true;
                        }
                    })
                    if (aux) {
                        window.location.href = "/tareas";
                    } else {
                        alert("Datos incorrectos")
                    }
                })
                .catch((error) => {
                    console.log(error.message)
                });
        }else{

            if ( username.trim()==""|| password.trim()=="" || email.trim()=="") {
                alert("Rellene todos los campos")
                return
            }
           
         
                const datos = {
                    userName: username,Email: email, Contraseña: password
                }
                axios.post('http://localhost/backend/public/api/usuarios', datos)
                    .then((respuesta) => {
                        console.log(respuesta.data);
                        alert("Usuario registrado");
                        window.location.href = "/";
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
        } 
        
    }


    return (
        <div className="container">
            <div className="form-container">
                <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</button>
                </form>
                <p>
                    {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? ' Regístrate' : ' Inicia sesión'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;

