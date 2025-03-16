# The Great Bengaluru Hackathon 🚀

Welcome to *The Great Bengaluru Hackathon* repository! This project was developed as part of the hackathon, focusing on solving urban challenges through innovative tech solutions. Our team built a data-driven system to enhance urban mobility and ride allocation efficiency.
**Prototype developed specially for Mobile platform.**
## 🚗 Project Overview
The project leverages *machine learning and predictive analytics* to optimize ride allocation in *Namma Yatri* by categorizing users into tiers based on their ride behavior. This system incentivizes users to accept low-demand rides while ensuring efficient ride distribution.

## 📌 Features
- *Yatri Points System: Uses **linear regression* to rank users based on:
  - Number of searches
  - Number of cancellations
  - Average distance per trip
  - Cancellation rate
- *Tier-Based Rewards*:
  - *Gold: Gets ride offers **10 seconds earlier* than others.
  - *Silver: Receives offers **after 10 seconds* if not taken by Gold users.
  - *Bronze: Receives offers **after another 10 seconds* if still unclaimed.
- *Encouraging Low-Demand Ride Acceptance*: Rewards users who take rides in low-demand areas.
- *Push Notifications for City Events: Integrated with **Google Events API* to fetch real-time city events and send push notifications to users, helping them plan rides accordingly.
- *Emergency Ride Feature*: Allows users to set their own fare in extreme cases where they need an immediate ride, ensuring quick access to transportation during emergencies.

## 🛠️ Tech Stack
- *Python* for machine learning & data analysis
- *Flask* for backend API
- *MongoDB* for database management
- *React.js* for frontend visualization
- *Linear Regression* for predictive analytics
- *Google Events API* for city event notifications

## 🔧 Installation & Setup
1. *Clone the repository*
   bash
   git clone https://github.com/AntrikshVats/the_great_bengaluru_hackathon.git
   cd the_great_bengaluru_hackathon
   
2. *Set up a virtual environment*
   bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
3. *Install dependencies*
   bash
   pip install -r requirements.txt
   
4. *Run the backend server*
   bash
   python app.py
   
5. *Start the frontend* (if applicable)
   bash
   cd frontend
   npm install
   npm start
   

## 📊 Data Processing
- The system analyzes past ride data to compute *Yatri Points*.
- Linear regression is used to assign weights to user behavior.
- A *dynamic ranking system* updates tiers based on real-time activity.

## 🎯 Impact & Benefits
✅ Encourages responsible ride behavior 🚖  
✅ Reduces cancellations and wait times ⏳  
✅ Rewards loyal and active users 🎉  
✅ Optimizes driver efficiency & earnings 💰  
✅ Keeps users informed about city events 📅  
✅ Provides quick transport access in emergencies 🚨  

## 📜 License
This project is licensed under the *MIT License*.

## 🤝 Contributors
- [Antriksh Vats] https://github.com/AntrikshVats
- [Harsh Dubey] https://github.com/Harsh3x
- [Raju DHangar] https://github.com/rajudhangar100

Feel free to contribute! Fork the repo and submit a PR. 🚀
