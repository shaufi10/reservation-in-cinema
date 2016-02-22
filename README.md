# Reservation in Cinema [January 2014]
 Project about booking seats in cinema. Application was created during studying on last year. I update my project in a few places near the middle of 2015.

## Technologies:
1. Frontend:
  - jQuery ver. 1.11.2
  - Ajax
  - LESS(CSS3)
  - HTML5
2. Backend:
  - Express(node.js) ver. 4.12.3
  - SOCKET.IO ver. 1.3.5
  - passport ver. 0.2.1
3. Database:
  - mongoose(MongoDB) ver. 4.0.2

## Roles and functionalities:
|                                | User  | Admin |
|:------------------------------:|:-----:|:-----:|
| Create user account            |X      |X      |
| Update user profile            |X      |X      |
| Book seats                     |X      |X      |
| See details about booked seat  |       |X      |
| Add/edit/remove new seance     |       |X      |
| Remove user account            |       |X      |
| Add/edit/remove newses         |       |X      |

## Steps for start the application:
1. Go to the directory with application.
2. Install all dependencies: `npm install`
3. Set path of mongoDB (e.g. `mongod --dbpath C:\your_direction_to_project\reservation-in-cinema\data`).
4. Create database on mongoDB: `use reservation`.
5. Create admin account with using command: <br />
`db.usermodels.insert( { isAdmin: true, email: "", phone: "", surname: "Smith", name: "John", password: "sha1$10eb0e25$1$bde8a0b29628ee8833c2600f30015f101711a1e5", username: "admin" } )`
6. Start Express server: `npm start`
7. Open browser with address `localhost:3000` to see application. <br />
To login on admin account please use `admin`for username and `password` for password.

## Screens from both roles

1) Admin:
![alt text][admin_png]

2) User:
![alt text][user_png]

[admin_png]: https://raw.githubusercontent.com/palprz/reservation-in-cinema/master/markdown_img_admin.png "Logo Title Text 1"
[user_png]: https://github.com/palprz/reservation-in-cinema/blob/master/markdown_img_user.png "Logo Title Text 2"
