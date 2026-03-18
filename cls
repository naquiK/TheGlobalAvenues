warning: in the working copy of 'eslint.config.js', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/App.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/components/About.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/components/Contact.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/components/Footer.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/components/Header.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/components/Hero.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/components/PortfolioDisplay.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/components/Services.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/config.js', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/pages/AboutPage.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/pages/CollaboratePage.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/pages/EducationProgramPage.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/pages/HomePage.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/pages/NewsDetailPage.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/pages/NewsVlogPage.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/pages/UniversitiesPage.jsx', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/eslint.config.js b/eslint.config.js[m
[1mindex cee1e2c..8f86239 100644[m
[1m--- a/eslint.config.js[m
[1m+++ b/eslint.config.js[m
[36m@@ -1,29 +1,42 @@[m
[31m-import js from '@eslint/js'[m
[31m-import globals from 'globals'[m
[31m-import reactHooks from 'eslint-plugin-react-hooks'[m
[31m-import reactRefresh from 'eslint-plugin-react-refresh'[m
[31m-import { defineConfig, globalIgnores } from 'eslint/config'[m
[32m+[m[32mimport js from '@eslint/js';[m
[32m+[m[32mimport globals from 'globals';[m
[32m+[m[32mimport reactHooks from 'eslint-plugin-react-hooks';[m
[32m+[m[32mimport reactRefresh from 'eslint-plugin-react-refresh';[m
 [m
[31m-export default defineConfig([[m
[31m-  globalIgnores(['dist']),[m
[32m+[m[32mexport default [[m
[32m+[m[32m  {[m
[32m+[m[32m    ignores: ['dist'],[m
[32m+[m[32m  },[m
[32m+[m[32m  js.configs.recommended,[m
   {[m
     files: ['**/*.{js,jsx}'],[m
[31m-    extends: [[m
[31m-      js.configs.recommended,[m
[31m-      reactHooks.configs['recommended-latest'],[m
[31m-      reactRefresh.configs.vite,[m
[31m-    ],[m
     languageOptions: {[m
[31m-      ecmaVersion: 2020,[m
[31m-      globals: globals.browser,[m
[32m+[m[32m      ecmaVersion: 'latest',[m
[32m+[m[32m      sourceType: 'module',[m
[32m+[m[32m      globals: {[m
[32m+[m[32m        ...globals.browser,[m
[32m+[m[32m      },[m
       parserOptions: {[m
[31m-        ecmaVersion: 'latest',[m
[31m-        ecmaFeatures: { jsx: true },[m
[31m-        sourceType: 'module',[m
[32m+[m[32m        ecmaFeatures: {[m
[32m+[m[32m          jsx: true,[m
[32m+[m[32m        },[m
       },[m
     },[m
[32m+[m[32m    plugins: {[m
[32m+[m[32m      'react-hooks': reactHooks,[m
[32m+[m[32m      'react-refresh': reactRefresh,[m
[32m+[m[32m    },[m
     rules: {[m
[31m-      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],[m
[32m+[m[32m      ...reactHooks.configs.recommended.rules,[m
[32m+[m[32m      ...reactRefresh.configs.vite.rules,[m
[32m+[m[32m      'react-refresh/only-export-components': 'off',[m
[32m+[m[32m      'no-unused-vars': [[m
[32m+[m[32m        'error',[m
[32m+[m[32m        {[m
[32m+[m[32m          argsIgnorePattern: '^(index|[A-Z_])',[m
[32m+[m[32m          varsIgnorePattern: '^(motion|[A-Z_])',[m
[32m+[m[32m        },[m
[32m+[m[32m      ],[m
     },[m
   },[m
[31m-])[m
[32m+[m[32m];[m
[1mdiff --git a/package-lock.json b/package-lock.json[m
[1mindex 6cbe96d..fa7eee6 100644[m
[1m--- a/package-lock.json[m
[1m+++ b/package-lock.json[m
[36m@@ -1655,9 +1655,9 @@[m
       }[m
     },[m
     "node_modules/ajv": {[m
[31m-      "version": "6.12.6",[m
[31m-      "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.12.6.tgz",[m
[31m-      "integrity": "sha512-j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==",[m
[32m+[m[32m      "version": "6.14.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.14.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-IWrosm/yrn43eiKqkfkHis7QioDleaXQHdDVPKg0FSwwd/DuvyX79TZnFOnYpB7dcsFAMmtFztZuXPDvSePkFw==",[m
       "dev": true,[m
       "license": "MIT",[m
       "dependencies": {[m
[36m@@ -2235,12 +2235,16 @@[m
       "license": "MIT"[m
     },[m
     "node_modules/cookie": {[m
[31m-      "version": "1.0.2",[m
[31m-      "resolved": "https://registry.npmjs.org/cookie/-/cookie-1.0.2.tgz",[m
[31m-      "integrity": "sha512-9Kr/j4O16ISv8zBBhJoi4bXOYNTkFLOqSL3UDB0njXxCXNezjeyVrJyGOWtgfs/q2km1gwBcfH8q1yEGoMYunA==",[m
[32m+[m[32m      "version": "1.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/cookie/-/cookie-1.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-ei8Aos7ja0weRpFzJnEA9UHJ/7XQmqglbRwnf2ATjcB9Wq874VKH9kfjjirM6UhU2/E5fFYadylyhFldcqSidQ==",[m
       "license": "MIT",[m
       "engines": {[m
         "node": ">=18"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "opencollective",[m
[32m+[m[32m        "url": "https://opencollective.com/express"[m
       }[m
     },[m
     "node_modules/cross-spawn": {[m
[36m@@ -3040,9 +3044,9 @@[m
       }[m
     },[m
     "node_modules/flatted": {[m
[31m-      "version": "3.3.3",[m
[31m-      "resolved": "https://registry.npmjs.org/flatted/-/flatted-3.3.3.tgz",[m
[31m-      "integrity": "sha512-GX+ysw4PBCz0PzosHDepZGANEuFCMLrnRTiEy9McGjmkCQYwRq4A/X786G/fjM/+OjsWSU1ZrY5qyARZmO/uwg==",[m
[32m+[m[32m      "version": "3.4.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/flatted/-/flatted-3.4.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-IxfVbRFVlV8V/yRaGzk0UVIcsKKHMSfYw66T/u4nTwlWteQePsxe//LjudR1AMX4tZW3WFCh3Zqa/sjlqpbURQ==",[m
       "dev": true,[m
       "license": "ISC"[m
     },[m
[36m@@ -4002,9 +4006,9 @@[m
       "license": "MIT"[m
     },[m
     "node_modules/js-yaml": {[m
[31m-      "version": "4.1.0",[m
[31m-      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.1.0.tgz",[m
[31m-      "integrity": "sha512-wpxZs9NoxZaJESJGIZTyDEaYpl0FKSA+FB9aJiyemKhMwkxQg63h4T1KJgUGHpTqPDNRcmmYLugrRjJlBtWvRA==",[m
[32m+[m[32m      "version": "4.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-qQKT4zQxXl8lLwBtHMWwaTcGfFOZviOJet3Oy/xmGk2gZH677CJM9EvtfdSkgWcATZhj/55JZ0rmy3myCT5lsA==",[m
       "dev": true,[m
       "license": "MIT",[m
       "dependencies": {[m
[36m@@ -4211,9 +4215,9 @@[m
       }[m
     },[m
     "node_modules/minimatch": {[m
[31m-      "version": "3.1.2",[m
[31m-      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.2.tgz",[m
[31m-      "integrity": "sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==",[m
[32m+[m[32m      "version": "3.1.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-VgjWUsnnT6n+NUk6eZq77zeFdpW2LWD