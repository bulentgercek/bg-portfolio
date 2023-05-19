# BG Portfolio Full Stack Web App<a name="0"></a>

## Index

1. [Overview](#1)
2. [Design Process](#2)
3. [Infrastructure](#3)

## 1. Overview<a name="1"></a>

This is full stack Node.js web app for my personal website. The purpose of this application was not basically to have a
portfolio site. The aim was to develop my programming culture by trying many techniques while learning and to create a
full study by bringing together the methods that you find closest to my vision. In this sense, it was a very educational
and developmental study. Now, its done and you can visit safely :)

**Website URL** : [https://bulentgercek.com](https://bulentgercek.com)

[⬆Top](#0)

## 2. Design Process<a name="2"></a>

### 2.1 Planing with Project Diagram<a name=2.1></a>

First of all, I started with creating the diagram of the whole application. Creating a diagram is very important not
only for designing the project, but also for having a bird's eye view of the project afterwards. ExcaliDraw is really
practical for this kind of work. You can find the backend and frontend diagram of the project in the link below.

[ExcaliDraw Diagram](https://excalidraw.com/#json=w7U5dB3xC5tHorF0vzTdJ,vdoMiVrPfkJi9uorDpVObw)

### 2.2 UX/UI Design<a name="2.2"></a>

![UX/UI Design](https://bulentgercek.com/uploads/1684526817711-bg_portfolio_05_uxui.png)

> Home, Category and Item page designs

The most important feature of this web application was that it should have a responsive interface. Even on that tiny
screen of the Galaxy Fold, the website should still be usable. That's why this topic was the most important part of my
UX design philosophy. In addition to this, I wanted the application to have a navigation system that can be closed and
opened at any time and that can be accessed at any time no matter which subpage you are on. However, the site should be
able to be navigated easily even when this navigation system is completely closed. Thus, the user interface has become
large and spacious.

![Responsive Design](https://bulentgercek.com/uploads/1684527634587-bg_portfolio_04_responsive.png)

> Responsive Layout Changes

Figma is my first choice as a great tool for UX/UI design. In addition to being able to work freely, thanks to its
auto-layout and css inspect features, then transferring the design to JSX becomes incredibly fast and efficient. Since I
wanted to implement the site with Tailwindcss, I added all the basic text, color and shadow styles to my Figma design
document with the Tailwind CSS Styles Generator plugin and completed the design in this way. This greatly simplified the
entire UX/UI design and planning phase and subsequently the JSX import. You can find the Figma UX/UI design document
link down below.

[Figma Design Document](https://www.figma.com/file/wdl51nPNboUFB99sJ6M0rs/BG-Portfolio?type=design&node-id=67%3A2&t=grt8tlqdWWqyc3WQ-1)

## 3. Infrastructure<a name="3"></a>

The entire infrastructure of this site runs on a Cloud VPS Server built on Hetzner and an Ubuntu Linux installed on it.
The entire setup has been installed and managed by myself, and the following applications form the building blocks of
the system.

- Nginx HTTP Server
- Firewall Security with Firewalld
- Certbot for SSL Certificates
- Node.js with NVM
- PM2 Node.js Process Management
- Postgres as Database Service

### 3.1. Backend / Server<a name="3.1"></a>

The modules of the project were chosen in connection with the requirements of Node 14.20, as the work on Shared Web
Hosting was started first. Although it was switched to VPS after a while, as it became insufficient, it was still
basically left the same both in terms of performance and for learning purposes. The notable node nodules list is as
follows. The backend mainly was built with the concept of REST-API.

- Typescript
- Express / Cors / Helmet / Dotenv / Multer
- Postgres
- TypeORM
- Zod

### 3.2. Frontend / Client<a name="3.2"></a>

As the backend, Client side has been developed without using a ready-made template. The notable node nodules list is as
follows.

- Typescript
- Vite
- React
- Axios
- Tailwindcss

[⬆Top](#0)
