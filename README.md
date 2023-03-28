<a name="Top"></a>

# BG Portfolio Full Stack Web Site

## Index

[3.2.5](#325-delete-remove-the-spesific-content-with-id3.2.5)

## 1. Overview

This is my personal website Node.js development repository. The purpose of this
website was not basically to have a portfolio site. The aim was to develop my
programming culture by trying many techniques while learning and to create a
full study by bringing together the methods that you find closest to my vision.
In this sense, it is a very educational and developmental study.

## 2. Infrastructure

The entire infrastructure of this site runs on a Cloud VPS Server built on
Hetzner and an Ubuntu Linux server installed on it. The entire setup has been
installed and managed by myself, and the following applications form the
building blocks of the system.

- Nginx HTTP Server
- Firewall Security with Firewalld
- Certbot for SSL Certificates
- Node.js with NVM
- PM2 Node.js Process Management
- Postgres as Database Service

### 2.1. Backend / Server

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

### 2.1. Frontend / Client

As the backend, Client side has been developed without using a ready-made
template. The notable node nodules list is as follows.

- Typescript
- Vite
- React
- Axios
- ...

## 3. Api Documentation

This Api documentation was written both for my own use and for the basic need of
a backend with REST API infrastructure. As you can guess, it provides access
through a specific port.

### 3.1 Assets

Assets is designed to reach the basic needs of the website, such as text and
images. **Asset** type objects are only related with **Content** type objects by
**relation** bond.

**Custom Types**

```javascript
AssetType {
  Image = "image",
  Video = "video",
  Text = "text",
}
```

#### 3.1.1. `GET` Get all Assets

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

#### 3.1.2. `GET` Get the spesific Asset with id

```
.../api/assets/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

_**Response Body** `Object`_

| Field    | Type      | Description  |
| -------- | --------- | ------------ |
| id       | Number    |              |
| name     | String    |              |
| type     | AssetType |              |
| text     | String    |              |
| url      | String    |              |
| contents | Content[] | { id, name } |

#### 3.1.3. `POST` Add an Asset

```
.../api/assets
```

_**Request Body** `Object`_

| Field    | Type      | Description                         |
| -------- | --------- | ----------------------------------- |
| name     | String    | default: "Untitled Asset", Optional |
| type     | AssetType | default: Image, Optional            |
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

#### 3.1.4. `PUT` Update the spesific Asset with id

```
.../api/assets/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

_**Request Body** `Object`_

| Field    | Type      | Description         |
| -------- | --------- | ------------------- |
| name     | String    | Optional            |
| type     | AssetType | Optional            |
| text     | Text      | Optional            |
| url      | String    | Optional            |
| contents | Number[]  | [ ...id ], Optional |

_**Response Body** `Object`_

| Field    | Type      | Description                 |
| -------- | --------- | --------------------------- |
| id       | Number    |                             |
| name     | String    |                             |
| type     | AssetType |                             |
| text     | String    |                             |
| url      | String    |                             |
| contents | Content[] | { id, name, type, columns } |

#### 3.1.5. `DELETE` Remove the spesific Asset with id

```
.../api/assets/:id
```

_**Request Params** `Object`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

### 3.2 Contents

Contents are designed as page modules that contain Assets. Since **Content**
type objects are used inside **Item** type objects, they have a relation with
them. However, a **Content** can only be associated with an **Item**.

**Custom Types**

```javascript
ContentType {
  TextBlock = "textBlock",
  ImageGalleryMasonry = "imageGalleryMasonry",
}
```

#### 3.2.1. `GET` Get all Contents

```
.../api/contents
```

_**Response Body** `Array`_

| Field   | Type        | Description                   |
| ------- | ----------- | ----------------------------- |
| id      | Number      |                               |
| name    | String      |                               |
| type    | ContentType |                               |
| columns | Number      |                               |
| item    | Item        | { id, name }                  |
| assets  | Asset[]     | { id, name, type, text, url } |

#### 3.2.2. `GET` Get the spesific Content with id

```
.../api/contents/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

_**Response Body** `Object`_

| Field   | Type        | Description                   |
| ------- | ----------- | ----------------------------- |
| id      | Number      |                               |
| name    | String      |                               |
| type    | ContentType |                               |
| columns | Number      |                               |
| item    | Item        | { id, name }                  |
| assets  | Asset[]     | { id, name, type, text, url } |

#### 3.2.3. `PUT` Update the spesific Content with id

```
.../api/contents/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

_**Request Body** `Object`_

| Field   | Type        | Description         |
| ------- | ----------- | ------------------- |
| name    | String      | Optional            |
| type    | ContentType | Optional            |
| columns | Number      | Optional            |
| item    | Item        | id, Optional        |
| assets  | Number[]    | [ ...id ], Optional |

_**Response Body** `Object`_

| Field   | Type        | Description                   |
| ------- | ----------- | ----------------------------- |
| id      | Number      |                               |
| name    | String      |                               |
| type    | ContentType |                               |
| columns | Number      |                               |
| item    | Item        | { id, name }                  |
| assets  | Asset[]     | { id, name, type, text, url } |

#### 3.2.4. `PUT` Assign an Asset to Content with ids

```
.../api/contents/:id/assets/:aid
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |
| aid   | Number | Required    |

_**Response Body** `Object`_

| Field   | Type        | Description                   |
| ------- | ----------- | ----------------------------- |
| id      | Number      |                               |
| name    | String      |                               |
| type    | ContentType |                               |
| columns | Number      |                               |
| item    | Item        | { id, name }                  |
| assets  | Asset[]     | { id, name, type, text, url } |

#### 3.2.5. `DELETE` Remove a spesific asset from the spesific Content with ids

<a name="3.2.5"></a>

This endpoint will remove the spesific Asset with id from Content without
deleting it from the database.

```
.../api/contents/:id/assets/:aid
```

_**Request Params** `Object`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |
| aid   | Number | Required    |

_**Response Body** `Object`_

| Field   | Type        | Description                   |
| ------- | ----------- | ----------------------------- |
| id      | Number      |                               |
| name    | String      |                               |
| type    | ContentType |                               |
| columns | Number      |                               |
| item    | Item        | { id, name }                  |
| assets  | Asset[]     | { id, name, type, text, url } |

#### 3.2.5. `DELETE` Remove the spesific Content with id

```
.../api/contents/:id
```

_**Request Params** `Object`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

## Web Url

[https://www.bulentgercek.com](https://www.bulentgercek.com)
