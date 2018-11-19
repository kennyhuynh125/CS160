# CS160 - LetItFly

  

CS160 Software Engineering Project

You can view the site on: https://letitfly160.herokuapp.com

  

  

# Getting Started

  

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

  

  

## Prerequisites

  

You will need the following software installed:

  

- Node/NPM [Link Here](https://nodejs.org/en/)

  

- Git [Link Here](https://git-scm.com/downloads)

  

- Python3 or higher [Link Here](https://www.python.org/downloads/)

  

- Pip [Link Here](https://pip.pypa.io/en/stable/installing/)

  

After installing all the software, we need to make sure all are correctly installed.

  

### To test if Node/NPM is installed correctly

Open a terminal/command prompt and type in the following

  

    node -v

This will test for Node and you should get something like this:

  

    v6.11.2

For NPM:

  

    npm -v

You should get something like this:

  

    3.10.10

### To test if Git is installed correctly

Open a terminal/command prompt and type in the following:

  

    git --version

You should get something like this:

  

    git version 2.14.1.windows.1

### To test if Python is installed correctly

Open a terminal/command prompt and type in the following:

  

    python

You should get something like this:

```

Python 3.5.0 (v3.5.0:374f501f4567, Sep 13 2015, 02:27:37) [MSC v.1900 64 bit (AMD64)] on win32

Type "help", "copyright", "credits" or "license" for more information.

>>>

```

This will open a Python process, all you need to do is type `exit()` on the terminal/command prompt.

  

### To test if Pip is installed

Open a terminal/command prompt and type in the following:

  

    pip --version

You should get something like this:

  

    pip 9.0.1 from c:\users\andy\appdata\local\programs\python\python35\lib\site-packages (python 3.5)

  
Warning: Some of the project dependencies do not function with pip version 18.1! Use version pip 18.0 instead.


Now all of our software are installed correctly!

  

## Installing

First, you will need a clone of the repo. Open a terminal/command prompt and type in the following

    git clone https://github.com/kennyhuynh125/CS160.git

This will download the repo into your current directory. Change directory to the repo.

Next, you will need to install all the dependencies for both the React side and Django side.
  

## To install dependencies on React side

You need to change directory to the `client` folder. `cd client`

After changing into the client folder, run the following command:

    npm install

This will download all the dependencies used. After it is done, to test if everything is working correctly, run the following command:

    npm start

This will start up the React application. After it is done starting up, go to `localhost:3000` and you should see a landing page. (picture of landing page is on our Google Drive under the images folder)

## To install dependencies on Django side

To install all the dependencies used for our project, run the following command:

    pipenv install

This will download all the dependencies. After it is done, to test if everything is working correctly, run the follwoing commands:

    pipenv shell

    cd server

    python manage.py runserver

This will start up the server. After it is done starting up, go to `localhost:8000` and you should the landing page. (picture of landing page is on our Google Drive under the images folder)

## Database Setup and Environment Variables

Our database is hosted on Amazon RDS. We use environment variables to store our database credentials for security purposes.
The environment variables that need to be set up are:

`
DB_HOST
DB_NAME
DB_PASSWORD
DB_USER
`

To get the credentials for this, please contact one of our members.
