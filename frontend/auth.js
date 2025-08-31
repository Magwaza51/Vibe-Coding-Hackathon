// Handles registration and login UI logic
import { registerUser, loginUser } from './api.js';

export function showAuthForms() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h2>Register</h2>
        <form id="registerForm">
            <input type="text" name="name" placeholder="Name" required><br>
            <input type="email" name="email" placeholder="Email" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <input type="number" name="age" placeholder="Age" required><br>
            <button type="submit">Register</button>
        </form>
        <h2>Login</h2>
        <form id="loginForm">
            <input type="email" name="email" placeholder="Email" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
        <div id="authMsg"></div>
    `;
    document.getElementById('registerForm').onsubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const user = {
            name: form.name.value,
            email: form.email.value,
            password: form.password.value,
            age: form.age.value
        };
        const res = await registerUser(user);
        document.getElementById('authMsg').innerText = res.message || res.error;
    };
    document.getElementById('loginForm').onsubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const creds = {
            email: form.email.value,
            password: form.password.value
        };
        const res = await loginUser(creds);
        if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
            window.location.reload();
        } else {
            document.getElementById('authMsg').innerText = res.error;
        }
    };
}
