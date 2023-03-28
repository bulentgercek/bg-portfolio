# BG Portfolio Full Stack Web Site

## 1. Overview

This is my personal website Node.js development repository. The purpose of this
website was not basically to have a portfolio site. The aim was to develop my
programming culture by trying many techniques while learning and to create a
full study by bringing together the methods that you find closest to me. In this
sense, it is a very educational and developmental study.

## 2. Infrastructure

The entire infrastructure of this site runs on a Cloud VPS Server built on
Hetzner and an Ubuntu Linux server installed on it. The entire setup has been
installed and managed by myself, and the following applications form the
building blocks of the system.

- Nginx HTTP Server
- Firewall Security
- PM2 Node.js Management
- Postgres for Database Service
- Certbot for SSL Certificates
- Node.js with NVM

### 2.1. Server / Backend

The modules of the project were chosen in connection with the requirements of
Node 14.20, as the work on Shared Web Hosting was started first. Although it was
switched to VPS after a while, as it became insufficient, it was still basically
left the same both in terms of performance and for learning purposes. The
notable node nodules list is as follows.

- Typescript
- Express / Cors / Helmet / Dotenv
- Postgres
- TypeORM
- Zod

### 2.1. Client / Frontend

As the backend, Client side has been developed without using a ready-made
template. The notable node nodules list is as follows.

- Typescript
- Vite
- React

## 3. Api Documentation

This Api documentation was written both for my own use and for the basic need of
a backend with REST API infrastructure. As you can guess, it provides access
through a specific port.

### 3.1 Assets

Assets is designed to reach the basic needs of the website, such as text and
images. Assets are also used for Contents. **Asset** type objects are only
related with **Content** type objects by **relation** bond with TypeORM
(ManyToMany).

**Custom Types**

```javascript
AssetType {
  Image = "image",
  Video = "video",
  Text = "text",
}
```

- #### `GET` Get all Assets

```
.../api/assets
```

_**Response Body** `Array`_

| Field    | Type      | Description  |
| -------- | --------- | ------------ |
| id       | Number    |              |
| name     | String    |              |
| type     | AssetType |              |
| text     | Text      |              |
| url      | String    |              |
| contents | Content[] | { id, name } |

- #### `GET` Get spesific Asset with id

```
.../api/assets/:id
```

_**Response Body** `Object`_

| Field    | Type      | Description  |
| -------- | --------- | ------------ |
| id       | Number    |              |
| name     | String    |              |
| type     | AssetType |              |
| text     | String    |              |
| url      | String    |              |
| contents | Content[] | { id, name } |

- #### `POST` Add an Asset

```
.../api/assets
```

_**Request Body** `Object`_

| Field    | Type      | Description                         |
| -------- | --------- | ----------------------------------- |
| name     | String    | default: "Untitled Asset", Optional |
| type     | AssetType | Optional                            |
| text     | Text      | Optional                            |
| url      | String    | Optional                            |
| contents | Number[]  | [ ...id ], Optional                 |

_**Response Body** `Object`_

| Field    | Type      | Description  |
| -------- | --------- | ------------ |
| id       | Number    |              |
| name     | String    |              |
| type     | AssetType |              |
| text     | String    |              |
| url      | String    |              |
| contents | Content[] | { id, name } |

## Web Url

[https://www.bulentgercek.com](https://www.bulentgercek.com)
