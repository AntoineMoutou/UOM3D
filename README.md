# Node Server
## Presentation
The node server permits to save the data on this server.
It performs the folowing tasks :

 - Reception of the data send by the client (string)
 - Conversion of this string in .zip
 - Saving of the zip on the server
 - Openinge of the .zip and saving of the unzipped data in the folder named data
 - Reception of any GET request to access at the data saved
 - Sending of the data requested by GET request

## Installation

Please install nodejs following the link below :

https://nodejs.org/en/

If you work behind a proxy, open a command prompt to set the proxy :
```sh
npm config set proxy http://10.0.4.2:3128
npm config set https-proxy http://10.0.4.2:3128
```

To install node modules, open a command prompt in the folder named UOM3D and Pour installer le node, ouvrez un invite de commande dans le dossier SWAG and type :

```sh
$ cd server
$ npm install
```

npm will install in a folder named node-modules the following modules :

 -  http        : to create the server
 -  express     : to make easier the low-level language in node
 -  url         : to have the name of the url
 -  querystring : to make a dictionary with the GET arguments
 -  fs          : to write and read files and folders
 -  unzip2      : to unzip the .zip written of the file
 -  multer      : to manage the reception of formdata
 -  JSZip       : to manage the zip

## Server launch

Once the modules installed, you can launch the server with the following command :

```sh
$ node server.js
```

## Server console analysis
The server reports his launch at the user with the sentence :

```sh
Server open at http://127.0.0.1:8080/
```

After the load of a zip by the sever, the server display a message :

```sh
zip/1854_emprise.zip written.
Extracted zip/1854_emprise.zip in folder python/shp.
```

## Developer Documentation
To help developers, the fonctions of the script server.js have been documented in the script comments.
