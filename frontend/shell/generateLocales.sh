#!/usr/bin/env bash

ng xi18n --locale ru --out-file locales/messages.ru.xlf;
ng xi18n --locale fr --out-file locales/messages.fr.xlf;

node frontend/i18n.js;
