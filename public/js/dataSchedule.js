
var app = new Vue({

    el: "#app",

    data: {

        games: [],
        game: null,
        day: [],
        local: [],
        visitor: [],
        time: [],
        location: [],
        homePage: [],
        eventPage: [],
        mapPage: [],
        page: "homePage",
        map: [],
        chatPage: [],
        textInput: '',
        posts: [],
        user: null,
        userName: [],
        message:[],
        advice: "You must to be logged"

    },

    created() {
        this.logic();

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                app.user = firebase.auth().currentUser;
                app.getPosts();
                
            } else {
                // No user is signed in.
                app.user = null;
            }
        });

    },

    methods: {
        async logic() {
            var url = "https://api.npoint.io/ff9dd3bdf56b858f29c5"

            let data = await fetch(url, {
                method: "GET",
            })

                .then(response => response.json())
                .then(data => data)
                .catch(error => console.log(error));

            this.games = data.games
            this.day = this.games.map(game => game.day);
            this.map = this.games.map(game => game.map)


            console.log(this.games)
            console.log(this.day)
            // console.log(this.map)


        },

        changePage(page, index = null) {
            this.page = page;

            if (index != null)
                this.game = this.games[index]
            else
                this.game = null
        },


        

        // ------------------- CHAT -------------------

        login() {
            // https://firebase.google.com/docs/auth/web/google-signin

            // Provider
            var provider = new firebase.auth.GoogleAuthProvider();

            // How to Log In
            firebase.auth().signInWithPopup(provider);

        },

        updateUser() {
            var googleAuthProvider = new firebase.auth.GoogleAuthProvider();
            googleAuthProvider.setCustomParameters({
                prompt: 'select_account'
            });
            firebase.auth().signInWithRedirect(googleAuthProvider)

        },

        logout() {
            firebase.auth().signOut();

        },

        writeNewPost() {
            // https://firebase.google.com/docs/database/web/read-and-write

            // Values
            var text = this.textInput;
            var userName = firebase.auth().currentUser.displayName;
            var email = firebase.auth().currentUser.email;
            var photoURL = firebase.auth().currentUser.photoURL;


            // A post entry

            var post = {
                name: userName,
                body: text,
                email,
                photoURL
            };


            // Get a key for a new Post.
            var newPostKey = firebase.database().ref().child('ubiqum').push().key;

            //Write data
            var updates = {};
            updates[newPostKey] = post;

            this.textInput="";
            

            return firebase.database().ref('ubiqum').update(updates);

        },

        

        getPosts() {

            firebase.database().ref('ubiqum').on('value', function (data) {
                app.posts = data.val();
            
  
            })

        },

        

        


    }

})