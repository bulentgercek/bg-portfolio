# BG Portfolio Full Stack Web App<a name="0"></a>

## Index

1. [Overview](#1)
2. [Infrastructure](#2)

## 1. Overview<a name="1"></a>

This is full stack Node.js web app for my personal website. The purpose of this application was not basically to have a
portfolio site. The aim was to develop my programming culture by trying many techniques while learning and to create a
full study by bringing together the methods that you find closest to my vision. In this sense, it was a very educational
and developmental study. Now, its done and you can visit safely :)

**Website URL** : [https://bulentgercek.com](https://bulentgercek.com)

[⬆Top](#0)

## 2. Infrastructure<a name="2"></a>

The entire infrastructure of this site runs on a Cloud VPS Server built on Hetzner and an Ubuntu Linux installed on it.
The entire setup has been installed and managed by myself, and the following applications form the building blocks of
the system.

- Nginx HTTP Server
- Firewall Security with Firewalld
- Certbot for SSL Certificates
- Node.js with NVM
- PM2 Node.js Process Management
- Postgres as Database Service

### 2.1. Backend / Server<a name="2.1"></a>

The modules of the project were chosen in connection with the requirements of Node 14.20, as the work on Shared Web
Hosting was started first. Although it was switched to VPS after a while, as it became insufficient, it was still
basically left the same both in terms of performance and for learning purposes. The notable node nodules list is as
follows. The backend mainly was built with the concept of REST-API.

- Typescript
- Express / Cors / Helmet / Dotenv / Multer
- Postgres
- TypeORM
- Zod

### 2.2. Frontend / Client<a name="2.2"></a>

As the backend, Client side has been developed without using a ready-made template. The notable node nodules list is as
follows.

- Typescript
- Vite
- React
- Axios
- Tailwindcss

[⬆Top](#0)
