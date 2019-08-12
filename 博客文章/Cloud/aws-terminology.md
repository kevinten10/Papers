# AWS Terminology

### [Reference](https://blog.usejournal.com/what-is-aws-and-what-can-you-do-with-it-395b585b03c)

I am starting a series on AWS in which I will be discussing AWS from the beginning. This is the first article as the part of that series.

Whether you are looking to learn about AWS for your career or for your interest, I believe you will find this article helpful.

Let’s get Started!

Amazon Web Services (AWS) is a secure cloud services platform, offering compute power, database storage, content delivery 
and other functionality to help businesses scale and grow.

In simple words AWS allows you to do the following things-

1. Running web and application servers in the cloud to host dynamic websites.
2. Securely store all your files on the cloud so you can access them from anywhere.
3. Using managed databases like MySQL, PostgreSQL, Oracle or SQL Server to store information.
4. Deliver static and dynamic files quickly around the world using a Content Delivery Network (CDN).
5. Send bulk email to your customers.

Now that you know what you can do with AWS, lets have an overview of various AWS services.

## Basic Terminologies
1. **Region** — Region是地理区域，每个Region包含至少两个可用区
2. **Availability Zone** — 数据中心
3. **Edge Location** — CloudFront的CDN端点

## Compute
1. **EC2 (Elastic Compute Cloud)** — 这些只是云中的虚拟机，您可以在这些虚拟机上进行操作系统级别的控制. 你可以在上面做任何事情
1. **LightSail** — 如果你之前没有任何的AWS开发经验，它会自动的部署和管理你APP所需要的计算、存储和网络功能
1. **ECS (Elastic Container Service)** — 它是一个高可拓展的容器服务，使你能够在云端运行docker容器
1. **EKS (Elastic Container Service for Kubernetes)** — 使你能够无需安装和管理自己的Kubernetes控制平面，就能够在AWS上使用k8s的功能，是一个新的功能
1. **Lambda** — serverless功能允许你执行云函数，这是一个巨大的成本节省，因为您只需要在函数执行时支付。
1. **Batch** — 它使您能够使用Amazon EC2和EC2 spot fleet在AWS上轻松高效地运行任何规模的批处理计算工作负载。
1. **Elastic Beanstalk** — 允许自动部署和提供资源，如高度可伸缩的生产网站。

## Storage
1. **S3 (Simple Storage Service)** — AWS的存储服务，我们可以在其中存储文件、文件夹、图像、文档、歌曲等对象。它不能用于安装软件、游戏或操作系统。
1. **EFS (Elastic File System)** — 提供用于EC2实例的文件存储。它使用NFSv4协议，可以同时被数千个实例使用。
1. **Glacier** — 它是一种极低成本的档案[archival]服务，可以长期存储文件，比如几年甚至几十年。
1. **Storage Gateway** — 它是安装在本地/预置[on-premise]服务器上的虚拟机。您的本地数据可以备份[backed up]到AWS，以提供更多的持久性[durability]。

## Databases
1. **RDS (Relational Database Service)** — 允许您运行关系[relational]数据库，如MySQL, MariaDB, PostgreSQL, Oracle或SQL Server。这些数据库完全由AWS管理，比如安装杀毒软件[antivirus]和补丁[patches]。
1. **DynamoDB** — 它是一个高度可伸缩、高性能的NoSQL数据库。它提供了任何规模[any scale]的个位数[single-digit]毫秒延迟[latency]。
1. **Elasticache** — 它是在云中[inside]缓存数据的一种方式。它可以通过缓存最频繁的查询来减轻数据库的负载[take load off]。
1. **Neptune** — 它是最近推出的。它是一种快速、可靠[reliable]、可伸缩的图形数据库服务
1. **RedShift** — 它是AWS的数据仓库[warehousing]解决方案，可用于运行复杂的OLAP查询。

## Migration
1. **DMS (Database Migration Service)** — It can be used to migrate on-site databases to AWS. It also allows you to migrate from one type of database to another. Eg -from Oracle to MySQL.
1. **SMS (Server Migration Service)** — It allows you to migrate on-site servers to AWS easily and quickly.
1. **Snowball** — It is a briefcase sized appliance that can be used to send terabytes of data inside and outside of AWS.
1. Networking & Content Delivery
1. **VPC (Virtual Private Cloud)** — It is simply a data center in the cloud in which you deploy all your resources. It allows you to better isolate your resources and secure them.
1. CloudFront -It is AWS’s Content Delivery Network (CDN) that consists of Edge locations that cache resources.
1. **Route53** — It is AWS’s highly available DNS (Domain Name System) service. You can register domain names through it.
1. **Direct Connect** — Using it you can connect your data center to an Availability zone using a high speed dedicated line.
1. **API Gateway** — Allows you to create, store and manage APIs at scale.

## Developer Tools
1. **CodeStar** — It is a cloud-based service for creating, managing, and working with software development projects on AWS. You can quickly develop, build, and deploy applications on AWS with an AWS CodeStar project.
1. **CodeCommit** — It is AWS’s version control service that allows you to store your code and other assets privately in the cloud.
1. **CodeBuild** — It automates the process of building (compiling) your code.
1. **CodeDeploy** — It is a way of deploying your code in EC2 instances automatically.
1. **CodePipeline** — Allows you to keep track of different steps in your deployment like building, testing, authentication, and deployment on development and production environments.
1. **Cloud9** —It is an IDE (Integrated Development Environment) for writing, running, and debugging code in the cloud.
1. **X-Ray** — It makes it easy for developers to analyze the behavior of their distributed applications by providing request tracing, exception collection, and profiling capabilities.

## Management Tools
1. **CloudWatch** — It can be used to monitor AWS environments like CPU utilization of EC2 and RDS instances and trigger alarms based on different metrics.
1. **CloudFormation** — It is a way of turning infrastructure into the cloud. You can use templates to provision a whole production environment in minutes.
1. **CloudTrail** — A way of auditing AWS resources. It logs all changes and API calls made to AWS.
1. **OpsWorks** — It helps in automating Chef deployments on AWS.
1. **Config** — It monitors your environment and notifies you when you break certain configurations.
1. **Service Catalog** — For larger enterprises, helps to authorize which services will be used and which won’t be.
1. **Trusted Advisor** — Gives you recommendations on how to do cost optimizations, and secure your environment.
1. **AWS Auto Scaling** — Allows you to automatically scale your resources up and down based on CloudWatch metrics.
1. **Systems Manager** — Allows you to group your resources, so you can quickly gain insights, identify issues and act on them.
1. **Managed Service**s—It provides ongoing management of your AWS infrastructure so you can focus on your applications.

## Analytics
1. **Athena** — Allows you to run SQL queries on your S3 bucket to find files.
1. **EMR (Elastic Map Reduce)** — It is used for big data processing like Hadoop, Apache Spark, and Splunk, etc.
1. **CloudSearch** — It can be used to create a fully managed search engine for your website.
1. **ElasticSearch** — It is similar to CloudSearch but gives you more features like application monitoring.
1. **Kinesis** — A way of streaming and analyzing real-time data at massive scale. It can store TBs of data per hour.
1. **Data Pipeline** — Allows you to move data from one place to another. Eg: from S3 to DynamoDB or vice versa.
1. **QuickSight** —A business analytics tool that allows you to create visualizations in a rich dashboard for data in AWS. Eg: for S3, DynamoDB, etc.
1. **Glue** — It is a fully managed ETL (extract, transform, and load) service that makes it simple and cost-effective to categorize your data, clean it, enrich it, and move it reliably between various data stores.

## Security, Identity, and Compliance
1. **IAM (Identity and Access Management)** — Allows you to manage users, assign policies, create groups to manage multiple users.
1. **Inspector** — It is an agent that you install on our virtual machines, which then reports any security vulnerabilities.
1. **Certificate Manager** — It gives free SSL certificates for your domains that are managed by Route53.
1. **Directory Service** — A way of using your company’s account to log in to AWS.
1. **WAF (Web Application Firewall)** — Gives you application-level protection and blocks SQL injection and cross-site scripting attacks.
1. **CloudHSM** — It helps you meet corporate, contractual, and regulatory compliance requirements for data security by using dedicated Hardware Security Module (HSM) appliances within the AWS Cloud.
1. **Cloud Directory** — It enables you to build flexible, cloud-native directories for organizing hierarchies of data along multiple dimensions.
1. **KMS (Key Management Service)** — It is a managed service that makes it easy for you to create and control the encryption keys used to encrypt your data.
1. **Organizations** — It allows you to create groups of AWS accounts that you can use to more easily manage security and automation settings.
1. **Shield** — A managed DDoS (Distributed Denial of Service) protection service that safeguards web applications running on AWS.
1. **Artifact** — It is the place where you can get all your compliance certifications.
1. **Macie** — A data visibility security service that helps classify and protect your sensitive and business-critical content.
1. **GuardDuty** —Provides intelligent threat detection to protect your AWS accounts and workloads

## Application Services
1. **Step Functions** — A way of visualizing what’s going inside your application and what different microservices it is using.
1. **SWF (Simple Workflow Service)** — A way of coordinating both automated tasks and human-led tasks.
1. **SNS (Simple Notification Service)** — Can be used to send you notifications in the form of email and SMS regarding your AWS services. It is a push-based service.
1. **SQS (Simple Queue Service)** — The first service offered by AWS. It can be used to decouple your applications. It is a pull-based service.
1. **Elastic Transcoder** — Changes a video’s format and resolution to support different devices like tablets, smartphones, and laptops of different resolutions.

## Mobile Services
1. **Mobile Hub** — Allows you to add, configure and design features for mobile apps. It is a console for mobile app development.
1. **Cognito** — Allows your users to signup using social identity providers.
1. **Device Farm** — Enables you to improve quality of apps by quickly testing on hundreds of mobile devices.
1. **AWS AppSync** —It is an enterprise level, fully managed GraphQL service with real-time data synchronization and offline programming features.
1. **Mobile Analytics** — Allows to simply and cost effectively analyze mobile data.

## Business Productivity
1. **Alexa for Business** — It lets you empower your organization with voice, using Alexa. Allows you to build custom voice skills for your organization.
1. **Chime** — Can be used for online meeting and video conferencing.
1. **WorkDocs** — Helps to store documents in the cloud
1. **WorkMail** — Allows you to send and receive business emails.

## Desktop & App Streaming
1. **WorkSpaces** — It is a VDI (Virtual Desktop Infrastructure). Allows you to use remote desktops in the cloud
1. **AppStream 2.0** — A way of streaming desktop applications to your users in the web browser. Eg: Using MS Word in Google Chrome.

## Artificial Intelligence
1. **Lex** — Allows you to quickly build chatbots.
1. **Polly** — AWS’s text-to-speech service. You can create audio versions of your notes using it.
1. **Machine learning** — You just have to give your dataset and target variable and AWS will take care of training your model.
1. **Rekognition** — AWS’s face recognition service. Allows you to recognize faces and object in images and videos.
1. **SageMaker** — Helps you to build, train and deploy machine learning models at any scale.
1. **Comprehend** — It is a Natural Language Processing (NLP) service that uses machine learning to find insights and relationships in text. It can be used for sentiment analysis.
1. **Transcribe** — It is the opposite of Polly. It is AWS’s speech-to-text service that provides that provides high-quality and affordable transcriptions.
1. **Translate** — It is like Google Translate and allows you to translate text in one language to another.
1. AR & VR (Augmented Reality & Virtual Reality)
1. **Sumerian** — It is a set of tools for creating high-quality virtual reality (VR) experiences on the web. You can quickly create interactive 3D scenes and publish it as a website for users to access.

## Customer Engagement
1. **Amazon Connect** — Allows you to create a customer care center in the cloud.
1. **Pinpoint** — It is like Google analytics for mobile applications. It helps you to understand users and engage with them.
1. **SES (Simple Email Service)** — Allows you to send bulk emails to your customers at an extremely low price.

## Game Development
1. **GameLift** — It is a service managed by AWS that can used to host dedicated game servers. It seamlessly scales without taking your game offline.

## Internet of Things
1. **IoT Cor**e— It is a managed cloud platform that lets connected devices** — cars, light bulbs, sensor grids, and more** — easily and securely interact with cloud applications and other devices.
1. **IoT Device Management** — Allows you to manage your IoT devices at any scale.
1. **IoT Analytics** — Can be used to perform analysis on data collected by your IoT devices.
1. **Greengrass** — Lets your IoT devices to process the locally generated data while advantage of AWS services.
1. **Amazon FreeRTOS** — It is a real-time operating system for microcontrollers that makes it easy to securely connect IoT devices locally or to the cloud.
