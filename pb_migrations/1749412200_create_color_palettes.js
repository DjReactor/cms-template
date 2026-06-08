/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // Skip if collection already exists
  try { app.findCollectionByNameOrId("color_palettes"); return; } catch (_) {}

  const collection = new Collection({
    "id": "color_palettes_col",
    "name": "color_palettes",
    "type": "base",
    "system": false,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "Display name for this palette",
        "hidden": false,
        "id": "text_palette_name",
        "max": 100,
        "min": 1,
        "name": "name",
        "pattern": "",
        "presentable": true,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "help": "JSON object mapping the 10 color slot keys to hex values",
        "hidden": false,
        "id": "json_palette_colors",
        "maxSize": 5242880,
        "name": "colors",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "json"
      },
      {
        "help": "Used to sort palettes in the UI",
        "hidden": false,
        "id": "number_sort_order",
        "max": null,
        "min": null,
        "name": "sort_order",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_color_palettes_name` ON `color_palettes` (`name`)",
      "CREATE INDEX `idx_color_palettes_sort_order` ON `color_palettes` (`sort_order`)"
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.id != ''",
    "updateRule": "@request.auth.id != ''",
    "deleteRule": "@request.auth.id != ''"
  });

  return app.save(collection);
}, (app) => {
  // Down: drop the collection
  try {
    const collection = app.findCollectionByNameOrId("color_palettes");
    return app.delete(collection);
  } catch (_) {}
});
