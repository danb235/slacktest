# slacktest
Use NodeJS, Mocha, Request and Chai to test `POST /files.upload`

## Environment Setup
### Dependencies
Install Node and NPM on OSX (tested on 10.9). NodeJS is the scripting language used for the test and must be installed on your system.  The quickest way to do this is via brew.  To install brew, then node:
```bash
ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go/install)"
brew install node
```

### Install

```bash
git clone git@github.com:tkdan235/slacktest.git
cd slacktest
npm install
```

## Running the test

The access token used in the test will most likely be out of date.  Head to the slack token page to get a token, and update the access token variable in `files_upload_post_mocha.js`:

```javascript
var accessToken = '?token=xoxp-2562897258-2562897260-2562947180-dea22d';
```

Enter the following command in the project directory:
```bash
node_modules/.bin/mocha --slow 1000 --timeout 15000 -R spec ./files_upload_post_mocha.js
```

Expected output:
```bash
  When performing a slack file upload test,
    ✓ should upload png and verify file object response (4059ms)
    ✓ should download original image and verify expected length (1238ms)
    ✓ should download 64 thumbnail and verify expected length
    ✓ should download 80 thumbnail and verify expected length (990ms)
    ✓ should download 360 thumbnail and verify expected length (787ms)
    ✓ should confirm file sizes correspond to thumbnail size by length


  6 passing (8s)
```

