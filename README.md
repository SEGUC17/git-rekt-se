Git-Rekt SE Project
============


## Demo

###### Live Demo

https://git-rekt.me/

---

## Setup
1. Clone this repo to your desktop `git clone https://github.com/melzareix/git-rekt-se.git`
2. Run `npm install` to install all the dependencies.
3. Create a MongoDB title `gitrekt_db`.
4. Create `.env` file with the following constants:
    - `PORT`, The port number to run the project.
    - `JWT_KEY_CLIENT`, The secret key used to sign Client JWT Tokens.
    - `JWT_KEY_BUSSINES`, The secret key used to sign Business JWT Tokens.
    - `JWT_KEY_ADMINISTRATOR`, The secret key used to sign Admin JWT Tokens.
    - `DB_URL`, The URL to MongoDB database.
    - `SEND_GRID`, Your Send Grid API Key used to set reset password link.
    - `FB_APP_ID`, Facebook Application ID.
    - `FB_APP_SECRET`, Facebook Application Secret.
    - `FB_CALLBACK`, Facebook Callback link `http://localhost:3000/api/v1/client/auth/fb/callback`.
    - `DEBUG_MODE`, SET to 1 to enable debugging middlewares.
    - `ADD_DELAY`, SET to 1 to add delay to requests for testing.

---

## Usage

Run `npm start` to start in **production** mode, `npm run debug` to run using [nodemon](https://nodemon.io/) in debug mode.

---

## Docs
API **V1** Documentation [Partial Documentation]
[https://gitrekt-se.restlet.io/](https://gitrekt-se.restlet.io/)

---
## License
>You can check out the full license [here](https://github.com/melzareix/met-portfolio/blob/master/LICENSE)

This project is licensed under the terms of the **MIT** license.
