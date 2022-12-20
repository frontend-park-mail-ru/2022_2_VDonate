# Patreon frontend by VDonate

Фронтенд для итогового проекта 2 семестра проекта "VK образование" команды ВДонате.

### [Бэкенд](https://github.com/go-park-mail-ru/2022_2_VDonate)
### [Trello](https://trello.com/b/BZHoJsHP/vdonate)
### [Swagger](https://app.swaggerhub.com/apis-docs/zeronethunter/v-donate_api/1.0)
### [Деплой](https://vdonate.ml/)

### Состав команды:
- [Иван Гапоян](https://github.com/Loen15)
- [Леонард Пак](https://github.com/MrLeonardPak)
- [Иван Мильченко](https://github.com/themilchenko)
- [Альберт Кашапов](https://github.com/zeronethunter)

### Менторы:
- [Олег Реуцкий](https://github.com/astlok) - backend
- [Сергей Тяпкин](https://github.com/SergTyapkin) - frontend
- [Ксения Самойлова](https://github.com/somebody-kseny) - frontend

## Основные команды для работы
> Не коммитить в product окружении. На коммиты стоят хуки на eslint
### Инициализация проекта:
Production
```
npm ci --omit=dev
```
Development
```
npm ci
```
---
### Сборка проекта:
Production
```
npm run build:prod
```
Development
```
npm run build:dev
```
---
### Запуск Webpack сервера на порту **4200** для разработки:
```
npm start
```
для автоматического открытия окна браузера
```
npm start -- --open
```
---
### Запуск анализатора пакетов Webpack, позволяющий получить визуализацию того, что находится в пакете.
```
npm run stats
```
---
### Запуск eslint
Отображение ошибок
```
npm run lint
```
Исправление ошибок
```
npm run lint:fix
```