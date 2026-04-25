AI-Powered Cloud Service Recommendation Platform

📌 Project Overview

The AI-Powered Cloud Service Recommendation Platform is a full-stack web application that recommends suitable cloud services from AWS, Microsoft Azure, and Google Cloud Platform (GCP) based on user requirements. The system uses Generative AI to analyze natural language inputs and generate intelligent cloud architecture recommendations along with estimated cost comparisons.



🚀 Features
User Registration and Login Authentication
AI-Based Cloud Service Recommendations
Multi-Cloud Comparison (AWS, Azure, GCP)
Estimated Cost Analysis
Best Cloud Provider Selection
Responsive Frontend UI
Secure Backend APIs
PostgreSQL Database Integration
AI Integration using Google Gemini API


🛠️ Technologies Used
Frontend
React.js
HTML
CSS
JavaScript
Fetch API
Backend
Spring Boot
Java
Spring Security
REST APIs
Database
PostgreSQL
AI Integration
Google Gemini API
Tools & Platforms
IntelliJ IDEA
VS Code
GitHub
Docker
Render


⚙️ System Workflow
User enters application requirements in natural language.
React frontend sends request to Spring Boot backend.
Backend processes the request and communicates with Gemini AI.
AI generates suitable cloud service recommendations.
Backend maps cloud services for AWS, Azure, and GCP.
Cost Analysis Module calculates estimated pricing.
Frontend displays recommendations and the best cloud provider.


☁️ Cloud Services Covered
AWS
EC2
S3
RDS
DynamoDB
Lambda
CloudFront
API Gateway
Microsoft Azure
Virtual Machines
Blob Storage
SQL Database
Cosmos DB
CDN
Google Cloud Platform (GCP)
Compute Engine
Cloud Storage
Cloud SQL
Firestore
Cloud CDN


🔐 Security Features
User Authentication using Spring Security
Password Encryption using BCryptPasswordEncoder
Secure REST API Communication
PostgreSQL User Data Storage


📊 Sample Output

The system provides:

Cloud service recommendations
Cost comparison across providers
Best provider selection based on estimated pricing


🔮 Future Enhancements
Real-time cloud pricing APIs
Architecture diagram generation
Terraform / CloudFormation integration
Automated deployment
Historical recommendation tracking


📂 Project Structure
cloud-service-recommendation/
│
├── frontend/          # React Frontend
├── src/               # Spring Boot Backend
├── pom.xml
├── Dockerfile
└── README.md


▶️ How to Run the Project
Backend
mvn spring-boot:run
Frontend
cd frontend
npm install
npm start
