# Реализация модуля (справочник)

Используется структура `repository -> service -> routes`.

## Общий принцип

- `repository`: содержит основную логику работы с БД (Mongoose-запросы, фильтры, агрегации, транзакции, маппинг данных).
- `service`: простой слой, который вызывает repository, держит минимальную оркестрацию и легкие бизнес-проверки.
- `routes`: простой Fastify-плагин с роутами, валидацией и обращением к сервисам.

## Рекомендуемый каркас модуля

```text
src/modules/<module-name>/
  repository.ts
  service.ts
  routes.ts
  types.ts
  schemas.ts
```

## Правила по слоям

### Repository

- Инкапсулирует доступ к коллекциям и моделям Mongoose.
- Возвращает предсказуемые структуры данных.
- Не зависит от Fastify request/reply.

### Service

- Держит сервисы простыми.
- Не дублирует тяжелую DB-логику из repository.
- Работает с ошибками доменного уровня и отдает результат для HTTP-слоя.

### Routes

- Реализуется как Fastify plugin.
- Определяет `method`, `url`, `schema`, handler.
- В handler выполняет минимум действий: извлечь входные данные, вызвать сервис, вернуть ответ.

## Мини-шаблон взаимодействия

```ts
// routes.ts
fastify.get("/items", async (request, reply) => {
  const result = await itemsService.list(request.query);
  return reply.send(result);
});
```

```ts
// service.ts
export const itemsService = {
  async list(params: ListParams) {
    return itemsRepository.list(params);
  },
};
```

```ts
// repository.ts
export const itemsRepository = {
  async list(params: ListParams) {
    return ItemModel.find(buildFilter(params)).lean();
  },
};
```
