#TODO App:
Rewrite entire of above section!
# Overview
Test tag
This repository is aimed to provide Frontend Layer for Upme product, exclude any automation services such as:
automate sending mail, data cleanup, ....

## Technology Stack

1. ReactJS
2. Docker
5. MongoDB

## Infrasctucture
1. GCP
2. Mongo Atlas

## Deployment

Because infrastructure of Upme is based on GCP, so we will use k8s to deploy the application

1. We wil build the current src into image, then submit it to image registry
Production:
```bash
gcloud builds submit --tag asia.gcr.io/upme-322304/prod-upme-ui:1.0 .
```
Test:
```bash
gcloud builds submit --tag asia.gcr.io/upme-test/upme-ui:0.1.10 .
```

2. We set image version, and let k8s controller knows there is a new update of application
Production
```
kubectl set image deployment be-upme-deployment be-upme-prod=asia.gcr.io/upme-322304/prod-upme-ui:1.0
```

Test
```
kubectl set image deployment fe-upme-deployment fe-upme-test=asia.gcr.io/upme-test/upme-ui:0.1.10
```
3. Check status of deployment
```
kubectl rollout status deployment be-upme-deployment
```

## Local Setup
1. Use Dockerfile as virtualization solution for local environment
2. If you don't have docker setup, you can manually steup the local environment with nodejs, mongodb

## Architecture
We will follow 3-tiers architecture, where we will have:
* ReactJS as presentation layer (not included in this repo)
* NodeJS as business layer
* MongoDB as data layer (persistent layer)

We will not follow ts because the ability of ease for development.
Most of the file will be considered as modules, and need to be imported, 
this might be resolved at a time when we run npm run, thanks to bin/postinstall.js and bin/preinstall.js
Directory Structures:
### upme-node-api/bin
This dir will hold the scripts that need to be executed before and after npm run. 
This helps to generate, include dependencies as modules
### upme-node-api/src
This dir will be centre of application:
* app, where we will hold the routes, api endpoints, business logic and some helpers
    * api, contains routes and endpoints
    * controller, perform business logics, interact with data layer, helpers and other controllers
    * templates, used for html || csv || excel || etc template, this will be parsed later
    * util, contains some common helpers
* config, all settings will be stored here
* database, this is where connection, schema, entity, query will be constructed
* log, storing logs
* middleware, perform some middleware of activities between HTTP and API endpoint

## Contributing
1. Vu Dinh Toan (Mike) <vudinhtoan2990@gmail.com>

## License
Geek Hub Solution JSC All Rights Reserved
