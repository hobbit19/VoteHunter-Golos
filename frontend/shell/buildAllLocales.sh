#!/usr/bin/env bash

ng build --prod --output-path web/bundles/en/ --deploy-url /bundles/en/ --locale en --i18nFile frontend/locales/messages.en.xlf --missing-translation ignore;
ng build --prod --output-path web/bundles/ru/ --deploy-url /bundles/ru/ --locale ru --i18nFile frontend/locales/messages.ru.xlf --missing-translation ignore;
