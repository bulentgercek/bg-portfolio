# BG Portfolio Full Stack Web Site<a name="0"></a>

## Index

1. [Overview](#1)
2. [Infrastructure](#2)
3. [Api Documentation](#3)

## 1. Overview<a name="1"></a>

This is my personal website Node.js development repository. The purpose of this
website was not basically to have a portfolio site. The aim was to develop my
programming culture by trying many techniques while learning and to create a
full study by bringing together the methods that you find closest to my vision.
In this sense, it is a very educational and developmental study.

**Website URL** : [https://bulentgercek.com](https://bulentgercek.com)

[⬆Top](#0)

## 2. Infrastructure<a name="2"></a>

The entire infrastructure of this site runs on a Cloud VPS Server built on
Hetzner and an Ubuntu Linux installed on it. The entire setup has been installed
and managed by myself, and the following applications form the building blocks
of the system.

- Nginx HTTP Server
- Firewall Security with Firewalld
- Certbot for SSL Certificates
- Node.js with NVM
- PM2 Node.js Process Management
- Postgres as Database Service

### 2.1. Backend / Server<a name="2.1"></a>

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

### 2.2. Frontend / Client<a name="2.2"></a>

As the backend, Client side has been developed without using a ready-made
template. The notable node nodules list is as follows.

- Typescript
- Vite
- React
- Axios
- ...

[⬆Top](#0)

## 3. Api Documentation<a name="3"></a>

This Api documentation was written both for my own use and for the basic need of
a backend with REST API infrastructure. As you can guess, it provides access
through a specific port.

1. [Assets](#3.1)
2. [Contents](#3.2)
3. [Items](#3.3)
4. [Categories](#3.4)
5. [Options](#3.5)

[⬆Top](#0)

### 3.1. Assets<a name="3.1"></a>

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

**Endpoints**

1. [`GET` Get Assets](#3.1.1)
2. [`GET` Get Asset](#3.1.2)
3. [`POST` Add Asset](#3.1.3)
4. [`PUT` Update Asset](#3.1.4)
5. [`DELETE` Remove Asset](#3.1.5)

[⬆Api Documentation](#3)

#### 3.1.1. `GET` Get Assets<a name="3.1.1"></a>

```
.../api/assets
```

_**Response Body** `Array`_

| Field       | Type      | Description  |
| ----------- | --------- | ------------ |
| id          | Number    |              |
| name        | String    |              |
| type        | AssetType |              |
| text        | Text      |              |
| url         | String    |              |
| contents    | Content[] | { id, name } |
| updatedDate | Date      |              |

[⬆Assets](#3.1)

#### 3.1.2. `GET` Get Asset<a name="3.1.2"></a>

```
.../api/assets/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

_**Response Body** `Object`_

| Field       | Type      | Description  |
| ----------- | --------- | ------------ |
| id          | Number    |              |
| name        | String    |              |
| type        | AssetType |              |
| text        | String    |              |
| url         | String    |              |
| contents    | Content[] | { id, name } |
| updatedDate | Date      |              |

[⬆Assets](#3.1)

#### 3.1.3. `POST` Add Asset<a name="3.1.3"></a>

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

| Field       | Type      | Description  |
| ----------- | --------- | ------------ |
| id          | Number    |              |
| name        | String    |              |
| type        | AssetType |              |
| text        | String    |              |
| url         | String    |              |
| contents    | Content[] | { id, name } |
| updatedDate | Date      |              |

[⬆Assets](#3.1)

#### 3.1.4. `PUT` Update Asset<a name="3.1.4"></a>

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

| Field       | Type      | Description                 |
| ----------- | --------- | --------------------------- |
| id          | Number    |                             |
| name        | String    |                             |
| type        | AssetType |                             |
| text        | String    |                             |
| url         | String    |                             |
| contents    | Content[] | { id, name, type, columns } |
| updatedDate | Date      |                             |

[⬆Assets](#3.1)

#### 3.1.5. `DELETE` Delete Asset<a name="3.1.5"></a>

```
.../api/assets/:id
```

_**Request Params** `Object`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

[⬆Assets](#3.1)

### 3.2. Contents<a name="3.2"></a>

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

**Endpoints**

1. [`GET` Get Contents](#3.2.1)
2. [`GET` Get Content](#3.2.2)
3. [`POST` Add Content](#3.2.3)
4. [`PUT` Update Content](#3.2.4)
5. [`PUT` Assign Asset to Content](#3.2.5)
6. [`DELETE` Remove Asset from Content](#3.2.6)
7. [`DELETE` Delete Content](#3.2.7)

[⬆Api Documentation](#3)

#### 3.2.1. `GET` Get Contents<a name="3.2.1"></a>

```
.../api/contents
```

_**Response Body** `Array`_

| Field   | Type        | Description                                |
| ------- | ----------- | ------------------------------------------ |
| id      | Number      |                                            |
| name    | String      |                                            |
| type    | ContentType |                                            |
| columns | Number      |                                            |
| item    | Item        | { id, name }                               |
| assets  | Asset[]     | { id, name, type, text, url, updatedDate } |

[⬆Contents](#3.2)

#### 3.2.2. `GET` Get Content<a name="3.2.2"></a>

```
.../api/contents/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

_**Response Body** `Object`_

| Field   | Type        | Description                                |
| ------- | ----------- | ------------------------------------------ |
| id      | Number      |                                            |
| name    | String      |                                            |
| type    | ContentType |                                            |
| columns | Number      |                                            |
| item    | Item        | { id, name }                               |
| assets  | Asset[]     | { id, name, type, text, url, updatedDate } |

[⬆Contents](#3.2)

#### 3.2.3. `POST` Add Content<a name="3.2.3"></a>

_**Request Body** `Object`_

| Field   | Type        | Description         |
| ------- | ----------- | ------------------- |
| name    | String      | Optional            |
| type    | ContentType | Optional            |
| columns | Number      | Optional            |
| item    | Item        | id, Optional        |
| assets  | Number[]    | [ ...id ], Optional |

_**Response Body** `Object`_

| Field   | Type        | Description                                |
| ------- | ----------- | ------------------------------------------ |
| id      | Number      |                                            |
| name    | String      |                                            |
| type    | ContentType |                                            |
| columns | Number      |                                            |
| item    | Item        | { id, name, description, link, featured }  |
| assets  | Asset[]     | { id, name, type, text, url, updatedDate } |

[⬆Contents](#3.2)

#### 3.2.4. `PUT` Update Content<a name="3.2.4"></a>

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

| Field   | Type        | Description                                |
| ------- | ----------- | ------------------------------------------ |
| id      | Number      |                                            |
| name    | String      |                                            |
| type    | ContentType |                                            |
| columns | Number      |                                            |
| item    | Item        | { id, name }                               |
| assets  | Asset[]     | { id, name, type, text, url, updatedDate } |

[⬆Contents](#3.2)

#### 3.2.5. `PUT` Assign Asset to Content<a name="3.2.5"></a>

```
.../api/contents/:id/assets/:aid
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |
| aid   | Number | Required    |

_**Response Body** `Object`_

| Field   | Type        | Description                                |
| ------- | ----------- | ------------------------------------------ |
| id      | Number      |                                            |
| name    | String      |                                            |
| type    | ContentType |                                            |
| columns | Number      |                                            |
| item    | Item        | { id, name }                               |
| assets  | Asset[]     | { id, name, type, text, url, updatedDate } |

[⬆Contents](#3.2)

#### 3.2.6. `DELETE` Remove Asset from Content<a name="3.2.6"></a>

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

| Field   | Type        | Description                                |
| ------- | ----------- | ------------------------------------------ |
| id      | Number      |                                            |
| name    | String      |                                            |
| type    | ContentType |                                            |
| columns | Number      |                                            |
| item    | Item        | { id, name }                               |
| assets  | Asset[]     | { id, name, type, text, url, updatedDate } |

[⬆Contents](#3.2)

#### 3.2.7. `DELETE` Delete Content<a id='3.2.7'></a>

```
.../api/contents/:id
```

_**Request Params** `Object`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

[⬆Contents](#3.2)

### 3.3. Items<a name="3.3"></a>

Items was designed as portfolio object. An **Item** can have array of
**Content** and **Category**.

**Endpoints**

1. [`GET` Get Items](#3.3.1)
2. [`GET` Get Item](#3.3.2)
3. [`GET` Get Contents of Item](#3.3.3)
4. [`GET` Get Content of Item](#3.3.4)
5. [`POST` Add Item](#3.3.5)
6. [`PUT` Update Item](#3.3.6)
7. [`PUT` Delete Item](#3.3.7)

[⬆Api Documentation](#3)

#### 3.3.1. `GET` Get Items<a name="3.3.1"></a>

```
.../api/items
```

_**Response Body** `Array`_

| Field              | Type          | Description                                         |
| ------------------ | ------------- | --------------------------------------------------- |
| id                 | Number        |                                                     |
| name               | String        |                                                     |
| description        | Text          |                                                     |
| link               | string        |                                                     |
| featured           | Boolean       |                                                     |
| featuredImageAsset | Asset or Null | { id, name, url }                                   |
| categories         | Category[]    | { id, name, parentCategories[], childCategories[] } |
| contents           | Content[]     | { id, name, type, columns, assets[] }               |
| updatedDate        | Date          |                                                     |

[⬆Items](#3.3)

#### 3.3.2. `GET` Get Item<a name="3.3.2"></a>

```
.../api/items/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

_**Response Body** `Object`_

| Field              | Type          | Description                                         |
| ------------------ | ------------- | --------------------------------------------------- |
| id                 | Number        |                                                     |
| name               | String        |                                                     |
| description        | Text          |                                                     |
| link               | string        |                                                     |
| featured           | Boolean       |                                                     |
| featuredImageAsset | Asset or Null | { id, name, url }                                   |
| categories         | Category[]    | { id, name, parentCategories[], childCategories[] } |
| contents           | Content[]     | { id, name, type, columns, assets[] }               |
| updatedDate        | Date          |                                                     |

[⬆Items](#3.3)

#### 3.3.3. `GET` Get Contents of Item<a name="3.3.3"></a>

```
.../api/items/:id/contents
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

_**Response Body** `Array`_

| Field   | Type        | Description                                |
| ------- | ----------- | ------------------------------------------ |
| id      | Number      |                                            |
| name    | String      |                                            |
| type    | ContentType |                                            |
| columns | Number      |                                            |
| assets  | Asset[]     | { id, name, type, text, url, updatedDate } |

[⬆Items](#3.3)

#### 3.3.4. `GET` Get Content of Item<a name="3.3.4"></a>

```
.../api/items/:id/contents/:cid
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |
| cid   | Number | Required    |

_**Response Body** `Object`_

| Field   | Type        | Description                                |
| ------- | ----------- | ------------------------------------------ |
| id      | Number      |                                            |
| name    | String      |                                            |
| type    | ContentType |                                            |
| columns | Number      |                                            |
| assets  | Asset[]     | { id, name, type, text, url, updatedDate } |

[⬆Items](#3.3)

#### 3.3.5. `POST` Add Item<a name="3.3.5"></a>

```
.../api/items/
```

_**Request Body** `Object`_

| Field              | Type          | Description                        |
| ------------------ | ------------- | ---------------------------------- |
| name               | String        | default: "Untitled Item", Optional |
| description        | Text          | Optional                           |
| link               | string        | Optional                           |
| featured           | Boolean       | default: false, Optional           |
| featuredImageAsset | Asset or Null | { id }, Optional                   |
| categories         | Category[]    | { id }, Required                   |

_**Response Body** `Object`_

| Field              | Type          | Description                                         |
| ------------------ | ------------- | --------------------------------------------------- |
| id                 | Number        |                                                     |
| name               | String        |                                                     |
| description        | Text          |                                                     |
| link               | string        |                                                     |
| featured           | Boolean       |                                                     |
| featuredImageAsset | Asset or Null | { id, name, url }                                   |
| categories         | Category[]    | { id, name, parentCategories[], childCategories[] } |
| updatedDate        | Date          |                                                     |

[⬆Items](#3.3)

#### 3.3.6. `PUT` Update Item<a name="3.3.6"></a>

Another point to be noted is; we do not add content here. Because Content will
be just like "Add Item" (because Content without Item relation cannot be
created), it is pointless to update it.

```
.../api/items/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

_**Request Body** `Object`_

| Field              | Type          | Description                        |
| ------------------ | ------------- | ---------------------------------- |
| name               | String        | default: "Untitled Item", Optional |
| description        | Text          | Optional                           |
| link               | string        | Optional                           |
| featured           | Boolean       | default: false, Optional           |
| featuredImageAsset | Asset or Null | { id }, Optional                   |
| categories         | Category[]    | { id }, Optional                   |

_**Response Body** `Object`_

| Field              | Type          | Description                                         |
| ------------------ | ------------- | --------------------------------------------------- |
| id                 | Number        |                                                     |
| name               | String        |                                                     |
| description        | Text          |                                                     |
| link               | string        |                                                     |
| featured           | Boolean       |                                                     |
| featuredImageAsset | Asset or Null | { id, name, url }                                   |
| categories         | Category[]    | { id, name, parentCategories[], childCategories[] } |
| updatedDate        | Date          |                                                     |

[⬆Items](#3.3)

#### 3.3.7. `DELETE` Delete Item<a name="3.3.7"></a>

```
.../api/items/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

[⬆Items](#3.3)

### 3.4. Categories<a name="3.4"></a>

**Categories** are designed for grouping Item objects. Categories are in a
Parent-Child relationship with each other. In order to offer the possibility of
usage; a **Category** can be added to more than one **Category** as child if
desired.

**Endpoints**

1. [`GET` Get Categories](#3.4.1)
2. [`GET` Get Category](#3.4.2)
3. [`POST` Add Category](#3.4.3)
4. [`PUT` Update Category](#3.4.4)
5. [`DELETE` Delete Category](#3.4.5)

[⬆Api Documentation](#3)

#### 3.4.1. `GET` Get Categories<a name="3.4.1"></a>

```
.../api/categories
```

_**Response Body** `Array`_

| Field                | Type       | Description                                                          |
| -------------------- | ---------- | -------------------------------------------------------------------- |
| id                   | Number     |                                                                      |
| name                 | String     |                                                                      |
| description          | Text       |                                                                      |
| items                | Item[]     | { id, name, description, featured, featuredImageAsset, updatedDate } |
| parentCategories     | Category[] | { id, name }                                                         |
| childCategories      | Category[] | { id, name }                                                         |
| childCategoriesOrder | Number[]   | Not implemented                                                      |
| itemsOrder           | Number[]   | Not implemented                                                      |
| updatedDate          | Date       |                                                                      |

[⬆Categories](#3.4)

#### 3.4.2. `GET` Get Category<a name="3.4.2"></a>

```
.../api/categories/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

_**Response Body** `Array`_

| Field                | Type       | Description                                                          |
| -------------------- | ---------- | -------------------------------------------------------------------- |
| id                   | Number     |                                                                      |
| name                 | String     |                                                                      |
| description          | Text       |                                                                      |
| items                | Item[]     | { id, name, description, featured, featuredImageAsset, updatedDate } |
| parentCategories     | Category[] | { id, name }                                                         |
| childCategories      | Category[] | { id, name }                                                         |
| childCategoriesOrder | Number[]   | Not implemented                                                      |
| itemsOrder           | Number[]   | Not implemented                                                      |
| updatedDate          | Date       |                                                                      |

[⬆Categories](#3.4)

#### 3.4.3. `POST` Add Category<a name="3.4.3"></a>

```
.../api/categories
```

_**Request Body** `Object`_

| Field            | Type       | Description                            |
| ---------------- | ---------- | -------------------------------------- |
| name             | String     | default: "Untitled Category", Optional |
| description      | Text       | Optional                               |
| items            | Item[]     | [ ...id], Optional                     |
| parentCategories | Category[] | [ ...id ], Optional                    |
| childCategories  | Category[] | [ ...id ], Optional                    |

_**Response Body** `Array`_

| Field                | Type       | Description                                                          |
| -------------------- | ---------- | -------------------------------------------------------------------- |
| id                   | Number     |                                                                      |
| name                 | String     |                                                                      |
| description          | Text       |                                                                      |
| items                | Item[]     | { id, name, description, featured, featuredImageAsset, updatedDate } |
| parentCategories     | Category[] | { id, name }                                                         |
| childCategories      | Category[] | { id, name }                                                         |
| childCategoriesOrder | Number[]   | Not implemented                                                      |
| itemsOrder           | Number[]   | Not implemented                                                      |
| updatedDate          | Date       |                                                                      |

[⬆Categories](#3.4)

#### 3.4.4. `PUT` Update Category<a name="3.4.4"></a>

```
.../api/categories/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

_**Request Body** `Object`_

| Field            | Type       | Description                            |
| ---------------- | ---------- | -------------------------------------- |
| name             | String     | default: "Untitled Category", Optional |
| description      | Text       | Optional                               |
| items            | Item[]     | [ ...id], Optional                     |
| parentCategories | Category[] | [ ...id ], Optional                    |
| childCategories  | Category[] | [ ...id ], Optional                    |

_**Response Body** `Array`_

| Field                | Type       | Description                                                          |
| -------------------- | ---------- | -------------------------------------------------------------------- |
| id                   | Number     |                                                                      |
| name                 | String     |                                                                      |
| description          | Text       |                                                                      |
| items                | Item[]     | { id, name, description, featured, featuredImageAsset, updatedDate } |
| parentCategories     | Category[] | { id, name }                                                         |
| childCategories      | Category[] | { id, name }                                                         |
| childCategoriesOrder | Number[]   | Not implemented                                                      |
| itemsOrder           | Number[]   | Not implemented                                                      |
| updatedDate          | Date       |                                                                      |

[⬆Categories](#3.4)

#### 3.4.5. `DELETE` Delete Category<a name="3.4.5"></a>

```
.../api/categories/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

[⬆Categories](#3.4)

### 3.5. Options<a name="3.5"></a>

Note...

**Custom Types**

```javascript
enum OptionCategory {
  System = "system",
  Category = "category",
  Item = "item",
  Content = "content",
  Asset = "asset",
}

enum OptionType {
  Boolean = "boolean",
  String = "string",
  Number = "number",
}
```

**Endpoints**

1. [`GET` Get Options](#3.5.1)
2. [`GET` Get Option](#3.5.2)
3. [`POST` Add Option](#3.5.3)
4. [`PUT` Update Option](#3.5.4)
5. [`DELETE` Delete Option](#3.5.5)

[⬆Api Documentation](#3)

#### 3.5.1. `GET` Get Options<a name="3.5.1"></a>

```
.../api/options
```

_**Response Body** `Array`_

| Field    | Type           | Description |
| -------- | -------------- | ----------- |
| id       | Number         |             |
| name     | String         |             |
| category | OptionCategory |             |
| type     | OptionType     |             |
| value    | Text           |             |

[⬆Options](#3.5)

#### 3.5.2. `GET` Get Option<a name="3.5.2"></a>

```
.../api/options/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

_**Response Body** `Object`_

| Field    | Type           | Description |
| -------- | -------------- | ----------- |
| id       | Number         |             |
| name     | String         |             |
| category | OptionCategory |             |
| type     | OptionType     |             |
| value    | Text           |             |

[⬆Options](#3.5)

#### 3.5.3. `POST` Add Option<a name="3.5.3"></a>

```
.../api/options
```

_**Request Body** `Object`_

| Field    | Type           | Description                          |
| -------- | -------------- | ------------------------------------ |
| name     | String         | default: "Untitled Option", Optional |
| category | OptionCategory | default: "system", Optional          |
| type     | OptionType     | default: "boolean", Optional         |
| value    | Text           | Optional                             |

_**Response Body** `Object`_

| Field    | Type           | Description |
| -------- | -------------- | ----------- |
| id       | Number         |             |
| name     | String         |             |
| category | OptionCategory |             |
| type     | OptionType     |             |
| value    | Text           |             |

[⬆Options](#3.5)

#### 3.5.4. `PUT` Update Option<a name="3.5.4"></a>

```
.../api/options/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

_**Request Body** `Object`_

| Field    | Type           | Description                          |
| -------- | -------------- | ------------------------------------ |
| name     | String         | default: "Untitled Option", Optional |
| category | OptionCategory | default: "system", Optional          |
| type     | OptionType     | default: "boolean", Optional         |
| value    | Text           | Optional                             |

_**Response Body** `Object`_

| Field    | Type           | Description |
| -------- | -------------- | ----------- |
| id       | Number         |             |
| name     | String         |             |
| category | OptionCategory |             |
| type     | OptionType     |             |
| value    | Text           |             |

[⬆Options](#3.5)

#### 3.5.5. `DELETE` Delete Option<a name="3.5.4"></a>

```
.../api/options/:id
```

_**Request Params** `Number`_

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | Number | Required    |

[⬆Options](#3.5)
