import Ajax from "./ajax.js";

export default class Api extends Ajax {
    loginUser = (username, password) => this.post('/login', { username, password });

    authUser = () => this.get('/auth');

    signupUser = (username, firstName, lastName, email, password, phone) =>
        this.post('/users',
            {
                username,
                firstName,
                lastName,
                email,
                password,
                phone
            });

    getUser = (id) => this.get(`/users/${id}`);

    getAllPosts = (from, count, id) => this.get('/posts', { from, count, id });
}