## mvdxmlserver

Server wrapper around the mvdXMLChecker.jar

### Installation

- Check out the mvdXMLChecker project
- Compile and export jar, using mvdXMLCheckerTest as a main class so that it can be executed from command line
- Name it mvdXMLChecker.jar and place it in the root directory of this repository
- Run "npm install" from the root directory of this repository

To start the server use:

    node server.js <url> <username> <password>

Where the url, username and password correspond to a user on a running bimserver that can create new projects and upload files to them.

### Open issues

- Update mvdXMLChecker java project to work without a running bimserver, or with configurable bimserver. Current blocker is the fact that the project is built against 1.3 bimserver code.