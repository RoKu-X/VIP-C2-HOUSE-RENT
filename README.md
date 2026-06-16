**HouseRent MERN Application**  
This project is a simple MERN rental application based on the provided HouseRent document.  
**Stack**  
- MongoDB  
- Node.js  
- Express.js  
- React  
- JavaScript  
- Axios  
- Bootstrap  
- Material UI  
**Project Structure**  
- server/ — backend REST API  
- client/ — React frontend  
**Setup**  
**Backend**  
1. Open a terminal and go to server:  
2. cd /home/user/Documents/Project_mern/server  
   
3. Install packages:  
4. npm install  
   
5. Create .env from example:  
6. cp .env.example .env  
   
7. Start the server:  
8. npm run dev  
   
The backend will run on http://localhost:8000.  
**Frontend**  
1. Open another terminal and go to client:  
2. cd /home/user/Documents/Project_mern/client  
   
3. Install packages:  
4. npm install  
   
5. Start the frontend:  
6. npm run dev  
   
The React app will run on http://localhost:5173.  
**Usage**  
- Register as a tenant or owner.  
- Owner accounts require admin approval before they can add properties.  
- Admin user is created automatically from .env values.  
- Renters can browse properties, filter by location and rent, and send booking requests.  
- Owners can add properties and view bookings.  
- Admin can approve owner accounts and view all properties.  
**Notes**  
- This implementation follows the document instructions using a full MERN stack.  
- The frontend uses React, Axios, Bootstrap, and Material UI.  
- The backend uses Express, MongoDB, Mongoose, JWT, and bcrypt.  
