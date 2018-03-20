#!/usr/bin/env bash

ng xi18n --locale en --out-file locales/messages.en.xlf;
ng xi18n --locale ru --out-file locales/messages.ru.xlf;

node frontend/i18n.js;
