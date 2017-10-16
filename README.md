# PEEP PEEP DON'T SLEEP

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/redpelicans/peep2.svg?branch=develop)](https://travis-ci.org/redpelicans/peep2)
[![codecov](https://codecov.io/gh/redpelicans/peep2/branch/develop/graph/badge.svg)](https://codecov.io/gh/redpelicans/peep2)



## Screenshots  

![Alt text](/../screenshots/notes.png?raw=true "Notes")
![Alt text](/../screenshots/worker.png?raw=true "Worker")
![Alt text](/../screenshots/workers.png?raw=true "Calendar")

## Context  

peep is the main tool for [redpelicans](http://www.redpelicans.com) to manage our consultants, clients, and produce invoices but it's also a training platform for our junior consultants to learn how to craft a web application made of ReactJS, a flux implementation (Redux here), FRP (Kefir), NodeJS, MongoDB and Docker.
 
Beyond librairies or products selected to build peep, the target is to find and teach good practices for web application design: 
 
* how to design stable, optimized http requests between front and server
* how to draw a clear separation of concern between front and server
* how to minimize requests between client and server
* how to manage relationships between model's entities (Client / Person / Mission / Agenda / Invoices / ...)
* how to cache/store data locally
* how to design a reactive client made of stores or streams
* how to build forms effectively
* how to reuse React components
* how to offer good rendering performances
* how to manage css
* how to be responsive 
* how to render natively
* how to push server side events
* and so on ....


It's an open source project, so you are welcome to collaborate, produce code or blogs and challenge us ...

peep is in its early stage, it was a POC, now a CRM Lite, calendar manager and a training platform and after tomorrow the basement for redpelicans information system and may be one day a market place to match Javascript client's requirements with redpelicans offer.

* we have a entity MongoDB model: Client, Person, Agenda, Events, Invoices, ...
* NodeJS offers CRUD services map with [evtx](https://github.com/redpelicans/evtx)
* application is fully reactive, communication between client and server is based on socket.io, many events are pushed to clients
* we use [Formik](https://github.com/jaredpalmer/formik) to manage forms
* Redux to manage the event side of our SPA
* an android version should arrive very soon ...
* other techno: ramdaJS, recompose, jest, blueprintJS, StyledComponents, yup, CRA, and ...

## Next Steps 

* Write tests (react, redux, server side) *(IN PROGRESS)*
* Use Authentification for web, socketio, isomorphic code and android *(IN PROGRESS)*
* Go live for first version (CRM Lite)  *(DONE)*
* write documentation
* Add features 
* Enrich CRM Lite version
* Be native *(IN PROGRESS)*
* Offer disconnected CRUD functionalities
* continuous deployment (DONE)

## Setup

    $ npm install -g yarn codecov
    $ yarn

## Launch server

setup `params.js` then launch:

    $ yarn srv:dev

## Launch client

    $ yarn start
