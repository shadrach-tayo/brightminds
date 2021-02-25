## install sequelize-cli
```
npm i -g sequelize-cli
```

## generate migration file
```
cd database
sequelize-cli migration:create --name [name of migration]
```
## Run migrations
```
npm run db:migration
```

## generate seed file
```
sequelize-cli seed:create --name [name of seed]
```

## Run db seed
```
npm run db:seed // to see all

```