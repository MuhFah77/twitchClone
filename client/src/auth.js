export const getAuth = () => ({ token: localStorage.token, username: localStorage.username });
export const saveAuth = ({ token, username }) => { localStorage.token = token; localStorage.username = username; };
export const clearAuth = () => localStorage.clear();
