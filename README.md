# Quantified Self API



This project is an experimental work for a master thesis created by [Rémy Hannequin](https://github.com/rhannequin) and [Hervé Tran](https://github.com/Jagbomb).

## Requirements

Make sure you have MongoDB installed. Create a database named `qsapi`.

## How to run it

    cd qsapi

:exclamation: If your `$PATH` doesn't contain `./node_modules/.bin`, you have to install several packages globally:

    (sudo) npm install -g express nodemon jasmine-node

Then install locally the project requirements and run the app:

    npm install
    nodemon app.js

## Run tests

    jasmine-node ./tests

`[TODO]` You may need to exit the command once the tests have passed.
