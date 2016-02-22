# Reservation in Cinema [January 2014]
 Project about booking seats in cinema. Application was created during studying on last year. I update my project in a few places near the middle of 2015.

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
1. Go to the directory with application
2. `npm install`
3. Set path of mongoDB (e.g. `mongod --dbpath C:\your_direction_to_project\reservation-in-cinema\data`)
4. `npm start`
5. Open browser with address `localhost:3000` to see application

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
